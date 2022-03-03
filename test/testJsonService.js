/**
 * Tests for the class JSONService.
 * @author Hampus Jernkrook
 * @author Edenia Isaac
 */
import JSONService from "../server/jsonHandling/jsonService.js";
import * as assert from "assert";
import * as fs from 'fs';
import * as path from 'path';

const tmp_directory = "./test/tmp_files";
const example_directory = "./test/json_examples";

describe("validate against schema", function() {
    it("valid object yields true", function() {
        //completely taken from 
        // https://ajv.js.org/guide/getting-started.html#basic-data-validation 
        const schema = {
            type: "object",
            properties: {
              foo: {type: "integer"},
              bar: {type: "string"}
            },
            required: ["foo"],
            additionalProperties: false
        }

        const data = {
            foo: 1,
            bar: "abc"
        }

        assert.ok(JSONService.isValid(schema, data));
    });

    it("invalid object yields false", function() {
        //inspired by: 
        // https://ajv.js.org/guide/getting-started.html#basic-data-validation 
        const schema = {
            type: "object",
            properties: {
              foo: {type: "integer"},
              bar: {type: "string"}
            },
            required: ["foo"],
            additionalProperties: false
        }

        const data = {
            //foo: 1, //does not have the required "foo"-key. 
            bar: "abc"
        }

        assert.strictEqual(JSONService.isValid(schema, data), false);
    });
});

describe("correct conversion from JSON file to JS object", function() {
    /* //NOT IN USE. TODO: should we bother with this?
    it("empty file converts to an empty object", function() {
        const expected = {}
        const actual = JSONService.fromJsonFile(path.join(example_directory, "empty.json"));
        assert.deepEqual(actual, expected);
    });*/
    

    it("small json file converts to correct JS object", function() {
        const expected = {
            foo: 1,
            bar: "abc"
        }

        const actual = JSONService.fromJsonFile(path.join(example_directory, "fooBar.json")); 

        assert.deepEqual(actual, expected);
    });

    it("big json file converts to correct JS object", function(){
        const expected = {
            date: "2022-02-25",
            patientID: "fdjsajkfvhkcjasjcas",
            healthcareInstitution: "Ostra sjukhuset",
            medicalPersonnel: "Lolly Pop",
            details: "thick throat",
            diagnoses: ["allergy against birch"],
            prescriptions: [
                "pollenStopperPill, 2 mg 3 times / day, 4 hrs in between",
                "pollenStopperSpray 2 pills 2 times / day"
            ]
        }

        const actual = JSONService.fromJsonFile(path.join(example_directory, "EHR_entry.json"));
        assert.deepEqual(actual, expected);
    });
    

  
});
/*
describe("correct conversion of an object into a Json File", function() {
    
    it("smal json object converts into a file", function() {
        const obj = {
            foo: 1,
            bar: "abc"
        }

        const pathToFile = path.join(tmp_directory,"tmp_smaller.json");
        JSONService.toJsonFile(obj,pathToFile);
        const reConverted = JSONService.fromJsonFile(pathToFile);

        //remove the file (clean up)
        fs.unlink(pathToFile, err => { if (err) throw err; });
        
        assert.deepEqual(reConverted,obj);
    });


    it("larger JS object converts correctly into JSON file", function() {
        const obj = {
            date: "2022-02-25",
            patientID: "fdjsajkfvhkcjasjcas",
            healthcareInstitution: "Ostra sjukhuset",
            medicalPersonnel: "Lolly Pop",
            details: "thick throat",
            diagnoses: ["allergy against birch"],
            prescriptions: [
                "pollenStopperPill, 2 mg 3 times / day, 4 hrs in between",
                "pollenStopperSpray 2 pills 2 times / day"
            ]
        }

        //check that the file converts back to the right object.
        const pathToFile = path.join(tmp_directory, "tmp_larger.json");
        JSONService.toJsonFile(obj, pathToFile);
        const reConverted = JSONService.fromJsonFile(pathToFile);

        //remove the file (clean up)
        fs.unlink(pathToFile, err => {if (err) throw err;});


        assert.deepEqual(reConverted, obj);
    });
});
*/


