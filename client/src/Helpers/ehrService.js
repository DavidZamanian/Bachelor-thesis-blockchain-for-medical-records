import EhrEntry from "./ehrEntry";
import CreateFileObjectError from "./Errors/createFileObjectError";
import fetchFileContentError from "./Errors/FetchFileContentError";
import UploadFileError from "./Errors/uploadFileError";
import FileService from "./fileService";
import { database, ref, get, child } from "../../firebaseSetup";
import FetchFileContentError from "./Errors/FetchFileContentError";
import { PlaceholderValues } from "../placeholders/placeholderValues";
import { encryptEHR } from "../../Crypto/crypt";



export default class EHRService{

    /**
     * Fetches API-token to Web3Storage from Firebase
     * @returns {Promise<String>} apiToken to Web3Storage
     * @throws 
     * @author Christopher Molin
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
     * @author Christopher Molin
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
     * @returns {Promise<String>} -- Object or list compounded into string
     * @author Christopher Molin
     */
    static async stringify(item){
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
     * @author Christopher Molin
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
                    diagnoses = diagnoses.concat(await this.parseIntoArray(decrypted));
                }
                else{
                    // For uploading
                    finalFiles.push(file)
                }
            }


            // Make into JSON objects
            let stringEHR = await this.stringify(objectEHR);
            let stringPrescriptions = await this.stringify(prescriptions);
            let stringDiagnoses = await this.stringify(diagnoses);

            // TODO: ENCRYPT THE 3 NEW FILES' CONTENT
            let encryptedEHR = await this.encrypt(stringEHR);
            let encryptedPrescriptions = await this.encrypt(stringPrescriptions);
            let encryptedDiagnoses = await this.encrypt(stringDiagnoses);



            // Create JSON files
            let ehrFile = await FileService.createJSONFile(encryptedEHR,"EHR_"+objectEHR.date.toString().slice(0, 19));
            let prescriptionsFile = await FileService.createJSONFile(encryptedPrescriptions,"prescriptions");
            let diagnosesFile = await FileService.createJSONFile(encryptedDiagnoses,"diagnoses");

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


    /**
     * Gets EHR-files and parses contents to an object containing:
     * prescriptions, diagnoses and journals.
     * @param  {string} patientID
     * @returns {Promise<object>}
     * @author Christopher Molin
     */
    static async getEHR(patientID){

        // TODO: Look up correct CID with patientID
        let cid = "bafybeiaghgh4wrgon7dk3yslq7aokkpc6s4rtn45oto3gqcd6mclvzshtq";

        let apiToken = await EHRService.getWeb3StorageToken();

        let fs = new FileService(apiToken);

        let fetchedFiles = await fs.fetchEHRFiles(cid);
        
        let EHR = {
            prescriptions: [],
            diagnoses: [],
            journals: []
        }


        for (const file of fetchedFiles){
            let decrypted;
            console.log("testing:"+file.name+" "+await file.text())
            if(file.name == "prescriptions.json"){
                // Decrypt
                decrypted = await this.decrypt(await file.text());
                // Parse
                EHR.prescriptions = EHR.prescriptions.concat(await this.parseIntoArray(decrypted));
            }
            else if(file.name == "diagnoses.json"){
                // Decrypt
                decrypted = await this.decrypt(await file.text());
                // Parse
                EHR.diagnoses = EHR.diagnoses.concat(await this.parseIntoArray(decrypted));
            }
            else{
                // Decrypt
                decrypted = await this.decrypt(await file.text());
                // Parse
                EHR.journals = EHR.journals.concat(await this.parseIntoArray(decrypted));
            }
        }
        return EHR;
    }

    /**
     * Parses JSON-string to an array of strings
     * @param  {Array<string>} input
     * @returns  {Promise<Array<string>>}
     * @author Christopher Molin
     */
    static async parseIntoArray(input){

        let array = await JSON.parse(input);
        return array;
    }

    /**
     * Parses JSON-string into JSON
     * @param  {Array<string>} input
     * @returns  {Promise<object>}
     * @author Christopher Molin
     */
     static async parseIntoEHR(input){

        let ehr = await JSON.parse(input);
        console.log(ehr)
        return ehr;
    }

    /**
     * PLACEHOLDER
     * @param  {string} content
     * @returns {Promise<string>}
     */
    static async encrypt(content){
        return encryptEHR(PlaceholderValues.recordKey,content,PlaceholderValues.medicPrivateKey);
    }
    /**
     * PLACEHOLDER
     * @param  {string} content
     * @returns {Promise<string>}
     */
    static async decrypt(content){
        return content;
    }

    /**
     * Gets all regions from Firebase, and returns them as a list of region names.
     * @returns {Promise<Array<String>>}
     * @async
     * @author Christopher Molin
     */
    static async getRegions(){

        let dbRef = ref(database);
        let regions = [];
        await get(child(dbRef, 'Regions/')).then((snapshot) => {
        if (snapshot.exists()) {
            let results = snapshot.val();
            results.forEach((region) => {
                regions.push(region.name)
            })     
        } else {
            throw ("No data available");
        }
        }).catch((error) => {
            throw (error);
        });
        return regions;
    }

    /**
     * PLACEHOLDER: Gets all regions the given patient have granted permission.
     * Returns a list of region names.
     * @param {String} patientID
     * @returns {Promise<Array<String>>}
     */
     static async getPatientRegions(patientID){
        
        let regions = PlaceholderValues.permittedRegions;
        
        return regions;
    }


    /**
     * Fetches the doctor's full name from Firebase.
     * @param  {String} doctorID A valid SSN
     * @returns {Promise<String>} Doctor's full name
     * @author Christopher Molin
     */
    static async getDoctorFullName(doctorID){

        let dbRef = ref(database);
        let fullName = "";
        await get(child(dbRef, 'Doctors/'+doctorID)).then((snapshot) => {
        if (snapshot.exists()) {
            fullName = snapshot.val().lastName+", "+snapshot.val().firstName;
                 
        } else {
            throw ("The requested doctor is not available");
        }
        }).catch((error) => {
            throw (error);
        });
        return fullName;
    }

    /**
     * Fetches the name of the institution from Firebase.
     * @param  {String} institution A valid id
     * @returns {Promise<String>} The name of the institution
     * @author Christopher Molin
     */
     static async getInstitutionName(institution){

        let dbRef = ref(database);
        let institutionName = "";
        await get(child(dbRef, 'Institutions/'+institution)).then((snapshot) => {
        if (snapshot.exists()) {
            institutionName = snapshot.val().name;
                 
        } else {
            throw ("No data available");
        }
        }).catch((error) => {
            throw (error);
        });
        return institutionName;
    }


    /**
     * Checks to see if provided PatientID exists on Firebase
     * @param  {String} patientID A patient ID to look up
     * @returns {Promise<boolean>} Whether or not the patient exist
     * @author Christopher Molin
     */
     static async checkPatientExist(patientID){

        let dbRef = ref(database);
        let exists = false;
        await get(child(dbRef, 'Patients/'+patientID)).then((snapshot) => {
        if (snapshot.exists()) {
            exists = true;   
        } else {
            exists = false
        }
        }).catch((error) => {
            throw (error);
        });
        return exists;
    }
}