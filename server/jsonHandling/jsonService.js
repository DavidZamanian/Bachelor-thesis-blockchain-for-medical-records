import * as FileSystem from 'fs';
import Ajv from 'ajv';

/**
 * Class for dealing with JSON files, including conversion to and from javascript objects, 
 * as well as validation of objects against a json schema. 
 * @author Edenia Isaac
 * @author Hampus Jernkrook
 */
export default class JSONService {

    /**
     * Creates JSON file from the given object.
     * Inspired by https://stackoverflow.com/questions/45148833/write-json-object-to-json-file-in-javascript
     * @param {Object} object -  the javascript object to convert to a json file. 
     * @param {string} path - the path at which to create the new file.
     */
   static toJsonFile(object, path){
        FileSystem.writeFile(path, JSON.stringify(object), (error) => {
           if (error) throw error;
       });
   }
    
   /**
    * Creates a JS object with the structure of a given JSON file. 
    * @param {string} path - the path to the file to convert to a JS object. 
    * @returns the created object. 
    */
   static fromJsonFile(path){
       fs.readFile(path, (error, content) => {
           if (error) throw error;
           const obj = JSON.parse(content);
       });
       return obj;
   }

   /**
    * Checks if the given object adheres to the supplied schema.
    * Inspired by https://ajv.js.org/guide/getting-started.html#basic-data-validation.
    * @param {Object} schema - Object representing JSON schema. 
    * @param {Object} obj -  Object to check against the schema. 
    * @returns true iff obj adheres to the schema. 
    */
   static isValid(schema, obj) {
       const ajv = new Ajv();
       const validate = ajv.compile(schema);
       const valid = validate(obj);
       return valid;
    }
}