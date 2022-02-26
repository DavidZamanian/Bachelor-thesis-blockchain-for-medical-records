// CommonJS version of imports:
//const assert = require("assert");
//const JSONService = require("../server/jsonService/jsonService.js");
// ES6 version:
import JSONService from "../server/jsonService/jsonService.js";
import * as assert from "assert";

describe("add patient id", function() {
    it("add the correct patient id to the ehrEntry", function() {
        const jsonService = new JSONService();
        const id = "id_1"
        jsonService.addPatientID(id);
        assert.equal(jsonService.ehrEntry.patientID, id);
    })
});