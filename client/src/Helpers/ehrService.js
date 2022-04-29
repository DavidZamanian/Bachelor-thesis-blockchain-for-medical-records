import EhrEntry from "./ehrEntry";
import CreateFileObjectError from "./Errors/createFileObjectError";
import fetchFileContentError from "./Errors/FetchFileContentError";
import UploadFileError from "./Errors/uploadFileError";
import FileService from "./fileService";
import { database, ref, get, child } from "../../firebaseSetup";
import FetchFileContentError from "./Errors/FetchFileContentError";
import { PlaceholderValues } from "../placeholders/placeholderValues";
import * as crypt from "../../Crypto/crypt";
import { getAuth } from "@firebase/auth";

export default class EHRService {
  static privateKey;
  static publicKey;

  static async setPrivateKey(newPrivateKey) {
    this.privateKey = newPrivateKey;
  }

  static async setPublicKey(newPublicKey) {
    this.publicKey = newPublicKey;
  }

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
   *
   * @returns returns the encrypted record key of the currently logged in patient
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
   *
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
   *
   * @param {*} patientID The SSN of the patient
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
        "DoctorToRecordKey/" + auth.currentUser.uid + "/recordKeys/" + patientID
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
   *
   * @returns The encrypted record key of the currently logged in patient
   * @author David Zamanian
   */

  static async getPatientRecordKey() {
    let encPatientRecordKey;
    const auth = getAuth();
    let dbRef = ref(database);
    await get(
      child(
        dbRef,
        "PatientToRecordKey/" + auth.currentUser.uid + "/recordKey"
      )
    )
      .then((snapshot) => {
        if (snapshot.exists()) {
          encPatientRecordKey = snapshot.val();
        } else {
          //Maybe do something else here
          console.error("GetPatientRecordKey Error: "+auth.currentUser.uid);
          throw "Something went wrong";
        }
      })
      .catch((error) => {
        throw error;
      });
    return encPatientRecordKey;
  }

  /**
   * Constructs an EHR object
   * @param  {String} id
   * @param  {String} staff
   * @param  {String} institution
   * @param  {String} details
   * @param  {Array<String>} prescriptions
   * @param  {Array<String>} diagnoses
   * @returns {Object} "ehr" --EhrEntry-object
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
   * @param  {} item -- Object or Array
   * @returns {Promise<String>} -- Object or list compounded into string
   * @author Christopher Molin
   */
  static async stringify(item) {
    return JSON.stringify(item);
  }

  /**
   * Takes the raw input and creates JSON files of these and uploads to Web3Storage.
   * Returns the CID when done.
   * @param  {String} id
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
    id,
    staff,
    institution,
    details,
    prescriptions,
    diagnoses
  ) {
    try {
      let apiToken = await EHRService.getWeb3StorageToken();

      let fs = new FileService(apiToken);

      // Create EHR object + (pre/dia lists)
      let objectEHR = EHRService.constructEHR(
        id,
        staff,
        institution,
        details,
        prescriptions,
        diagnoses
      );

      // GET RECORD KEY FOR ENCRYPTION & DECRYPTION
      let encryptedRecordKey = await this.getDoctorRecordKey(id);


      console.warn("Encrypted decryptedRecordKey: " + encryptedRecordKey);
      console.warn("PrivateKey: " + this.privateKey);

      let decryptedRecordKey = await crypt.decryptRecordKey(
        encryptedRecordKey,
        await this.privateKey
      );

      let finalFiles = [];

      //OUR BRANCH ->
      //this is for testing
      let oldCid =
        "bafybeienfqpxerm5iu46hdzcglka26gcgsnv5zagtkk7gubu5xfltekilq";
      //OUR BRANCH <-
      // FETCH OLD FILES

      console.log("Attempting Fetch");
      let patientEHR = await this.getFiles(oldCid, decryptedRecordKey, true);
      

      prescriptions = prescriptions.concat(patientEHR.prescriptions);
      diagnoses = diagnoses.concat(patientEHR.diagnoses);
      finalFiles = finalFiles.concat(patientEHR.encryptedEHRFiles);
      let index = patientEHR.nextIndex;
      

      // Make into JSON objects
      let stringEHR = await this.stringify(objectEHR);
      let stringPrescriptions = await this.stringify(prescriptions);
      let stringDiagnoses = await this.stringify(diagnoses);

      console.log("Starting to encrypt files");
      // TODO: ENCRYPT THE 3 NEW FILES' CONTENT
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

      // Retrieve CID and return it
      let cid = await fs.uploadFiles(finalFiles);

      // TESTING ONLY
      // Testing if the cid and the files were uploaded
      console.log(
        "TESTING UPLOAD, (THIS IS WHAT WAS SUBMITTED + THE OLD EHR):\n" +
          `https://${cid}.ipfs.dweb.link/`
      );
      for (const file of finalFiles) {
        console.log(file.name + ": " + (await file.text()).toString("base64"));
      }

      return cid;
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
 static async getFiles(cid, decryptedRecordKey, keepEHRencrypted){

     let apiToken = await EHRService.getWeb3StorageToken()
     let fs = new FileService(apiToken);

     let prescriptions = []
     let diagnoses = []
     let decryptedEHRs = []
     let encryptedEHRFiles = []
     
     
     let filesAndIndex = await fs.fetchEHRFiles(cid, keepEHRencrypted);
         
     for (const file of filesAndIndex.files){

         if (keepEHRencrypted && file.name.search("EHR") != -1){
             encryptedEHRFiles.push(file)
         }
         else{
             let fileContent = await file.text();
             let decryptedData = await this.decrypt(fileContent, decryptedRecordKey);
             let parsedData = await this.parseIntoJSON(decryptedData);
             if(file.name == "prescriptions.json"){
                 prescriptions = prescriptions.concat(parsedData);
             }
             else if(file.name == "diagnoses.json"){
                 diagnoses = diagnoses.concat(parsedData);
             }
             else if (file.name.search("EHR") != -1){
                 decryptedEHRs = decryptedEHRs.concat(parsedData);
             }
         }
     }
     return {prescriptions: prescriptions, 
             diagnoses: diagnoses, 
             nextIndex: filesAndIndex.index,
             encryptedEHRFiles: encryptedEHRFiles,
             decryptedEHRs: decryptedEHRs}
 }






  /**
   * Gets EHR-files and parses contents to an object containing:
   * prescriptions, diagnoses and journals.
   * @param  {string} patientID
   * @param {string} role
   * @returns {Promise<object>}
   * @author Christopher Molin
   */
  static async getEHR(patientID, role) {
    // THIS IS ONLY CALLED BY OVERVIEW

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

    //TODO Need real CID here
    let cid = "bafybeienfqpxerm5iu46hdzcglka26gcgsnv5zagtkk7gubu5xfltekilq";

    let fetchedFiles = await this.getFiles(cid, decryptedRecordKey, false);

    let EHR = {
      prescriptions: fetchedFiles.prescriptions,
      diagnoses: fetchedFiles.diagnoses,
      journals: fetchedFiles.decryptedEHRs,
    };

    
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
   * @async
   * @author Christopher Molin
   */
  static async getRegions() {
    let dbRef = ref(database);
    let regions = [];
    await get(child(dbRef, "Regions/"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let results = snapshot.val();
          results.forEach((region) => {
            regions.push(region.name);
          });
        } else {
          throw "No data available";
        }
      })
      .catch((error) => {
        throw error;
      });
    return regions;
  }

  /**
   * PLACEHOLDER: Gets all regions the given patient have granted permission.
   * Returns a list of region names.
   * @param {String} patientID
   * @returns {Promise<Array<String>>}
   */
  static async getPatientRegions(patientID) {
    let regions = PlaceholderValues.permittedRegions;

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
