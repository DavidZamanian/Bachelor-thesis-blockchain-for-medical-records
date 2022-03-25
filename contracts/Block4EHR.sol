// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
* @author Hampus Jernkrook
*/ 
contract Block4EHR {

    //================= STRUCTS ====================
    struct EHR {
        // healthcare provider/institution and the personnel issuing this EHR update.
        HealthcareInst healthcareInst; //id of healthcare inst.
        MedicalPersonnel medPersonnel; //id of medical personnel
        Patient patient; // the id of the patient that this EHR snapshot is for.
        string cid; // content identifier referencing the IPFS archive containing the EHR files. 
    }

    struct HealthcareInst {
        string id;
        string name;   
        string region; // region where this institution resides. 
    }

    struct MedicalPersonnel {
        address addr; // ethereum wallet address 
        string id;
        HealthcareInst healthcareInst; // workplace of this personnel. 
    }

    struct Patient {
        address addr; // ethereum wallet address  
        string id;
        string[] permissionedRegions;
    }
    //===============================================

    //================= MAPPINGS ==================== //TODO REMOVE PUBLIC ACCESS WHEN DONE TESTING
    // ===== PATIENT MAPPINGS ======
    // mapping patient id to its latest EHR update
    mapping(string => EHR) public ehrs;

    //mapping patient id to the patient struct object 
    mapping(string => Patient) public patients;

    // ===== MEDICAL PERSONNEL MAPPINGS ======
    //mapping medical personnel address to the corresponding personnel object
    mapping(address => MedicalPersonnel) public medicalPersonnels;

    // ===== HEALTHCARE INST. MAPPINGS ======
    mapping(string => HealthcareInst) public healthcareInstitutions;
    //===============================================

    //================= FUNCTIONS ===================

    //======= ADDING OBJECTS ========
    function addHealthcareInst(string memory _id, string memory _name, string memory _region) public {
        healthcareInstitutions[_id] = HealthcareInst(_id, _name, _region);
    }

    function addMedicalPersonnel(address _addr, string memory _id, string memory _healthcareInstId) public {
        HealthcareInst memory inst = healthcareInstitutions[_healthcareInstId]; //TODO: might not be needed it we want inst to be the id....
        medicalPersonnels[_addr] = MedicalPersonnel(_addr, _id, inst);
    }

    function addPatient(address _addr, string memory _id, string[] memory _permissionedRegions) public {
        patients[_id] = Patient(_addr, _id, _permissionedRegions);
    }

    //======= CHECKING THAT THE FUNCTION INVOKER IS PERMISSIONED ========
    /** Check if the invoker is either the patient or a permissioned personnel. */ 
    function hasPermission(string memory _patientId) public view returns(bool) {
        return (isPatient(_patientId) || personnelHasPermission(_patientId));
    }

    /** Checks if the function invoker is the patient with id == _patientId.  */
    function isPatient(string memory _patientId) internal view returns(bool) {
        // TODO REMOVE COMMENTED CODE
        return (msg.sender == patients[_patientId].addr);
        //if (msg.sender == patients[_patientId].addr) {return true;}
        //return false;
    }

    /** Check if the invoker is a personnel with access permission to the patient's EHR. 
    * True iff the personnel's institution's region is in the list of permissioned regions. 
    */ 
    function personnelHasPermission(string memory _patientId) internal view returns(bool) {
        string memory senderRegion = medicalPersonnels[msg.sender].healthcareInst.region;
        return regionIsPermissioned(_patientId, senderRegion);
    }

    /** Checks if the _region is in the patient's list of permissioned regions. */ 
    function regionIsPermissioned(string memory _patientId, string memory _region) internal view returns(bool) {
        string[] memory _permissionedRegions = patients[_patientId].permissionedRegions;
        // if _permissionedRegions contains the region, then true. 
        for (uint i = 0; i < _permissionedRegions.length; i++) {
            if (equals(_permissionedRegions[i], _region)) {
                return true;
            }
        }
        return false; // region is not permissioned.
    }

    /** Checks if two strings are equal. 
    * Inspired by Merunas Grincalaitis' answer at
    * https://ethereum.stackexchange.com/questions/30912/how-to-compare-strings-in-solidity 
    */ 
    function equals(string memory s1, string memory s2) internal pure returns(bool) {
        return keccak256(bytes(s1)) == keccak256(bytes(s2));
    }

    //======= UPDATE EHR ========

    /** Updates the patient id => EHR mapping. 
    * The value in this mapping contains the new EHR snapshot/version reference (the cid)
    * as well as which medical personnel who issues this update and from what healthcare institution.
    * And also the patient object it concerns. 
    */
    function updateEHR(string memory _patientId, string memory _cid)
        public onlyPermissionedStaff(_patientId)
    {
        MedicalPersonnel memory sender = medicalPersonnels[msg.sender];
        HealthcareInst memory _healthcareInst = sender.healthcareInst;
        Patient memory _patient = patients[_patientId];
        ehrs[_patientId] = EHR(_healthcareInst, sender, _patient, _cid);
    }

    /** Checks that the function invoker is a medical personnel within some region permissioned by the patient. */
    modifier onlyPermissionedStaff(string memory _patientId) {
        // TODO REMOVE COMMENTED CODE
        //string memory _senderRegion = medicalPersonnels[msg.sender].healthcareInst.region;
        //bool _regionIsPermissioned = regionIsPermissioned(_patientId, _senderRegion);
        //require(_regionIsPermissioned);
        require(personnelHasPermission(_patientId));
        _;
    }

    //======= RETRIEVE EHR CID ========

    /** Get the cid of the EHR mapped to the given patient
    * only if the function invoker is the patient or a permissioned medical personnel. 
    */
    function getEHRCid(string memory _patientId) public view onlyPatientOrPermissioned(_patientId) returns(string memory) {
        return getEHR(_patientId).cid;
    }
    
    /** Get the EHR mapped to the given patient. */ 
    function getEHR(string memory _patientId) internal view returns(EHR memory) {
        return ehrs[_patientId];
    }

    /** Checks that the function invoker is either the patient with id == _patientId
    * or a medical personnel within some region permissioned by the patient. 
    */
    modifier onlyPatientOrPermissioned(string memory _patientId) {
        // TODO REMOVE COMMENTED CODE
        //string memory _senderRegion = medicalPersonnels[msg.sender].healthcareInst.region;
        bool _isPatient = isPatient(_patientId);
        //bool _regionIsPermissioned = regionIsPermissioned(_patientId, _senderRegion);
        bool _personnelHasPermission = personnelHasPermission(_patientId);
        require(_isPatient || _personnelHasPermission);
        _;
    }

    //======= UPDATE PERMISSIONED REGIONS ========

    /** TODO REMOVE??? This version is superceded by the `setPermissions(...)` function. 
    * Adds the given region to the patient's list of permissioned regions.  
    * Can only be invoked by the patient itself. 
    */
    function addPermission(string memory _patientId, string memory _region) public 
        onlyPatient(_patientId) 
        notAlreadyPresent(_patientId, _region)
    {
        patients[_patientId].permissionedRegions.push(_region);
    } 

    /** Sets the patient's list of permissioned regions to the given array of regions. 
    * Can be used both to add or remove permissions.
    */ 
    function setPermissions(string memory _patientId, string[] memory _regions) public 
        onlyPatient(_patientId)
    {
        patients[_patientId].permissionedRegions = _regions;
    }

    /** Checks that the function invoker is the patient with id == _patientId. */
    modifier onlyPatient(string memory _patientId) {
        require(patients[_patientId].addr == msg.sender);
        _;
    }

    // TODO: REMOVE if addPermissions is removed. 
    /** Checks that the region is not already in the patient's list of permissioned regions */
    modifier notAlreadyPresent(string memory _patientId, string memory _region) {
        // if the region is not currently permissioned, then it is not in the list.
        require(!regionIsPermissioned(_patientId, _region));
        _;
    }

    /** Get the patient's list of permissioned regions. */ 
    function getPermissionedRegions(string memory _patientId) public view
        onlyPatient(_patientId) returns(string[] memory) {
        return patients[_patientId].permissionedRegions;
    }
}