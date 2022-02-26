export default class JSONService {
    //JSONService()

    constructor() {
        this.ehrEntry = {};
        //this.prescriptions = []
    }

    addPatientID(patientID) {
        this.ehrEntry.patientID = patientID;
    }

    addHealthcareInstitution(healthcareInstitution) {
        this.ehrEntry.healthcareInstitution = healthcareInstitution;
    }
    
    addMedicalPersonel(medicalPersonnel){
        this.ehrEntry.medicalPersonnel = medicalPersonnel;
    }

    addDetails(details) {
        this.ehrEntry.details = details;
    }

    addDiagnoses(diagnoses) {
        this.ehrEntry.diagnoses = diagnoses;
    }

    addPrescriptions(prescriptions){
       thistory.ehrEntry.prescriptions = prescriptions;
       prescriptions.add(prescriptions);
    }

    //getPatientID() {return this.ehrEntry.patientID;}
    
}