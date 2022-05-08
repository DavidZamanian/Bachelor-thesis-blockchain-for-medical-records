import { database, ref, get, child } from "../../firebaseSetup";

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
}