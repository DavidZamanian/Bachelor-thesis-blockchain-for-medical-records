import EhrEntry from "./ehrEntry";




export default class EHRService{


    /**
     * Constructs an EHR object
     * @param  {String} id
     * @param  {String} staff
     * @param  {String} institution
     * @param  {String} details
     * @param  {Array<String>} prescriptions
     * @param  {Array<String>} diagnoses 
     * @returns {Object} "ehr" --EhrEntry-object
     * @author @Chrimle
     */
    static constructEHR (
        id,
        staff,
        institution,
        details,
        prescriptions,
        diagnoses,
    ){

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
     * @returns {String} -- Object or list compounded into string
     * @author @Chrimle
     */
    static stringify(item){
        return JSON.stringify(item);
    }



}