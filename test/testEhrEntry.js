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


describe("Set date", function() {
    it("sets the correct date in the ehrEntry", function() {
        const ehrEntry = new EhrEntry();
        const date = new Date().toJSON();
        ehrEntry.setDate(date);
        assert.equal(ehrEntry.date, date);
    })
});

describe("Set patientID", function() {
    it("Set and re-set PatientID in EHREntry", function() {
        const ehrEntry = new EhrEntry();
        fc.assert(
            fc.property( fc.string({minLength: 1}), (id) => {
                ehrEntry.setPatientID(id);
                assert.equal(ehrEntry.patientID, id);
            })
        );
    });
});

describe("Set healthcare institution", function() {
    it("Set and re-set healthcare institution in EHREntry", function() {
        const ehrEntry = new EhrEntry();
        fc.assert(
            fc.property( fc.string({minLength: 1}), (inst) => {
                ehrEntry.setHealthcareInstitution(inst);
                assert.equal(ehrEntry.healthcareInstitution, inst);
            })
        );
    });
});

describe("Set medical personnel", function() {
    it("Set and re-set medical personnel in EHREntry", function() {
        const ehrEntry = new EhrEntry();
        fc.assert(
            fc.property( fc.string({minLength: 1}), (personnel) => {
                ehrEntry.setMedicalPersonnel(personnel);
                assert.equal(ehrEntry.medicalPersonnel, personnel);
            })
        );
    });
});

describe("Set details", function() {
    it("Set and re-set details in EHREntry", function() {
        const ehrEntry = new EhrEntry();
        fc.assert(
            fc.property( fc.string(), (details) => {
                ehrEntry.setDetails(details);
                assert.equal(ehrEntry.details, details);
            })
        );
    });
});

describe("Set diagnoses", function() {
    it("Set and re-set diagnoses in EHREntry - including empty list", function() {
        const ehrEntry = new EhrEntry();
        fc.assert(
            fc.property( fc.array(fc.string()), (diagnoses) => {
                ehrEntry.setDiagnoses(diagnoses);            
                assert.equal(ehrEntry.diagnoses, diagnoses);
            })
        );
    });
});

describe("Set prescriptions", function() {
    it("Set and re-set prescriptions in EHREntry - including empty list", function() {
        const ehrEntry = new EhrEntry();
        fc.assert(
            fc.property( fc.array(fc.string()), (prescriptions) => {
                ehrEntry.setPrescriptions(prescriptions);
                assert.equal(ehrEntry.prescriptions, prescriptions);
            })
        );
    });
});

