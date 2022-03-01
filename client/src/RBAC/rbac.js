import { AccessControl } from "accesscontrol";

const ac = new AccessControl();

ac.grant('region patitent')

ac.grant('region')
    .readOwn('keypair')
    .readOwn('EHR', ['*'])
    .createOwn('EHR', ['*'])
    .readOwn('personal info')

ac.grant('medicalStaff')
    .extend('region')

ac.grant('patient')
    .readOwn('EHR')
    .readOwn('personal info')
    .createOwn('personal info')

    // a patients EHR can be CRU by region