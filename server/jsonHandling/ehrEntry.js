/**
 * This class represents the blueprint for an EHR entry object. 
 * @author Edenia Isaac
 * @author Hampus Jernkrook
 */
export default class EhrEntry {

    // NOT IN USE CURRENTLY: currently only constructor with no parameters is being used. 
    /**
     * @param {string} patientID - The id of the patient.
     * @param {string} healthcareInstitution - The healthcare institution writing this EHR entry.
     * @param {string} medicalPersonnel - The name of the medical personnel writing this EHR entry.
     * @param {string} details - The freetext detailing the events of the meeting that this entry is for.
     * @param {string[]} diagnoses - array of diagnoses made in this entry. 
     * @param {string[]} prescriptions - array of prescriptions issued in this entry. 
     */
    /*
    constructor(patientID, healthcareInstitution, medicalPersonnel, details, diagnoses, prescriptions) {
        this.patientID = patientID;
        this.healthcareInstitution = healthcareInstitution;
        this.medicalPersonnel = medicalPersonnel;
        this.details = details;
        this.diagnoses = diagnoses;
        this.prescriptions = prescriptions;
    }
    */

    /** @param {string} patientID - The id of the patient. */
    setPatientID(patientID) {
        this.patientID = patientID;
    }

    /** @param {string} healthcareInstitution - The healthcare institution writing this EHR entry. */
    setHealthcareInstitution(healthcareInstitution) {
        this.healthcareInstitution = healthcareInstitution;
    }

    /** @param {string} medicalPersonnel - The name of the medical personnel writing this EHR entry. */
    setMedicalPersonnel(medicalPersonnel){
        this.medicalPersonnel = medicalPersonnel;
    }

    /** @param {string} details - The freetext detailing the events of the meeting that this entry is for. */
    setDetails(details) {
        this.details = details;
    }

    /** @param {string[]} diagnoses - array of diagnoses made in this entry.  */
    setDiagnoses(diagnoses) {
        this.diagnoses = diagnoses;
    }

    /** @param {string[]} prescriptions - array of prescriptions issued in this entry.  */
    setPrescriptions(prescriptions){
        this.prescriptions = prescriptions;
    }

}
