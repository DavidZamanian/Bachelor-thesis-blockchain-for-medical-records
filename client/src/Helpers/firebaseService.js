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

  /**
   * Returns all record-keys given to the provided doctorUID
   * @param  {String} doctorUID
   * @returns {Promise<Array<String>>}
   * @author David Zamanian, Christopher Molin
   */
  static async getAllRecordKeysFromDoctor(doctorUID) {
    let dbRef = ref(database);

    const listOfRecordKeysSnapshot = await get(
      child(dbRef, "DoctorToRecordKey/" + doctorUID + "/recordKeys/")
    );
    //This is null in some occasions when removing the last permissions in the database!
    if (listOfRecordKeysSnapshot.val() != null) {
      let recordKeys = [].concat(
        Object.keys(listOfRecordKeysSnapshot.val()).flat()
      );
      return recordKeys;
    } else return null;
  }

  /**
   * Get all Doctor-UIDs with atleast one record key
   * @returns {Promise<Array<String>>}
   * @author David Zamanian, Christopher Molin
   */
  static async getDoctorsWithRecordKeys() {
    let doctorUIDs = [];

    let dbRef = ref(database);

    const doctorToRecordKeySnapshot = await get(
      child(dbRef, "DoctorToRecordKey/")
    );

    if (doctorToRecordKeySnapshot.exists()) {
      doctorUIDs = doctorUIDs.concat(
        Object.keys(doctorToRecordKeySnapshot.val()).flat()
      );
    }

    return doctorUIDs;
  }

  /**
   * Encrypts the patientRecordKey with doctorUID's public key
   * @param  {String} doctorUID
   * @param  {String} patientRecordKey
   * @returns {Promise<String>} patientRecordKey encrypted with doctorUID's public key
   */
  static async createRecordKeyForDoctorSSN(doctorUID, patientRecordKey) {
    let doctorPubKey = await this.getPublicKeyWithUID(doctorUID);

    let newEncryptedRecordKey = await crypt.encryptRecordKey(
      patientRecordKey,
      doctorPubKey
    );

    return newEncryptedRecordKey;
  }

  /**
   * Given a patientID and their new permitted regions,
   * return all the UIDs for the doctors that should:
   * Be given a record key for the patient or
   * have their record key for the patient removed.
   * @param {Array<String>} newPermittedRegions
   * @param {String} patientID
   * @returns {Promise<{ removed: Array<String>, added: Array<String> }>}
   * .removed contains the UIDs for doctors that should no longer have the record key for the patient
   * .added contains the UIDs for doctors that should have the record key for the patient.
   * @author David Zamanian
   */
  static async getChangedDoctors(newPermittedRegions, patientID) {
    let p = await EHRService.getPatientRegions(patientID);

    var permitted = new Set();

    p.map((item) => permitted.add(item));

    //The new permitted regions
    let newPermitted = new Set(newPermittedRegions);
    //The common regions between permitted and newPermitted. Basically A intersect B
    let permitted_intersect_newPermitted = new Set(
      [...permitted].filter((x) => newPermitted.has(x))
    );
    //All the deleted regions (from permitted). Basically A - (A intersect B)
    let deletedRegions = new Set(
      [...permitted].filter((x) => !permitted_intersect_newPermitted.has(x))
    );
    //All the new regions that was added. Basically B - (A intersect B)
    let addedRegions = new Set(
      [...newPermitted].filter((x) => !permitted_intersect_newPermitted.has(x))
    );

    //Make array of all the added doctors
    let addedDoctors = [""];
    addedDoctors = await this.pushDoctorsToList(Array.from(addedRegions));

    //Make array of all the removed doctors
    let removedDoctors = [""];
    removedDoctors = await this.pushDoctorsToList(Array.from(deletedRegions));

    return { added: addedDoctors, removed: removedDoctors };
  }

  /**
   * @param {String} doctorUID
   * @param {String} patientID
   * @param {Promise<String>} recordKey
   *
   */
  static async updateDoctorRecordKey(doctorUID, patientID, recordKey) {
    let dbRef = ref(database);

    const updates = {};

    updates["DoctorToRecordKey/" + doctorUID + "/recordKeys/" + patientID] = {
      recordKey: recordKey,
    };

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

    for (let regionID of setOfRegions) {
      let results = await connection.getRegionPersonnel(regionID);

      if (results.length > 0) {
        doctors = doctors.concat(results);
      }
    }

    return doctors;
  }
}
