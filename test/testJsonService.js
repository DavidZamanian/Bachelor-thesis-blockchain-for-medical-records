/**
 * Tests for the class JSONService.
 * @author Hampus Jernkrook
 */
import JSONService from "../server/jsonHandling/jsonService.js";
import * as assert from "assert";
import * as fs from 'fs';
import * as path from 'path';

const tmp_directory = "./tmp_files";
const example_directory = "./json_examples";

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
    /*
    it("empty file converts to an empty object", function() {
        
    });
*/
    it("small json file converts to correct JS object", function() {
        const expected = {
            foo: 1,
            bar: "abc"
        }

        const actual = JSONService.fromJsonFile("./json_examples/fooBar.json"); //path.join(example_directory, "fooBar.json")
        //console.log(actual);

        assert.equal(actual, expected);
    });
});