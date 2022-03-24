import EhrEntry from "./ehrEntry";
import FileService from "./fileService";




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

    
    /**
     * Takes the raw input and creates JSON files of these and uploads to Web3Storage.
     * Returns the CID when done.
     * @param  {String} apiToken
     * @param  {String} id
     * @param  {String} staff
     * @param  {String} institution
     * @param  {String} details
     * @param  {Array<String>} prescriptions 
     * @param  {Array<String>} diagnoses
     * @returns {Promise<String>}
     * {String} cid -- The Web3Storage CID of the root folder
     * @author Chrimle
     */
    static async packageAndUploadEHR(
        apiToken,
        id,
        staff,
        institution,
        details,
        prescriptions,
        diagnoses,
    ){
        let fs = new FileService(apiToken);

        // Create EHR object + (pre/dia lists)
        let objectEHR = EHRService.constructEHR(
            id,
            staff,
            institution,
            details,
            prescriptions,
            diagnoses
          )

        // Make into JSON objects
        let stringEHR = EHRService.stringify(objectEHR);
        let stringPrescriptions = EHRService.stringify(prescriptions);
        let stringDiagnoses = EHRService.stringify(diagnoses);

        // Create JSON file from EHR 
        let ehrFile = FileService.createJSONFile(stringEHR,"ehr");

        // Create JSON files from prescriptions & diagnoses
        let prescriptionsFile = FileService.createJSONFile(stringPrescriptions,"prescriptions");
        let diagnosesFile = FileService.createJSONFile(stringDiagnoses,"diagnoses");

        // Put JSON files into list and upload
        let files = [ehrFile,prescriptionsFile,diagnosesFile]

        // Retrieve CID and return it
        try{
            return await fs.uploadFiles(files)
        }
        catch (e){
            return false
        }
        
    }


}