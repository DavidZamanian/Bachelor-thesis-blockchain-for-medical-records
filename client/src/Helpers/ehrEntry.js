/**
 * This class represents the blueprint for an EHR entry object.
 * @author Edenia Isaac
 * @author Hampus Jernkrook
 */
export default class EhrEntry {
  /** @param {string} date - The date this entry was created, in ISO 8601 format. */
  setDate(date) {
    this.date = date;
  }

  /** @param {string} patientID - The id of the patient. */
  setPatientID(patientID) {
    this.patientID = patientID;
  }

  /** @param {string} healthcareInstitution - The healthcare institution writing this EHR entry. */
  setHealthcareInstitution(healthcareInstitution) {
    this.healthcareInstitution = healthcareInstitution;
  }

  /** @param {string} medicalPersonnel - The name of the medical personnel writing this EHR entry. */
  setMedicalPersonnel(medicalPersonnel) {
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
  setPrescriptions(prescriptions) {
    this.prescriptions = prescriptions;
  }
}
