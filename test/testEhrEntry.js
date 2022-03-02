// CommonJS version of imports:
//const assert = require("assert");
//const JSONService = require("../server/jsonService/jsonService.js");
// ES6 version:
import EhrEntry from "../server/jsonHandling/EhrEntry.js";
import * as assert from "assert";

describe("set patient id", function() {
    it("sets the correct patient id in the ehrEntry", function() {
        const ehrEntry = new EhrEntry();
        const id = "id_1"
        ehrEntry.setPatientID(id);
        assert.equal(ehrEntry.patientID, id);
    })
});

describe("set healthcare institution", function() {
    it("sets the correct healthcare institution in the ehrEntry", function() {
        const ehrEntry = new EhrEntry();
        const inst = "Ostra sjukhuset";
        ehrEntry.setHealthcareInstitution(inst);
        assert.equal(ehrEntry.healthcareInstitution, inst);
    })
});

describe("set medical personnel", function() {
    it("sets the correct medical personnel in the ehrEntry", function() {
        const ehrEntry = new EhrEntry();
        const personnel = "Hans Andersson";
        ehrEntry.setMedicalPersonnel(personnel);
        assert.equal(ehrEntry.medicalPersonnel, personnel);
    })
});

describe("set details", function() {
    it("sets the correct details in the ehrEntry", function() {
        const ehrEntry = new EhrEntry();
        const details = "stomach ache since ...";
        ehrEntry.setDetails(details);
        assert.equal(ehrEntry.details, details);
    })
});

describe("set details", function() {
    it("sets the correct details in the ehrEntry", function() {
        const ehrEntry = new EhrEntry();
        const details = "stomach ache since ...";
        ehrEntry.setDetails(details);
        assert.equal(ehrEntry.details, details);
    })
});

describe("set diagnoses", function() {
    it("sets the correct diagnoses in the ehrEntry, for non-empty diagnoses array", function() {
        const ehrEntry = new EhrEntry();
        const diagnoses = ["pollen allergy", "stomach ache"];
        ehrEntry.setDiagnoses(diagnoses);
        assert.equal(ehrEntry.diagnoses, diagnoses);
    });

    it("sets the correct diagnoses in the ehrEntry, for empty diagnoses array", function() {
        const ehrEntry = new EhrEntry();
        const diagnoses = [];
        ehrEntry.setDiagnoses(diagnoses);
        assert.equal(ehrEntry.diagnoses, diagnoses);
    });
});

describe("set prescriptions", function() {
    it("sets the correct prescriptions in the ehrEntry, for non-empty prescriptions array", function() {
        const ehrEntry = new EhrEntry();
        const prescriptions = ["pollen stopper", "stomach happy"];
        ehrEntry.setDiagnoses(prescriptions);
        assert.equal(ehrEntry.prescriptions, prescriptions);
    });

    it("sets the correct prescriptions in the ehrEntry, for empty prescriptions array", function() {
        const ehrEntry = new EhrEntry();
        const prescriptions = [];
        ehrEntry.setDiagnoses(prescriptions);
        assert.equal(ehrEntry.prescriptions, prescriptions);
    });
});

