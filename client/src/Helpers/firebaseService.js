import { database, ref, get, child } from "../../firebaseSetup";
import { update } from "firebase/database";
import { getAuth } from "@firebase/auth";
import EHRService from "./ehrService";
import crypt from "../../Crypto/crypt";

export default class FirebaseService {
  /**
   * Checks to see if provided PatientID exists on Firebase
   * @param  {String} patientID A patient ID to look up
   * @returns {Promise<boolean>} Whether or not the patient exist
   * @author Christopher Molin
   */
  static async checkPatientExist(patientID) {
    let dbRef = ref(database);
    let result = false;
    await get(child(dbRef, "Patients/" + patientID))
      .then((snapshot) => {
        result = snapshot.exists();
      })
      .catch((error) => {
        throw error;
      });
    return result;
  }

  /**
   * Fetches the public key for the currently logged in user.
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
   * Fetches the encrypted private key (and IV) of the current user from Firebase.
   * @returns {Promise<*>} returns the encrypted private key + IV of the currently logged in user
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
   * Fetches the name of the institution from Firebase.
   * @param  {String} institution A valid id
   * @returns {Promise<String>} The name of the institution
   * @author Christopher Molin
   */
  static async getInstitutionName(institution) {
    // kommer ersättas av metod i chainconnection
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

  //____________

  static async updateRecordKeys(newPermittedRegions, patientID) {

    let changedDoctors = await this.getChangedDoctors(newPermittedRegions, patientID);

    let addedDoctors = changedDoctors.added;
    let removedDoctors = changedDoctors.removed;


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
        let doctorUID = await this.getUIDFromSSN(doctorSSN);
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

            //If the doctor is in the list of removed doctors, remove that recordKey from database

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

              await this.updateDoctorRecordKey(doctorUID, patientID, null);
            }
          }
        }
      }
    }
    //Check that there are at least one added doctor
    console.log("addedDoctors: " + addedDoctors);
    if (addedDoctors.length > 0) {
      //Go through all added doctors and add recordKeys for all of them
      for (let doctorSSN of addedDoctors) {

        let doctorUID = await this.getUIDFromSSN(doctorSSN);
        console.log("Found UID: " + doctorUID);

        let doctorPubKey = await this.getPublicKeyWithUID(doctorUID);
        console.log("Get DoctorPublicKey: " + doctorPubKey);

        //Get recordKey from user, decrypt it en reencrypt it with doctors publicKey here..
        let encryptedPatientRecordKey = await this.getPatientRecordKey();
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

        await this.updateDoctorRecordKey(doctorUID, patientID, newEncryptedRecordKey);

      }
    }

  }

  /**
   * @param  {Array<String>} newPermittedRegions
   * @param  {String} patientID
   * @returns {Promise<{removed:Array<String>, added: Array<String>}>}
   */
  static async getChangedDoctors(newPermittedRegions, patientID){

    let p = await EHRService.getPatientRegions(patientID);

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

    return { added: addedDoctors, removed: removedDoctors }

  }



  static async updateDoctorRecordKey(doctorUID, patientID, recordKey){

    let dbRef = ref(database);

    const updates = {};

    updates["DoctorToRecordKey/" + doctorUID + "/recordKeys/" + patientID] =
          {recordKey: recordKey};

    update(dbRef, updates)
      .then(() => {
        console.log("Data saved successfully");
      })
      .catch((e) => {
        console.log("Data could not be saved: " + e);
      });
  }








  /**
   *
   * @param {*} connection
   * @param {Set<Array<String>>} setOfRegions
   * @returns {Promise<Array<String>>}
   */

  static async pushDoctorsToList(setOfRegions) {
    let connection = await EHRService.chainConnection;
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
}
