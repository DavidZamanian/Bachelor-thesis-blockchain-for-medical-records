import { database, ref, get, child } from "../../firebaseSetup";
import { getAuth } from "@firebase/auth";

export default class FirebaseService{


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
                "DoctorToRecordKey/" + auth.currentUser.uid + "/recordKeys/" + patientID + "/recordKey/"
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
    static async getInstitutionName(institution) { // kommer ersättas av metod i chainconnection 
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


}