/**
 * Tests for the class EhrEntry.
 * @author Hampus Jernkrook
 */

// CommonJS version of imports:
//const assert = require("assert");
//const JSONService = require("../server/jsonService/jsonService.js");
// ES6 version:
import EhrEntry from "../server/jsonHandling/ehrEntry.js";
import * as assert from "assert";
import * as fc from 'fast-check';


describe("set date", function() {
    it("sets the correct date in the ehrEntry", function() {
        const ehrEntry = new EhrEntry();
        const date = new Date().toJSON();
        ehrEntry.setDate(date);
        assert.equal(ehrEntry.date, date);
    })
});

describe("set patient id", function() {
    it("sets the correct patient id in the ehrEntry", function() {
        fc.assert(
            fc.property( fc.string({minLength: 1}), (id) => {
                const ehrEntry = new EhrEntry();
                ehrEntry.setPatientID(id);
                assert.equal(ehrEntry.patientID, id);
            })
        );
    });
});

describe("set healthcare institution", function() {
    it("sets the correct healthcare institution in the ehrEntry", function() {
        fc.assert(
            fc.property( fc.string({minLength: 1}), (inst) => {
                const ehrEntry = new EhrEntry();
                ehrEntry.setHealthcareInstitution(inst);
                assert.equal(ehrEntry.healthcareInstitution, inst);
            })
        );
    });
});

describe("set medical personnel", function() {
    it("sets the correct medical personnel in the ehrEntry", function() {
        fc.assert(
            fc.property( fc.string({minLength: 1}), (personnel) => {
                const ehrEntry = new EhrEntry();
                ehrEntry.setMedicalPersonnel(personnel);
                assert.equal(ehrEntry.medicalPersonnel, personnel);
            })
        );
    });
});

describe("set details", function() {
    it("sets the correct details in the ehrEntry", function() {
        fc.assert(
            fc.property( fc.string(), (details) => {
                const ehrEntry = new EhrEntry();
                ehrEntry.setDetails(details);
                assert.equal(ehrEntry.details, details);
            })
        );
    });
});

describe("set diagnoses", function() {
    it("sets the correct diagnoses in the ehrEntry - including empty list", function() {
        fc.assert(
            fc.property( fc.array(fc.string()), (diagnoses) => {
                const ehrEntry = new EhrEntry();
                ehrEntry.setDiagnoses(diagnoses);            
                assert.equal(ehrEntry.diagnoses, diagnoses);
            })
        );
    });
});

describe("set prescriptions", function() {
    it("sets the correct prescriptions in the ehrEntry - including empty list", function() {
        fc.assert(
            fc.property( fc.array(fc.string()), (prescriptions) => {
                const ehrEntry = new EhrEntry();
                ehrEntry.setPrescriptions(prescriptions);
                console.log(ehrEntry.prescriptions)
                assert.equal(ehrEntry.prescriptions, prescriptions);
            })
        );
    });
});

