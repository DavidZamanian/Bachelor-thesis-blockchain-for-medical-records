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

            // FETCH OLD FILES
            let oldCID = "bafybeidwd4nlwbdr365lvnp5ffrqp4ejepkvr64wt6d6iyvohwhlp4755m";

            let fetchedFiles = await fs.fetchEHRFiles(oldCID);

            let oldFiles = [];

            let finalFiles = [];
            

            for (const file of fetchedFiles){
                let decrypted;
                if(file.name == "prescriptions.json"){
                    // Decrypt
                    decrypted = await this.decrypt(await file.text());
                    // Parse
                    prescriptions = prescriptions.concat(await this.parseIntoArray(decrypted));
                }
                else if(file.name == "diagnoses.json"){
                    // Decrypt
                    decrypted = await this.decrypt(await file.text());
                    // Parse
                    console.log("Before"+diagnoses.length)
                    diagnoses = diagnoses.concat(await this.parseIntoArray(decrypted));
                    console.log("After"+diagnoses.length)
                }
                else{
                    // For uploading
                    finalFiles.push(file)
                }
            }


            // Make into JSON objects
            let stringEHR = EHRService.stringify(objectEHR);
            let stringPrescriptions = EHRService.stringify(prescriptions);
            let stringDiagnoses = EHRService.stringify(diagnoses);

            // TODO: ENCRYPT THE 3 NEW FILES' CONTENT
            let encryptedEHR = this.encrypt(stringEHR);
            let encryptedPrescriptions = this.encrypt(stringPrescriptions);
            let encryptedDiagnoses = this.encrypt(stringDiagnoses);



            // Create JSON files
            let ehrFile = FileService.createJSONFile(encryptedEHR,"EHR_"+objectEHR.date.toString().slice(0, 19));
            let prescriptionsFile = FileService.createJSONFile(encryptedPrescriptions,"prescriptions");
            let diagnosesFile = FileService.createJSONFile(encryptedDiagnoses,"diagnoses");

            // Put JSON files into list and upload
            finalFiles.push(ehrFile,prescriptionsFile,diagnosesFile);

            // Retrieve CID and return it
            let cid = await fs.uploadFiles(finalFiles);
            
            // TESTING ONLY
            // Testing if the cid and the files were uploaded
            console.log("New EHR directory: "+cid)
            
            console.log("TESTING DOWNLOADING FILES (NOT THE ONES THAT WERE UPLOADED!):")
            for (const file of oldFiles){
                console.log(file.name+": "+ await file.text());
            }

            console.log("TESTING UPLOAD, (THIS IS WHAT WAS SUBMITTED + THE OLD EHR):\n"+`https://${cid}.ipfs.dweb.link/`)
            for (const file of finalFiles){
            console.log(file.name+": "+ await file.text());
            }
            // END OF TESTS


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

    /**
     * @param  {Array<string>} input
     * @returns  {Promise<Array<string>>}
     */
    static async parseIntoArray(input){

        let array = await JSON.parse(input);
        console.log(array)
        return array;
    }

    /**
     * @param  {string} content
     * @returns {Promise<string>}
     */
    static async encrypt(content){
        return content;
    }
    /**
     * @param  {string} content
     * @returns {Promise<string>}
     */
    static async decrypt(content){
        return content;
    }
}