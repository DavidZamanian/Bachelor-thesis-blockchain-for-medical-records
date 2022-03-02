import * as FileSystem from 'fs';
import * as ajv  from 'ajv';

export default class JSONService {

   static toJsonFile(object, path){
        FileSystem.writeFile(path, JSON.stringify(object), (error) => {
           if (error) throw error;
       });
   }
    
   static fromJsonFile(path){
       fs.readFile(path, (error, content) => {
           if (error) throw error;
           const obj = JSON.parse(content);
       });
       return obj;
   }

   static isValid(schema, obj) {
       const ajv = new Ajv();
       const validate = ajv.compile(schema);
       const valid = validate(obj);
       if (valid) {
        return true;
       }
       return false;
     }

}