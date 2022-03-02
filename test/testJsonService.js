/**
 * Tests for the class JSONService.
 * @author Hampus Jernkrook
 */
import JSONService from "../server/jsonHandling/jsonService.js";
import * as assert from "assert";

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