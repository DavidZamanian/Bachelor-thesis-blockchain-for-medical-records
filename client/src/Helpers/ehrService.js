import EhrEntry from "./ehrEntry";
import CreateFileObjectError from "./Errors/createFileObjectError";
import fetchFileContentError from "./Errors/FetchFileContentError";
import UploadFileError from "./Errors/uploadFileError";
import FileService from "./fileService";
import { database, ref, get, child } from "../../firebaseSetup";
import FetchFileContentError from "./Errors/FetchFileContentError";



export default class EHRService{

    /**
     * Fetches API-token to Web3Storage from Firebase
     * @returns {Promise<String>} apiToken to Web3Storage
     * @throws 
     * @author @Chrimle
     */
    static async getWeb3StorageToken() {
   
        let dbRef = ref(database);
        let apiToken = null;
        await get(child(dbRef, 'Web3Storage-Token')).then((snapshot) => {
        if (snapshot.exists()) {
            apiToken = snapshot.val();
        } else {
            throw ("No data available");
        }
        }).catch((error) => {
            throw (error);
        });
        return apiToken;
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
     * @param  {String} id
     * @param  {String} staff
     * @param  {String} institution
     * @param  {String} details
     * @param  {Array<String>} prescriptions 
     * @param  {Array<String>} diagnoses
     * @returns {Promise<String>} result -- A string to notify the frontend if it succeeded,
     * or why it failed 
     * @author Chrimle
     */
    static async packageAndUploadEHR(
        id,
        staff,
        institution,
        details,
        prescriptions,
        diagnoses,
    ){
 
        try{
            let apiToken = await EHRService.getWeb3StorageToken()

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
            let files = [ehrFile,prescriptionsFile,diagnosesFile];

            // Retrieve CID and return it
            let cid = await fs.uploadFiles(files);
            
            // TESTING ONLY
            // Testing if the cid and the files were uploaded
            console.log("New EHR directory: "+cid)
            
            let testCID = "bafybeibzxj744momirgbb2zpjsxo7hpwg2kcbwyhkeuermg3tf2fec2fpm";

            let oldFiles = await fs.fetchEHRContents(testCID);
            
            console.log("TESTING DOWNLOADING FILES (NOT THE ONES THAT WERE UPLOADED!):")
            for (const file of oldFiles){
                console.log(file.name+": "+ await file.text());
            }

            console.log("TESTING UPLOAD, (THIS IS WHAT WAS SUBMITTED, CHECK WITH Web3Storage!):")
            for (const file of files){
            console.log(file.name+": "+ await file.text());
            }
            


            return "Success";
        }
        catch (e){
            if(e instanceof CreateFileObjectError){
                return "Error";
            } else if (e instanceof UploadFileError){
                return "NoResponse";
            } else if (e instanceof FetchFileContentError){
                return "Error";
            } else{
                return "Error";
            }
        }
    }



    static async getEHR(cid){

        let apiToken = await EHRService.getWeb3StorageToken();

        let fs = new FileService(apiToken);

        let files = await fs.fetchEHRContents(cid);
        
        return files;
    }
}