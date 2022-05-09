import EhrEntry from "./ehrEntry";
import CreateFileObjectError from "./Errors/createFileObjectError";
import fetchFileContentError from "./Errors/FetchFileContentError";
import UploadFileError from "./Errors/uploadFileError";
import FileService from "./fileService";
import { database, ref, get, child } from "../../firebaseSetup";
import FetchFileContentError from "./Errors/FetchFileContentError";
import { PlaceholderValues } from "../placeholders/placeholderValues";
import * as crypt from "../../Crypto/crypt";
import { getAuth } from "@firebase/auth";
import crypto, { createPrivateKey } from "crypto";
import ChainOperationDeniedError from "../chainConnection/chainOperationDeniedError"
import ChainConnectionFactory from "../chainConnection/chainConnectionFactory";
import CouldNotLoadPermittedRegionsError from "./Errors/couldNotLoadPermittedRegionsError";
import ChainConnectionError from "../chainConnection/chainConnectionError";
import CouldNotLoadRegionsError from "./Errors/couldNotLoadRegionsError";
import FirebaseService from "./firebaseService";


export default class EHRService {

  // Class variables
  static chainConnection = ChainConnectionFactory.getChainConnection();
  static privateKey;
  static publicKey;

  // Setters
  static async setPrivateKey(newPrivateKey) { this.privateKey = newPrivateKey; }
  static async setPublicKey(newPublicKey) { this.publicKey = newPublicKey; }


  /**
   * Derives symmetric key from password and salt,
   * fetches private and public keys, 
   * and uses symmetric key to decrypt private key.
   * Then sets the class instance's private and public key variables to these keys.
   * @param  {String} password
   * @param  {String} salt
   * @author Christopher Molin
   */
  static async setKeys(password, salt) {
    
    let symmetricKey = await crypt.derivePrivateKeyFromPassword(password, salt);

    let encryptedPrivateKeyAndIV = await FirebaseService.getEncPrivateKeyAndIV();
    let encryptedData = encryptedPrivateKeyAndIV.slice(46);
    let iv = encryptedPrivateKeyAndIV.slice(0, 44);
    let keyAndIv = { encryptedData, iv };

    let privKey = await crypt.decryptPrivateKey(keyAndIv, symmetricKey);

    this.setPrivateKey(privKey);

    let pubKey = await FirebaseService.getPublicKey();

    this.setPublicKey(pubKey);

    this.setPrivateKey(privKey);

    console.warn(this.privateKey);
    console.warn(this.publicKey);

    console.log(
      "Password:" + password + "\nSalt:" + salt + "\nSymmetric:" + symmetricKey
    );
    console.log("Private:" + privKey + "\nPublic:" + pubKey);
  }

  /**
   * Fetches API-token to Web3Storage from Firebase
   * @returns {Promise<String>} apiToken to Web3Storage
   * @throws
   * @author Christopher Molin
   */
  static async getWeb3StorageToken() {
    let dbRef = ref(database);
    let apiToken = null;
    await get(child(dbRef, "Web3Storage-Token"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          apiToken = snapshot.val();
        } else {
          throw "No data available";
        }
      })
      .catch((error) => {
        throw error;
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
   * @returns {Object} EhrEntry-object instance
   * @author Christopher Molin
   */
  static constructEHR(
    id,
    staff,
    institution,
    details,
    prescriptions,
    diagnoses
  ) {
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
   * @param  {*} item -- Object or Array
   * @returns {Promise<String>} -- Object or list compounded into string
   * @author Christopher Molin
   */
  static async stringify(item) {
    return JSON.stringify(item);
  }

  /**
   * Takes the raw input and creates JSON files of these and uploads to Web3Storage.
   * Returns the CID when done.
   * @param  {String} patientID
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
    patientID,
    staff,
    institution,
    details,
    prescriptions,
    diagnoses
  ) {
    try {

      patientID = "".concat(patientID);

      let finalFiles = [];
      let index = 0;

      let connection = await this.chainConnection;

      let apiToken = await EHRService.getWeb3StorageToken();

      let fs = new FileService(apiToken);

      // Create EHR object + (pre/dia lists)
      let objectEHR = EHRService.constructEHR(
        patientID,
        staff,
        institution,
        details,
        prescriptions,
        diagnoses
      );
      
      console.log("Attempting Fetch");

      try{

        let patientEHR = await this.getEHR(patientID, "doctor", true);

        console.table(patientEHR)

        prescriptions = prescriptions.concat(patientEHR.prescriptions);
        diagnoses = diagnoses.concat(patientEHR.diagnoses);
        finalFiles = finalFiles.concat(patientEHR.journals);

        index = patientEHR.nextIndex;

      }catch(e){
        console.log(e)
        console.log("error when fetching!")
      }
      
      finalFiles = finalFiles.concat( await this.createEHRFiles(objectEHR, prescriptions, diagnoses,index, patientID));

      try{
        
        let newCID = await fs.uploadFiles(finalFiles);
        
        console.log(newCID);

        await connection.updateEHR(patientID, newCID);

        // TESTING ONLY
        // Testing if the cid and the files were uploaded
        console.log(
          "TESTING UPLOAD, (THIS IS WHAT WAS SUBMITTED + THE OLD EHR):\n" +
            `https://${newCID}.ipfs.dweb.link/`
        );
        for (const file of finalFiles) {
          console.log(file.name + ": " + (await file.text()).toString("base64"));
        }

        // DEBUG
        let checkCID = await connection.getEHRCid(patientID);
        console.debug("Expected: "+newCID+"\nActual: "+checkCID);
        // END OF DEBUG

      }catch(e){
        console.log("Error when uploading"+e.message);
      }
      
      return "Success";

    } catch (e) {throw e;}
  }

 /**
  * Method for downloading, decrypting and parsing files from IPFS.
  * @param {string} cid
  * @param {string} decryptedRecordKey
  * @param  {boolean} keepEHRencrypted Whether the EHR-files should be decrypted and parsed, or remain encrypted.
  * @returns {Promise<{ 
  * prescriptions: Array<string>, 
  * diagnoses: Array<string>,
  * decryptedEHRs: Array<object>,
  * encryptedEHRFiles: Array<File>,
  * nextIndex: number
  * }>}
  * If keepEHRencrypted is true, decryptedEHRs will be empty. 
  * If keepEHRencrypted is false, encryptedEHRFiles will be empty and nextIndex will be -1.
  * @author Christopher Molin
  */
  static async getFiles(cid, decryptedRecordKey, keepEHRencrypted){

    let apiToken = await EHRService.getWeb3StorageToken()
    let fs = new FileService(apiToken);

    let prescriptions = [];
    let diagnoses = [];
    let decryptedEHRs = [];
    let encryptedEHRFiles = [];
    let index = 0;

    if (cid.length == 59){
      let filesAndIndex = await fs.fetchEHRFiles(cid, keepEHRencrypted);
      index = filesAndIndex.index;
      for (const file of filesAndIndex.files){

        if (keepEHRencrypted && file.name.search("EHR") != -1){
          encryptedEHRFiles.push(file);
        }
        else{
          let fileContent = await file.text();
          let decryptedData = await this.decrypt(fileContent, decryptedRecordKey);
          let parsedData = await this.parseIntoJSON(decryptedData);

          if(file.name == "prescriptions.json"){
            prescriptions = prescriptions.concat(parsedData);
          }
          else if(file.name == "diagnoses.json"){
            diagnoses = diagnoses.concat(parsedData);
          }
          else if (file.name.search("EHR") != -1){
            decryptedEHRs = decryptedEHRs.concat(parsedData);
          }
        }
      }
    } 

    return {
        prescriptions: prescriptions, 
        diagnoses: diagnoses, 
        nextIndex: index,
        encryptedEHRFiles: encryptedEHRFiles,
        decryptedEHRs: decryptedEHRs
    }
  }


  /**
   * Gets EHR-files and parses contents to an object containing:
   * prescriptions, diagnoses and journals.
   * @param  {string} patientID
   * @param {string} role
   * @param {boolean} keepEncrypted
   * @returns {Promise<{
   * prescriptions: Array<String>
   * diagnoses: Array<String>
   * journals: Array<*>
   * nextIndex: Number
   * }>}
   * @author Christopher Molin
   */
  static async getEHR(patientID, role, keepEncrypted) {

    // This is needed to ensure patientID is in fact a string...
    patientID = "".concat(patientID);

    let encryptedRecordKey = "";

    if (role == "doctor") {
      encryptedRecordKey = await FirebaseService.getDoctorRecordKey(patientID);
    } else if (role == "patient") {
      encryptedRecordKey = await FirebaseService.getPatientRecordKey();
    } else {
      throw "Invalid role!";
    }

    let decryptedRecordKey = await crypt.decryptRecordKey(
      encryptedRecordKey,
      this.privateKey
    );

    let connection = await this.chainConnection;

    let EHR = {
      prescriptions: [],
      diagnoses: [],
      journals: [],
      nextIndex: 0,
    };

    try{
      // This may throw an error
      let cid = await connection.getEHRCid(patientID);
      console.debug(cid)
      if (cid.length == 59){
        let fetchedFiles = await this.getFiles(cid, decryptedRecordKey, keepEncrypted);

        EHR = {
          prescriptions: fetchedFiles.prescriptions,
          diagnoses: fetchedFiles.diagnoses,
          journals: keepEncrypted ? fetchedFiles.encryptedEHRFiles : fetchedFiles.decryptedEHRs,
          nextIndex: fetchedFiles.nextIndex,
        };
      }
    }
    catch(e){
      console.warn("The requested patient "+patientID+" has no prior CIDs. \n "+e)
    }
    
    return EHR;
    
  }

  /**
   * Parse input to JSON
   * @param  {Array<string>} input
   * @returns  {Promise<Array<string> | object>}
   * @author Christopher Molin
   */
  static async parseIntoJSON(input) {
    return await JSON.parse(input);
  }

  /**
   * Encrypts the content and put the Tag and IV at the beginning
   * @param  {string} content The text to be encrypted
   * @param {*} decryptedRecordKey
   * @returns {Promise<string>} The encrypted text, with Tag and IV at the beginning
   * @author Christopher Molin
   */
  static async encrypt(content, decryptedRecordKey) {

    let encryptedEHR = await crypt.encryptEHR(decryptedRecordKey, content);

    console.table(encryptedEHR);

    return "".concat(
      encryptedEHR.Tag.toString("base64"),
      encryptedEHR.iv.toString("base64"),
      encryptedEHR.encryptedData
    );
  }

  /**
   * Decrypts and returns the given file content
   * @param  {string} fileContent file content (including Tag and IV at the beginning)
   * @param {*} decryptedRecordKey
   * @param {*} privateKey
   * @returns {Promise<string>} The decrypted content data (Tag and IV excluded)
   * @author Christopher Molin
   */
  static async decrypt(fileContent, decryptedRecordKey) {

    let tag = fileContent.slice(0, 24);
    let iv = fileContent.slice(24, 68);
    let encrypted = fileContent.slice(68);

    let ivBuffer = Buffer.from(iv, "base64");
    let tagBuffer = Buffer.from(tag, "base64");

    let EHR = {
      iv: ivBuffer,
      encryptedData: encrypted,
      Tag: tagBuffer,
    };

    console.table(EHR);

    let decryptedData = await crypt.decryptEHR(decryptedRecordKey, EHR);

    console.log("DECRYPTED DATA:");
    console.log(decryptedData);
    return decryptedData;
  }

  /**
     * Gets all regions from the blockchain, and returns them as a list of region names.
     * @returns {Promise<Array<String>>}
     * @throws {CouldNotLoadRegionsError} If the operation failed, e.g. due to network error. 
     * @author Hampus Jernkrook
     */
    static async getRegions() {
        let connection = await this.chainConnection;
        let regions;
        try {
            regions = await connection.getAllRegions();
        } catch (err) {
            if (err instanceof ChainConnectionError) {
                throw new CouldNotLoadRegionsError(`Could not load the regions from the blockchain. `+
                `The connection failed. Error: ${err.message}`);
            }
        }
        return regions;
    }

    
  /**
   * Gets all regions the given patient has granted permission to.
   * @param {String} patientID The id of the patient to retrieve permissioned regions for. 
   * @returns {Promise<Array<String>>} Array of regions authorised by the patient.
   * @throws {CouldNotLoadPermittedRegionsError} If the operation failed, e.g. due to network error 
   *  or that the caller is unauthorised to call this function. 
   * @author Hampus Jernkrook
   */
  static async getPatientRegions(patientID){
    let connection = await this.chainConnection;
    let regions;
    try {
        regions = await connection.getPermissionedRegions(patientID);
    } catch (err) {
        if (err instanceof ChainOperationDeniedError) {
            // show that the operation was denied, followed by generic message. 
            throw new CouldNotLoadPermittedRegionsError(`Operation denied:\n` +
            `Could not load permitted regions. Error thrown with message ${err.message}`);
        } 
    }   
    return regions;
  }


  /**
   * Takes the raw data, parses, encrypts and creates files.
   * @param {EhrEntry} objectEHR
   * @param {Array<String>} prescriptions
   * @param {Array<String>} diagnoses
   * @param {Number} index
   * @param {String} patientID
   * @returns {Promise<Array<File>>} The resulting files
   * @author Christopher Molin
   */
  static async createEHRFiles(objectEHR, prescriptions, diagnoses, index, patientID){

    // Make into JSON objects
    let stringEHR = await this.stringify(objectEHR);
    let stringPrescriptions = await this.stringify(prescriptions);
    let stringDiagnoses = await this.stringify(diagnoses);

    // GET RECORD KEY FOR ENCRYPTION & DECRYPTION
    let encryptedRecordKey = await FirebaseService.getDoctorRecordKey(patientID);

    console.warn("Encrypted decryptedRecordKey: " + encryptedRecordKey);
    console.warn("PrivateKey: " + this.privateKey);

    let decryptedRecordKey = await crypt.decryptRecordKey(
      encryptedRecordKey,
      await this.privateKey
    );

    let encryptedEHR = await this.encrypt(stringEHR, decryptedRecordKey);

    let encryptedPrescriptions = await this.encrypt(
      stringPrescriptions,
      decryptedRecordKey
    );
    
    let encryptedDiagnoses = await this.encrypt(
      stringDiagnoses,
      decryptedRecordKey
    );

    // Create JSON files
    let ehrFile = await FileService.createJSONFile(
      encryptedEHR,
      "EHR_" + index
    );
    let prescriptionsFile = await FileService.createJSONFile(
      encryptedPrescriptions,
      "prescriptions"
    );
    let diagnosesFile = await FileService.createJSONFile(
      encryptedDiagnoses,
      "diagnoses"
    );

    return [ehrFile, prescriptionsFile, diagnosesFile];
  }

}
