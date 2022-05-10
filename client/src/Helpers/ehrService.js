import EhrEntry from "./ehrEntry";
import CreateFileObjectError from "./Errors/createFileObjectError";
import fetchFileContentError from "./Errors/FetchFileContentError";
import UploadFileError from "./Errors/uploadFileError";
import FileService from "./fileService";
import { database, get, child } from "../../firebaseSetup";
import { ref, update, set, getDatabase } from "firebase/database";
import FetchFileContentError from "./Errors/FetchFileContentError";
import { PlaceholderValues } from "../placeholders/placeholderValues";
import * as crypt from "../../Crypto/crypt";
import { getAuth } from "@firebase/auth";
import crypto, { createPrivateKey } from "crypto";
import ChainOperationDeniedError from "../chainConnection/chainOperationDeniedError";
import ChainConnectionFactory from "../chainConnection/chainConnectionFactory";
import CouldNotLoadPermittedRegionsError from "./Errors/couldNotLoadPermittedRegionsError";
import ChainConnectionError from "../chainConnection/chainConnectionError";
import CouldNotLoadRegionsError from "./Errors/couldNotLoadRegionsError";

export default class EHRService {
  // Class variables
  static chainConnection = ChainConnectionFactory.getChainConnection();
  static privateKey;
  static publicKey;

  // Setters
  static async setPrivateKey(newPrivateKey) {
    this.privateKey = newPrivateKey;
  }
  static async setPublicKey(newPublicKey) {
    this.publicKey = newPublicKey;
  }

  /**
   * Derives symmetric key from password and salt,
   * fetches private and public keys,
   * and uses symmetric key to decrypt private key.
   * Then sets the class instance's private and public key variables to these keys.
   * @param  {String} password
   * @param  {String} salt
   * @author Christopher Molin
   */
  static async setKeys(password, salt) {
    let symmetricKey = await crypt.derivePrivateKeyFromPassword(password, salt);

    let encryptedPrivateKeyAndIV = await this.getEncPrivateKeyAndIV();
    let encryptedData = encryptedPrivateKeyAndIV.slice(46);
    let iv = encryptedPrivateKeyAndIV.slice(0, 44);
    let keyAndIv = { encryptedData, iv };

    let privKey = await crypt.decryptPrivateKey(keyAndIv, symmetricKey);

    this.setPrivateKey(privKey);

    let pubKey = await this.getPublicKey();

    this.setPublicKey(pubKey);

    this.setPrivateKey(privKey);

    console.warn(this.privateKey);
    console.warn(this.publicKey);

    console.log(
      "Password:" + password + "\nSalt:" + salt + "\nSymmetric:" + symmetricKey
    );
    console.log("Private:" + privKey + "\nPublic:" + pubKey);
  }

  /**
   * Fetches API-token to Web3Storage from Firebase
   * @returns {Promise<String>} apiToken to Web3Storage
   * @throws
   * @author Christopher Molin
   */
  static async getWeb3StorageToken() {
    let dbRef = ref(database);
    let apiToken = null;
    await get(child(dbRef, "Web3Storage-Token"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          apiToken = snapshot.val();
        } else {
          throw "No data available";
        }
      })
      .catch((error) => {
        throw error;
      });
    return apiToken;
  }

  /**
   * (ONLY AVAILABLE FOR CURRENLY LOGGED IN USER) - Fetches the public key for the currently logged in patient.
   * @returns {Promise<String>} returns the public key for the current user.
   * @author David Zamanian
   */

  static async getPublicKey() {
    let publicKey;
    const auth = getAuth();
    let dbRef = ref(database);
    await get(child(dbRef, "mapUser/" + auth.currentUser.uid + "/publicKey/"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          publicKey = snapshot.val();
        } else {
          throw "No data available";
        }
      })
      .catch((error) => {
        throw error;
      });
    return publicKey;
  }

  /**
   * Fetches the public key for the user of the provided UID
   * @returns {Promise<String>} returns the public key for the current user.
   * @author David Zamanian
   */

  static async getPublicKeyWithUID(UID) {
    let publicKey;
    let dbRef = ref(database);
    await get(child(dbRef, "mapUser/" + UID + "/publicKey/"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          publicKey = snapshot.val();
        } else {
          throw "No data available";
        }
      })
      .catch((error) => {
        throw error;
      });
    return publicKey;
  }

  /** Pass a user SSN and get back the respective UID
   *
   * @param {String} SSN
   * @returns {Promise<String>}UID of the user
   * @author David Zamanian
   */
  static async getUIDFromSSN(SSN) {
    let getUID;
    let dbRef = ref(database);
    await get(child(dbRef, "mapUserSSNtoUID/" + SSN))
      .then((snapshot) => {
        if (snapshot.exists()) {
          getUID = snapshot.val();
        } else {
          throw "No data available";
        }
      })
      .catch((error) => {
        throw error;
      });
    return getUID;
  }

  /** Pass a user UID and get back the respective SSN
   *
   * @param {String} UID
   * @returns {Promise<String>}
   * @author David Zamanian
   */
  static async getSSNFromUID(UID) {
    console.log("In function");
    let getSSN = "";
    let dbRef = ref(database);
    await get(child(dbRef, "mapUser/" + UID))
      .then((snapshot) => {
        console.log("snapshot: " + snapshot);
        if (snapshot.exists()) {
          console.log("snapshot: " + snapshot);
          console.log("snapshot.val(): " + snapshot.val());
          console.log("snapshot.val().SSN: " + snapshot.val().SSN);
          getSSN = snapshot.val().SSN;
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.log("error: " + error);
      });
    return getSSN;
  }

  /**
   * Fetches the encrypted private key (and IV) of the current user from Firebase.
   * @returns returns the encrypted private key + IV of the currently logged in user
   * @author David Zamanian
   */

  static async getEncPrivateKeyAndIV() {
    let encryptedPrivateKey;
    const auth = getAuth();
    let dbRef = ref(database);
    await get(
      child(dbRef, "mapUser/" + auth.currentUser.uid + "/IvAndPrivateKey/")
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          encryptedPrivateKey = snapshot.val();
        } else {
          throw "No data available";
        }
      })
      .catch((error) => {
        throw error;
      });
    return encryptedPrivateKey;
  }

  /**
   * Fetches the current doctor's encrypted record key for the provided patient.
   * @param {String} patientID The SSN/patientID of the patient
   * @returns {*} The record key of the specified patient (if permission is granted)
   * @author David Zamanian
   */

  static async getDoctorRecordKey(patientID) {
    let encDoctorRecordKey;
    const auth = getAuth();
    let dbRef = ref(database);
    await get(
      child(
        dbRef,
        "DoctorToRecordKey/" +
          auth.currentUser.uid +
          "/recordKeys/" +
          patientID +
          "/recordKey/"
      )
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          encDoctorRecordKey = snapshot.val();
        } else {
          //Maybe do something else here
          throw "Doctor does not have permission to view this patient's records";
        }
      })
      .catch((error) => {
        throw error;
      });
    return encDoctorRecordKey;
  }
  /**
   * Fetches the current patient's record key.
   * @returns The encrypted record key of the currently logged in patient
   * @author David Zamanian
   */

  static async getPatientRecordKey() {
    let encPatientRecordKey;
    const auth = getAuth();
    let dbRef = ref(database);
    await get(
      child(dbRef, "PatientToRecordKey/" + auth.currentUser.uid + "/recordKey")
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          encPatientRecordKey = snapshot.val();
        } else {
          //Maybe do something else here
          console.error("GetPatientRecordKey Error: " + auth.currentUser.uid);
          throw "Something went wrong";
        }
      })
      .catch((error) => {
        throw error;
      });
    return encPatientRecordKey;
  }

  /**
   * Update recordKeys for all involed doctors when updating permitted regions
   *
   * Need access to: Firebase, recordKey of patient and publicKey of doctor
   * @param {String} patientID
   * @param {Array<String>} newPermittedRegions
   * @author David Zamanian
   */

  static async updateRecordKeys(newPermittedRegions, patientID) {
    let p = await this.getPatientRegions(patientID);
    var permitted = new Set();
    p.map((item) => permitted.add(item));
    console.log("permittedRegions: " + p);
    //Values disappear when creating a set with them..
    //let permitted = new Set(p);
    console.log("permittedRegions: " + Array.from(permitted));

    //the new permitted regions
    let newPermitted = new Set(newPermittedRegions);
    console.log("newPermitted: " + Array.from(newPermitted));
    //The common regions between permitted and newPermitted. Basically A intersect B
    let permitted_intersect_newPermitted = new Set(
      [...permitted].filter((x) => newPermitted.has(x))
    );
    console.log(
      "intersection: " + Array.from(permitted_intersect_newPermitted)
    );
    //All the deleted regions (from permitted). Basically A - (A intersect B)
    let deletedRegions = new Set(
      [...permitted].filter((x) => !permitted_intersect_newPermitted.has(x))
    );
    console.log("deleted regions: " + Array.from(deletedRegions));
    //All the new regions that was added. Basically B - (A intersect B)
    let addedRegions = new Set(
      [...newPermitted].filter((x) => !permitted_intersect_newPermitted.has(x))
    );
    console.log("addedRegions: " + Array.from(addedRegions));

    //Make array of all the added doctors
    let addedDoctors = [""];
    addedDoctors = await this.pushDoctorsToList(Array.from(addedRegions));

    //Make array of all the removed doctors
    let removedDoctors = [""];
    removedDoctors = await this.pushDoctorsToList(Array.from(deletedRegions));

    //Go through all doctors in database and check if added or removed
    console.log("All assignments are done");
    let dbRef = ref(database);
    const DoctorToRecordKeySnapshot = await get(
      child(dbRef, "DoctorToRecordKey/")
    );
    //For each doctor (that has a recordKey, but basically all doctors in the system)

    //This should only be for removedDoctors. addedDoctors should not be in this forEach clause
    if (DoctorToRecordKeySnapshot.exists() && removedDoctors.length > 0) {
      console.log("removedDoctors: " + removedDoctors + " Time: " + Date.now());
      //Go over every item in removedDoctors and remove the respective recordKey from the database
      for (let doctorSSN of removedDoctors) {
        console.log(
          "DoctorToRecordKeySnapshot.val(): " +
            Object.keys(DoctorToRecordKeySnapshot.val())
        );
        let doctorUID = await EHRService.getUIDFromSSN(doctorSSN);
        for (let fireBasedoctorUID of Object.keys(
          DoctorToRecordKeySnapshot.val()
        )) {
          console.log("inside 1");
          const listOfRecordKeysSnapshot = await get(
            child(
              dbRef,
              "DoctorToRecordKey/" + fireBasedoctorUID + "/recordKeys/"
            )
          );
          //For some reason this is null sometimes, but this check fixes that and everything is removed correctly
          if (listOfRecordKeysSnapshot.val() != null) {
            console.log("inside 2");
            let listOfUserRecordKeys = [];

            console.log(
              "Object.keys(listOfRecordKeysSnapshot.val()): " +
                Object.keys(listOfRecordKeysSnapshot.val())
            );
            for (let SSN of Object.keys(listOfRecordKeysSnapshot.val())) {
              listOfUserRecordKeys.push(SSN);
            }
            console.log("inside 3");
            //Object.keys(DoctorToRecordKeySnapshot.val()).forEach(async function (child)
            //If the doctor is in the list of removed doctors, remove that recordKey from database

            console.log("Inside 3.5");
            console.log("DoctorUID: " + doctorUID);
            console.log("fireBaseDoctorUID: " + fireBasedoctorUID);
            console.log("index: " + listOfUserRecordKeys.indexOf(patientID));
            if (
              doctorUID == fireBasedoctorUID &&
              listOfUserRecordKeys.indexOf(patientID) > -1
            ) {
              console.log("inside 4");
              //let doctorSSN = await EHRService.getSSNFromUID(doctorUID);
              console.log("doctorUID: " + doctorUID);
              console.log("doctorSSN: " + doctorSSN);

              //This runs before removeDoctors is fully updated (works if you change one or few permissions at a time but too many and it is not updated)
              //TODO    Add check here for the patient SSN!!!!!!

              console.log("Doctor was found in removed list");
              const dataToSave = {
                recordKey: null,
              };
              const updates = {};
              updates[
                "DoctorToRecordKey/" + doctorUID + "/recordKeys/" + patientID
              ] = dataToSave;

              update(dbRef, updates)
                .then(() => {
                  console.log("Data removed successfully");
                })
                .catch((e) => {
                  console.log("Data could not be removed due to: " + e);
                });
              console.log("RecordKey should have been removed");
            }
          }
        }
      }
    }
    //Check that there are at least one added doctor
    console.log("Do we get to here? Before checking added doctors");
    console.log("addedDoctors: " + addedDoctors);
    if (addedDoctors.length > 0) {
      //Go through all added doctors and add recordKeys for all of them
      console.log("Inside if");
      for (let doctorSSN of addedDoctors) {
        console.log("Inside for");
        let doctorUID = await EHRService.getUIDFromSSN(doctorSSN);
        console.log("Found UID: " + doctorUID);
        //let doctorSSN = await EHRService.getSSNFromUID(doctorUID);
        // if (addedDoctors.indexOf(doctorSSN) > -1) {
        //console.log("Doctor was found in added list");
        let doctorPubKey = await EHRService.getPublicKeyWithUID(doctorUID);
        console.log("Get DoctorPublicKey: " + doctorPubKey);
        //Get recordKey from user, decrypt it en reencrypt it with doctors publicKey here..
        let encryptedPatientRecordKey = await EHRService.getPatientRecordKey();
        console.log("Got patient recordKey: " + encryptedPatientRecordKey);
        let patientRecordKey = await crypt.decryptRecordKey(
          encryptedPatientRecordKey,
          EHRService.privateKey
        );
        console.log(
          "decrypted patient recordKey: " + patientRecordKey.toString("base64")
        );

        let newEncryptedRecordKey = await crypt.encryptRecordKey(
          patientRecordKey,
          doctorPubKey
        );
        console.log(
          "new encrypted patient recordKey: " + newEncryptedRecordKey
        );

        const dataToSave = {
          recordKey: newEncryptedRecordKey,
        };
        const updates = {};
        updates["DoctorToRecordKey/" + doctorUID + "/recordKeys/" + patientID] =
          dataToSave;

        update(dbRef, updates)
          .then(() => {
            console.log("Data saved successfully");
          })
          .catch((e) => {
            console.log("Data could not be saved: " + e);
          });
      }
    }
    //console.log("Something strange happened");
    //}
  }

  /**
   *
   * @param {*} connection
   * @param {Set<Array<String>>} setOfRegions
   * @returns {Promise<Array<String>>}
   */

  static async pushDoctorsToList(setOfRegions) {
    let connection = await this.chainConnection;
    let doctors = [];

    console.log("setOfRegions: " + Array.from(setOfRegions));

    for (let regionID of setOfRegions) {
      let results = await connection.getRegionPersonnel(regionID);

      console.log(results);

      if (results.length > 0) {
        doctors = doctors.concat(results);
      }
    }

    console.log("Doctors:");
    console.table(doctors);
    return doctors;
  }

  /**
   * Constructs an EHR object
   * @param  {String} id
   * @param  {String} staff
   * @param  {String} institution
   * @param  {String} details
   * @param  {Array<String>} prescriptions
   * @param  {Array<String>} diagnoses
   * @returns {Object} EhrEntry-object instance
   * @author Christopher Molin
   */
  static constructEHR(
    id,
    staff,
    institution,
    details,
    prescriptions,
    diagnoses
  ) {
    let dateNow = new Date().toJSON();

    let ehr = new EhrEntry();

    ehr.setPatientID(id);
    ehr.setMedicalPersonnel(staff);
    ehr.setHealthcareInstitution(institution);
    ehr.setDetails(details);
    ehr.setPrescriptions(prescriptions);
    ehr.setDiagnoses(diagnoses);
    ehr.setDate(dateNow);

    return ehr;
  }

  /**
   * Converts an object or array into a string
   * @param  {*} item -- Object or Array
   * @returns {Promise<String>} -- Object or list compounded into string
   * @author Christopher Molin
   */
  static async stringify(item) {
    return JSON.stringify(item);
  }

  /**
   * Takes the raw input and creates JSON files of these and uploads to Web3Storage.
   * Returns the CID when done.
   * @param  {String} patientID
   * @param  {String} staff
   * @param  {String} institution
   * @param  {String} details
   * @param  {Array<String>} prescriptions
   * @param  {Array<String>} diagnoses
   * @returns {Promise<String>} result -- A string to notify the frontend if it succeeded,
   * or why it failed
   * @author Christopher Molin
   */
  static async packageAndUploadEHR(
    patientID,
    staff,
    institution,
    details,
    prescriptions,
    diagnoses
  ) {
    try {
      patientID = "".concat(patientID);

      let finalFiles = [];
      let index = 0;

      let connection = await this.chainConnection;

      let apiToken = await EHRService.getWeb3StorageToken();

      let fs = new FileService(apiToken);

      // Create EHR object + (pre/dia lists)
      let objectEHR = EHRService.constructEHR(
        patientID,
        staff,
        institution,
        details,
        prescriptions,
        diagnoses
      );

      // GET RECORD KEY FOR ENCRYPTION & DECRYPTION
      let encryptedRecordKey = await this.getDoctorRecordKey(patientID);

      console.warn("Encrypted decryptedRecordKey: " + encryptedRecordKey);
      console.warn("PrivateKey: " + this.privateKey);

      let decryptedRecordKey = await crypt.decryptRecordKey(
        encryptedRecordKey,
        await this.privateKey
      );

      console.log("Attempting Fetch");

      try {
        let oldCid = await connection.getEHRCid(patientID);
        let patientEHR = await this.getFiles(oldCid, decryptedRecordKey, true);

        console.table(patientEHR);

        prescriptions = prescriptions.concat(patientEHR.prescriptions);
        diagnoses = diagnoses.concat(patientEHR.diagnoses);
        finalFiles = finalFiles.concat(patientEHR.encryptedEHRFiles);

        index = patientEHR.nextIndex;
      } catch (e) {
        console.log(e);
      }

      // Make into JSON objects
      let stringEHR = await this.stringify(objectEHR);
      let stringPrescriptions = await this.stringify(prescriptions);
      let stringDiagnoses = await this.stringify(diagnoses);

      console.log("Starting to encrypt files");

      let encryptedEHR = await this.encrypt(stringEHR, decryptedRecordKey);
      let encryptedPrescriptions = await this.encrypt(
        stringPrescriptions,
        decryptedRecordKey
      );
      let encryptedDiagnoses = await this.encrypt(
        stringDiagnoses,
        decryptedRecordKey
      );

      // Create JSON files
      let ehrFile = await FileService.createJSONFile(
        encryptedEHR,
        "EHR_" + index
      );
      let prescriptionsFile = await FileService.createJSONFile(
        encryptedPrescriptions,
        "prescriptions"
      );
      let diagnosesFile = await FileService.createJSONFile(
        encryptedDiagnoses,
        "diagnoses"
      );

      // Put JSON files into list and upload
      finalFiles.push(ehrFile, prescriptionsFile, diagnosesFile);

      try {
        let newCID = await fs.uploadFiles(finalFiles);

        await connection.updateEHR(patientID, newCID);

        // DEBUG
        let checkCID = await connection.getEHRCid(patientID);
        console.debug("Expected: " + newCID + "\nActual: " + checkCID);
        // END OF DEBUG

        // TESTING ONLY
        // Testing if the cid and the files were uploaded
        console.log(
          "TESTING UPLOAD, (THIS IS WHAT WAS SUBMITTED + THE OLD EHR):\n" +
            `https://${newCID}.ipfs.dweb.link/`
        );
        for (const file of finalFiles) {
          console.log(
            file.name + ": " + (await file.text()).toString("base64")
          );
        }
      } catch (e) {}

      return "Success";
    } catch (e) {
      throw e;
    }
  }

  /**
   * Method for downloading, decrypting and parsing files from IPFS.
   * @param {string} cid
   * @param {string} decryptedRecordKey
   * @param  {boolean} keepEHRencrypted Whether the EHR-files should be decrypted and parsed, or remain encrypted.
   * @returns {Promise<{
   * prescriptions: Array<string>,
   * diagnoses: Array<string>,
   * decryptedEHRs: Array<object>,
   * encryptedEHRFiles: Array<File>,
   * nextIndex: number
   * }>}
   * If keepEHRencrypted is true, decryptedEHRs will be empty.
   * If keepEHRencrypted is false, encryptedEHRFiles will be empty and nextIndex will be -1.
   * @author Christopher Molin
   */
  static async getFiles(cid, decryptedRecordKey, keepEHRencrypted) {
    let apiToken = await EHRService.getWeb3StorageToken();
    let fs = new FileService(apiToken);

    let prescriptions = [];
    let diagnoses = [];
    let decryptedEHRs = [];
    let encryptedEHRFiles = [];
    let index = 0;

    if (cid.length == 59) {
      let filesAndIndex = await fs.fetchEHRFiles(cid, keepEHRencrypted);
      index = filesAndIndex.index;
      for (const file of filesAndIndex.files) {
        if (keepEHRencrypted && file.name.search("EHR") != -1) {
          encryptedEHRFiles.push(file);
        } else {
          let fileContent = await file.text();
          let decryptedData = await this.decrypt(
            fileContent,
            decryptedRecordKey
          );
          let parsedData = await this.parseIntoJSON(decryptedData);

          if (file.name == "prescriptions.json") {
            prescriptions = prescriptions.concat(parsedData);
          } else if (file.name == "diagnoses.json") {
            diagnoses = diagnoses.concat(parsedData);
          } else if (file.name.search("EHR") != -1) {
            decryptedEHRs = decryptedEHRs.concat(parsedData);
          }
        }
      }
    }

    return {
      prescriptions: prescriptions,
      diagnoses: diagnoses,
      nextIndex: index,
      encryptedEHRFiles: encryptedEHRFiles,
      decryptedEHRs: decryptedEHRs,
    };
  }

  /**
   * Gets EHR-files and parses contents to an object containing:
   * prescriptions, diagnoses and journals.
   * @param  {string} patientID
   * @param {string} role
   * @returns {Promise<{
   * prescriptions: Array<String>
   * diagnoses: Array<String>
   * journals: Array<String>
   * }>}
   * @author Christopher Molin
   */
  static async getEHR(patientID, role) {
    // THIS IS ONLY CALLED BY OVERVIEW

    // This is needed to ensure patientID is in fact a string...
    patientID = "".concat(patientID);

    let decryptedRecordKey = "";

    if (role == "doctor") {
      let encryptedRecordKey = await this.getDoctorRecordKey(patientID);

      decryptedRecordKey = await crypt.decryptRecordKey(
        encryptedRecordKey,
        this.privateKey
      );
    } else if (role == "patient") {
      let encryptedRecordKey = await this.getPatientRecordKey();

      decryptedRecordKey = await crypt.decryptRecordKey(
        encryptedRecordKey,
        this.privateKey
      );
    } else {
      console.error("ERROR: missing role");
    }

    let connection = await this.chainConnection;

    let cid = "";

    let EHR = {
      prescriptions: [],
      diagnoses: [],
      journals: [],
    };

    try {
      // This may throw an error
      cid = await connection.getEHRCid(patientID);
      console.debug(cid);
      if (cid.length == 59) {
        let fetchedFiles = await this.getFiles(cid, decryptedRecordKey, false);

        EHR = {
          prescriptions: fetchedFiles.prescriptions,
          diagnoses: fetchedFiles.diagnoses,
          journals: fetchedFiles.decryptedEHRs,
        };
      }
    } catch (e) {
      console.warn(
        "The requested patient " + patientID + " has no prior CIDs. \n " + e
      );
    }

    return EHR;
  }

  /**
   * Parser
   * @param  {Array<string>} input
   * @returns  {Promise<Array<string> | object>}
   * @author Christopher Molin
   */
  static async parseIntoJSON(input) {
    let array = await JSON.parse(input);
    return array;
  }

  /**
   * Encrypts the content and put the Tag and IV at the beginning
   * @param  {string} content The text to be encrypted
   * @param {*} decryptedRecordKey
   * @returns {Promise<string>} The encrypted text, with Tag and IV at the beginning
   * @author Christopher Molin
   */
  static async encrypt(content, decryptedRecordKey) {
    let x = await crypt.encryptEHR(decryptedRecordKey, content);

    console.log("----------------------------------");
    console.log("Tag:" + x.Tag.toString("base64"));
    console.log("IV:" + x.iv.toString("base64"));
    console.log("Data:" + x.encryptedData);
    console.log("----------------------------------");

    let result = "";

    return result.concat(
      x.Tag.toString("base64"),
      x.iv.toString("base64"),
      x.encryptedData
    );
  }
  /**
   * Decrypts and returns the given file content
   * @param  {string} fileContent file content (including Tag and IV at the beginning)
   * @returns {Promise<string>} The decrypted content data (Tag and IV excluded)
   * @author Christopher Molin
   */
  static async oldDecrypt(fileContent) {
    let tag = fileContent.slice(0, 24);
    let iv = fileContent.slice(24, 68);
    let encrypted = fileContent.slice(68);

    let ivBuffer = Buffer.from(iv, "base64");
    let tagBuffer = Buffer.from(tag, "base64");

    console.log("----------------");
    console.log("ATTEMPTING DECRYPT");
    console.log("DATA:");
    console.log(encrypted);
    console.log("IV:");
    console.log(ivBuffer.toString("base64"));
    console.log("TAG:");
    console.log(tagBuffer.toString("base64"));

    let EHR = {
      iv: ivBuffer,
      encryptedData: encrypted,
      Tag: tagBuffer,
    };

    let x = await crypt.decryptEHR(
      PlaceholderValues.recordKey,
      EHR,
      PlaceholderValues.medicPrivateKey
    );

    console.log("DECRYPTED DATA:");
    console.log(x);
    return x;
  }

  /**
   * Decrypts and returns the given file content
   * @param  {string} fileContent file content (including Tag and IV at the beginning)
   * @param {*} decryptedRecordKey
   * @param {*} privateKey
   * @returns {Promise<string>} The decrypted content data (Tag and IV excluded)
   * @author Christopher Molin
   */
  static async decrypt(fileContent, decryptedRecordKey) {
    let tag = fileContent.slice(0, 24);
    let iv = fileContent.slice(24, 68);
    let encrypted = fileContent.slice(68);

    let ivBuffer = Buffer.from(iv, "base64");
    let tagBuffer = Buffer.from(tag, "base64");

    console.log("----------------");
    console.log("ATTEMPTING DECRYPT");
    console.log("DATA:");
    console.log(encrypted);
    console.log("IV:");
    console.log(ivBuffer.toString("base64"));
    console.log("TAG:");
    console.log(tagBuffer.toString("base64"));

    let EHR = {
      iv: ivBuffer,
      encryptedData: encrypted,
      Tag: tagBuffer,
    };

    let x = await crypt.decryptEHR(decryptedRecordKey, EHR);

    console.log("DECRYPTED DATA:");
    console.log(x);
    return x;
  }

  /**
   * Gets all regions from Firebase, and returns them as a list of region names.
   * @returns {Promise<Array<String>>}
   * @throws {CouldNotLoadRegionsError} If the operation failed, e.g. due to network error.
   * @author Hampus Jernkrook
   */
  static async getRegions() {
    let connection = await this.chainConnection;
    let regions;
    try {
      regions = await connection.getAllRegions();
    } catch (err) {
      if (err instanceof ChainConnectionError) {
        throw new CouldNotLoadRegionsError(
          `Could not load the regions from the blockchain. ` +
            `The connection failed. Error: ${err.message}`
        );
      }
    }
    return regions;
  }

  /**
   * Gets all regions the given patient has granted permission to.
   * @param {String} patientID The id of the patient to retrieve permissioned regions for.
   * @returns {Promise<Array<String>>} Array of regions authorised by the patient.
   * @throws {CouldNotLoadPermittedRegionsError} If the operation failed, e.g. due to network error
   *  or that the caller is unauthorised to call this function.
   * @author Hampus Jernkrook
   */
  static async getPatientRegions(patientID) {
    let connection = await this.chainConnection;
    let regions;
    try {
      regions = await connection.getPermissionedRegions(patientID);
    } catch (err) {
      if (err instanceof ChainOperationDeniedError) {
        // show that the operation was denied, followed by generic message.
        throw new CouldNotLoadPermittedRegionsError(
          `Operation denied:\n` +
            `Could not load permitted regions. Error thrown with message ${err.message}`
        );
      }
    }
    return regions;
  }

  /**
   * Fetches the doctor's full name from Firebase.
   * @param  {String} doctorID A valid SSN
   * @returns {Promise<String>} Doctor's full name
   * @author Christopher Molin
   */
  static async getDoctorFullName(doctorID) {
    let dbRef = ref(database);
    let fullName = "";
    await get(child(dbRef, "Doctors/" + doctorID))
      .then((snapshot) => {
        if (snapshot.exists()) {
          fullName = snapshot.val().lastName + ", " + snapshot.val().firstName;
        } else {
          throw "The requested doctor is not available";
        }
      })
      .catch((error) => {
        throw error;
      });
    return fullName;
  }

  /**
   * Fetches the name of the institution from Firebase.
   * @param  {String} institution A valid id
   * @returns {Promise<String>} The name of the institution
   * @author Christopher Molin
   */
  static async getInstitutionName(institution) {
    let dbRef = ref(database);
    let institutionName = "";
    await get(child(dbRef, "Institutions/" + institution))
      .then((snapshot) => {
        if (snapshot.exists()) {
          institutionName = snapshot.val().name;
        } else {
          throw "No data available";
        }
      })
      .catch((error) => {
        throw error;
      });
    return institutionName;
  }

  /**
   * Checks to see if provided PatientID exists on Firebase
   * @param  {String} patientID A patient ID to look up
   * @returns {Promise<boolean>} Whether or not the patient exist
   * @author Christopher Molin
   */
  static async checkPatientExist(patientID) {
    let dbRef = ref(database);
    let exists = false;
    await get(child(dbRef, "Patients/" + patientID))
      .then((snapshot) => {
        if (snapshot.exists()) {
          exists = true;
        } else {
          exists = false;
        }
      })
      .catch((error) => {
        throw error;
      });
    return exists;
  }
}
