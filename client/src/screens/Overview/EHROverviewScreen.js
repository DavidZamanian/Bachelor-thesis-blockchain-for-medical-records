import React, { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Text, View, Modal, TextInput } from "react-native";
import Footer from "../../components/Footer";
import Header from "../../components/Header/Header";
import styles from "./styles";
import ThemeButton from "../../components/themeButton";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import theme from "../../theme.style";
import { database, ref, onValue } from "../../../firebaseSetup";
import { SubmitContext } from "../../../contexts/SubmitContext";
import { PlaceholderValues } from "../../placeholders/placeholderValues";
import { RoleContext } from "../../../contexts/RoleContext";
import EHRService from "../../Helpers/ehrService";
import { ChainConnectionContext } from "../../../contexts/ChainConnectionContext";


export function EHROverviewScreen(props) {

  const { updateEmail, updateAddress, updatePhoneNr } =
    React.useContext(SubmitContext);

  const { role, userSSN } = React.useContext(RoleContext);
  const route = useRoute();
  const navigation = useNavigation();

  const { chainConnection } = React.useContext(ChainConnectionContext);

  const [state, setState] = useState({
    doctorRole: (role == "doctor"),
    regions: [],
    patientInfo: PlaceholderValues.patient,
    patientID: null,
    journalExpanded: [],
    editingContactInfo: false,
    inputAddress: "",
    inputAddress: "",
    inputPhoneNr: "",
    inputEmail: "",
    modalVisible: false,
    showWarning: false,
    regionSnapshot: [],
  });


  const wipePatientData = () => {
    setState((prevState) => ({
      ...prevState,
      patientID: null,
      patientInfo: PlaceholderValues.patient,
    }));
  };

  /* 
    Gather patient info from Firebase (runs automatically at the start) 
  */

  const fetchPatientData = () => {

    //alert("userSSN: "+userSSN+"\npatientID: "+state.patientID+"\npatientInfo.ID:"+state.patientInfo.id+"\nprops: "+props.route.params)
    if ( (state.patientID != null && state.patientID == state.patientInfo.id) || (state.doctorRole && props.route.params == state.patientInfo.id)) {
      return;
    }
    const patientRef = ref(database, "Patients/" + (state.doctorRole ? props.route.params : userSSN ));

    try {
      onValue(patientRef, async (snapshot) => {
        if (snapshot.val() === null) {
          alert("ERROR: This patient does not exist:" + state.patientID+"\n"+patientRef);
        } else {
          
          // REPLACE ALL OF THESE WITH METHOD CALLS TO BACKEND!

          const allRegions = await EHRService.getRegions();
          const patientPermittedRegions = await EHRService.getPatientRegions((state.doctorRole ? props.route.params : userSSN ))

          let ehr = await EHRService.getEHR((state.doctorRole ? props.route.params : userSSN ))

          const patientPrescriptions = ehr.prescriptions
          const patientDiagnoses = ehr.diagnoses;
          const patientJournals = ehr.journals;

          let journalIndexes = [];
          patientJournals.forEach(() => journalIndexes.push(false));

          let regionIndexes = [];
          allRegions.forEach((reg) =>
            regionIndexes.push({ name: reg, enabled: false })
          );
          patientPermittedRegions.forEach(
            (reg) => (regionIndexes.find((r) => r.name === reg).enabled = true)
          );

          setState((prevState) => ({
            ...prevState,
            patientID: state.doctorRole ? props.route.params : userSSN,
            journalExpanded: journalIndexes,
            patientInfo: {
              id: state.doctorRole ? props.route.params : userSSN,
              firstName: snapshot.val().firstName,
              lastName: snapshot.val().lastName,
              email: snapshot.val().email,
              address: snapshot.val().address,
              phoneNr: snapshot.val().phoneNr,
              // getPrescriptions
              // getDiagnoses
              // getPermittedRegions
              // getJournals
              prescriptions: patientPrescriptions,
              diagnoses: patientDiagnoses,
              permittedRegions: patientPermittedRegions,
              journals: patientJournals,
            },
            regions: [...regionIndexes],
            regionSnapshot: [...regionIndexes],
          }));
        }
      });
    } catch (e) {}
  };

  // To toggle editing of contact info
  const [inputAddress, setAddress] = useState("");
  const [inputPhoneNr, setPhoneNr] = useState("");
  const [inputEmail, setEmail] = useState("");

  /* 
    Method for toggle the collapsing of a journal entry.
    Takes index as parameter to identify which one to toggle.

    @Chrimle
  */
  const toggleExpandJournal = (index) => {
    let enabled = state.journalExpanded[index];
    let updated = state.journalExpanded;
    updated.splice(index, 1, !enabled);

    setState((prevState) => ({
      ...prevState,
      journalExpanded: updated,
    }));
  };

  /* 
    Submit new permitted regions

    @Chrimle
  */
  const submitData = () => {
    alert("Submitting settings...");
    const regStrings = state.regions.map(function (item) {
      return item["name"] + " " + item["enabled"] + "\n";
    });
    alert(regStrings.toString());

    togglePopup(false);
  };

  /* 
    Toggle the (index):th checkbox on or off

    @Chrimle
  */
  const toggleCheckbox = (index) => {
    let enabled = state.regions[index].enabled;
    let name = state.regions[index].name;
    let updated = state.regions;

    updated.splice(index, 1, { name: name, enabled: !enabled });

    setState((prevState) => ({
      ...prevState,
      regions: updated,
    }));
  };

  /*
    Method for redirecting to NewEntryScreen to make a new EHR entry
    Possibly check privilege before proceeding?

    @Chrimle
  */
  const requestAddEHR = () => {

    // CHECK PRIVILEGE?

    //wipePatientData();

    navigation.navigate("NewEntryScreen", state.patientID);
  };

  const toggleWarning = (enabled) => {
    setState((prevState) => ({
      ...prevState,
      showWarning: enabled,
    }));
  };

  const toggleEditingContactInfo = (enabled) => {
    setState((prevState) => ({
      ...prevState,
      editingContactInfo: enabled,
    }));
  };

  const editContactInfo = () => {
    toggleWarning(false);
    toggleEditingContactInfo(true);
    // populating input forms before editing
    setAddress(state.patientInfo.address);
    setEmail(state.patientInfo.email);
    setPhoneNr(state.patientInfo.phoneNr);
  };

  const discardContactInfo = async () => {
    //TODO REMOVE ALL LINES UP UNTIL ...
    console.log("Discarding..."); //TODO REMOVE
    const connection = await chainConnection;
    console.log(connection); //print the connection object to inspect things such as address used
    // ====== TESTS: comment out all but the one you want to try and see result in your console =====
    // TESTING hasPermission - set your account to either Account 2 or Account 10 for this to pass. 
    const res = await connection.hasPermission("p_gbg");
    // TESTING getPermissionedRegions - set your account to Account 10 for this to pass. 
    //const res = await connection.getPermissionedRegions("p_gbg");
    // TESTING getEHRCid - set your account to Account 1 for this to pass. 
    //await connection.updateEHR("p_gbg", "CID NR 1");
    //const res = await connection.getEHRCid("p_gbg"); //may have to run this separate from updateEHR
    // TESTING setting new permissions - set your account to Account 10 for this to pass. 
    //await connection.setPermissions("p_boras", ["boras", "gbg"]);
    //const res = await connection.getPermissionedRegions("p_boras"); //may have to run this separate from setPermissions
    console.log(res);
    // ================
    console.log("Done discarding.");
    // UNTIL HERE
    toggleEditingContactInfo(false);
  };

  const saveContactInfo = () => {
    if (
      validEmail(inputEmail) &&
      validAddress(inputAddress) &&
      validPhoneNr(inputPhoneNr)
    ) {
      if (inputAddress !== state.patientInfo.address) {
        updateAddress(state.patientInfo.id, inputAddress);
      }
      if (inputEmail !== state.patientInfo.email) {
        updateEmail(state.patientInfo.id, inputEmail);
      }
      if (inputPhoneNr !== state.patientInfo.phoneNr) {
        updatePhoneNr(state.patientInfo.id, inputPhoneNr);
      }
      toggleEditingContactInfo(false);
    } else {
      toggleWarning(true);
    }
  };

  const validEmail = (email) => {
    return email !== "";
  };
  const validAddress = (address) => {
    return address !== "";
  };
  const validPhoneNr = (phoneNr) => {
    return phoneNr !== "";
  };

  const togglePopup = (enabled) => {
    setState((prevState) => ({
      ...prevState,
      modalVisible: enabled,
      regions: [...state.regionSnapshot],
    }));
  };

  fetchPatientData();

  return (
    <View>
      <Header />
      <View style={styles.content}>
        <Modal
          animationType="none"
          transparent={true}
          visible={state.modalVisible}
          horizontal={false}
          numColumns={3}
          onRequestClose={() => {
            alert("The submission was cancelled.");
            togglePopup(false);
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.80)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.popupWindow}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  padding: 10,
                  borderBottomColor: "grey",
                  borderBottomWidth: 2,
                }}
              >
                <Text style={styles.contentHeader}>Configure Data Privacy</Text>
              </View>
              <View style={{ flex: 7 }}>
                <Text style={[styles.description, { padding: 10 }]}>
                  Select which regions you allow to read your medical record, by
                  checking the corresponding box. Regions you currently have
                  given permission to are pre-filled.
                </Text>
                <FlatList
                  style={styles.regionList}
                  data={state.regions}
                  numColumns={3}
                  keyExtractor={({ item, index }) => index}
                  renderItem={({ item, index }) => (
                    <View style={[styles.regionContainer,
                      {
                        backgroundColor:(index%2 ? "#FFFFFF" : "#F2F2F2")
                      }]} key={item.toString()}>
                      <TouchableOpacity
                        style={[
                          styles.checkbox,
                          {
                            backgroundColor: item.enabled
                              ? theme.PRIMARY_COLOR
                              : "white",
                          },
                        ]}
                        onPress={() => toggleCheckbox(index)}
                      >
                        {item.enabled && (
                          <Icon
                            name="checkmark-outline"
                            size={20}
                            color="white"
                          />
                        )}
                      </TouchableOpacity>
                      <Text style={styles.regionLabel}>{item.name}</Text>
                    </View>
                  )}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  borderTopColor: "grey",
                  borderTopWidth: 1,
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <TouchableOpacity
                  onPress={() => togglePopup(false)}
                  style={[styles.popupButton, styles.greyButton]}
                >
                  <Text>Discard changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => submitData()}
                  style={[styles.popupButton, styles.primaryButton]}
                >
                  <Text style={{ color: "white" }}>Submit changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Text style={styles.contentHeader}>Patient Overview</Text>
        <View style={styles.rowContainer}>
          <View style={styles.container}>
            <Text style={styles.header}>Contact Info</Text>
            <View>
              <View style={styles.contactItem}>
                <Text style={styles.contactKey}>Full name: </Text>
                <Text style={styles.contactValue}>
                  {state.patientInfo.lastName}, {state.patientInfo.firstName}
                </Text>
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.contactKey}>Address: </Text>
                {state.editingContactInfo ? (
                  <View style={styles.contactValue}>
                    <TextInput
                      style={styles.contactInput}
                      onChangeText={setAddress}
                      value={inputAddress}
                      placeholder="Full address"
                      multiline={true}
                    />
                  </View>
                ) : (
                  <Text style={styles.contactValue}>
                    {state.patientInfo.address}
                  </Text>
                )}
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.contactKey}>Phone: </Text>
                {state.editingContactInfo ? (
                  <View style={styles.contactValue}>
                    <TextInput
                      style={styles.contactInput}
                      onChangeText={setPhoneNr}
                      value={inputPhoneNr}
                      placeholder="Phone number"
                    />
                  </View>
                ) : (
                  <Text style={styles.contactValue}>
                    {state.patientInfo.phoneNr}
                  </Text>
                )}
              </View>
              <View style={styles.contactItem}>
                <Text style={styles.contactKey}>Email: </Text>
                {state.editingContactInfo ? (
                  <View style={styles.contactValue}>
                    <TextInput
                      style={styles.contactInput}
                      onChangeText={setEmail}
                      value={inputEmail}
                      placeholder="Email address"
                      keyboardType="email-address"
                    />
                  </View>
                ) : (
                  <Text style={styles.contactValue}>
                    {state.patientInfo.email}
                  </Text>
                )}
              </View>
              {state.editingContactInfo && state.showWarning && (
                <View style={styles.contactItem}>
                  <Text style={styles.warningLabel}>
                    Error: Input fields cannot be empty
                  </Text>
                </View>
              )}

              {role == "patient" && (
                <View style={styles.contactItem}>
                  {state.editingContactInfo ? (
                    <>
                      <ThemeButton
                        labelText="Discard Changes"
                        labelSize={15}
                        extraStyle={[
                          styles.detailButton,
                          styles.journalItemText,
                          { backgroundColor: "#DA1414" },
                        ]}
                        onPress={() => discardContactInfo()}
                      />
                      <ThemeButton
                        labelText="Save Changes"
                        labelSize={15}
                        extraStyle={[
                          styles.detailButton,
                          styles.journalItemText,
                        ]}
                        onPress={() => saveContactInfo()}
                      />
                    </>
                  ) : (
                    <ThemeButton
                      labelText="Change contact info"
                      labelSize={15}
                      extraStyle={[styles.detailButton, styles.journalItemText]}
                      onPress={() => editContactInfo()}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
          { state.doctorRole ? (
            // Doctor Version
            <View style={styles.container}>
              <Text style={styles.header}>Add EHR entry</Text>
              <Text style={styles.description}>
                Create a new EHR entry for the current patient, including
                diagnoses and prescriptions.
              </Text>
              <ThemeButton
                labelText="Add"
                labelSize={25}
                iconName="add-outline"
                iconSize={30}
                bWidth={120}
                bHeight={60}
                onPress={() => requestAddEHR()}
              />
            </View>
          ) : (
            // Patient Version
            <View style={styles.container}>
              <Text style={styles.header}>Data Privacy</Text>
              <Text style={styles.description}>
                Configure what regions can access and view your medical record.
                You can change this at any time.
              </Text>
              <ThemeButton
                labelText="Configure"
                labelSize={25}
                iconName="eye-outline"
                iconSize={30}
                bWidth={200}
                bHeight={60}
                onPress={() => togglePopup(true)}
              />
            </View>
          )}
        </View>
        <View style={styles.rowContainer}>
          <View style={styles.container}>
            <Text style={styles.header}>Prescriptions</Text>
            <FlatList
              data={state.patientInfo.prescriptions}
              keyExtractor={({ item, index }) => index}
              renderItem={({ item, index }) => (
                <View key={index}>
                  <Text style={styles.bulletpointList}>
                    {"\u2022"} {item}
                  </Text>
                </View>
              )}
            />
          </View>
          <View style={styles.container}>
            <Text style={styles.header}>Diagnoses</Text>
            <FlatList
              data={state.patientInfo.diagnoses}
              keyExtractor={({ item, index }) => index}
              renderItem={({ item, index }) => (
                <View key={index}>
                  <Text style={styles.bulletpointList}>
                    {"\u2022"} {item}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={[styles.container, styles.doubleContainer]}>
            <Text style={styles.header}>Past record entries</Text>
            <FlatList
              style={{ width: "100%" }}
              data={state.patientInfo.journals}
              keyExtractor={({ item, index }) => index}
              ListHeaderComponent={
                <View style={styles.journalListItem}>
                  <Text
                    style={[styles.journalItemText, styles.journalListHeader]}
                  >
                    Date
                  </Text>
                  <Text
                    style={[
                      styles.journalItemText,
                      styles.journalListHeader,
                      { flex: 4 },
                    ]}
                  >
                    Location
                  </Text>
                  <Text
                    style={[
                      styles.journalItemText,
                      styles.journalListHeader,
                      { flex: 4 },
                    ]}
                  >
                    Issued by
                  </Text>
                  <Text
                    style={[
                      styles.journalItemText,
                      styles.journalListHeader,
                      { flex: 1 },
                    ]}
                  ></Text>
                </View>
              }
              renderItem={({ item, index }) => (
                <View style={styles.journalContainer} key={index}>
                  <TouchableOpacity
                    style={[
                      styles.journalListItem,
                      {
                        backgroundColor: state.journalExpanded[index]
                          ? theme.SECONDARY_COLOR
                          : "#F3F3F3",
                      },
                    ]}
                    onPress={() => toggleExpandJournal(index)}
                  >
                    <Text style={styles.journalItemText}>
                      {item.date.toString().slice(0, 10)}
                    </Text>
                    <Text style={[styles.journalItemText, { flex: 4 }]}>
                      {item.healthcareInstitution}
                    </Text>
                    <Text style={[styles.journalItemText, { flex: 4 }]}>
                      {item.medicalPersonnel}
                    </Text>
                    <Icon
                      name={
                        state.journalExpanded[index]
                          ? "chevron-up-outline"
                          : "chevron-down-outline"
                      }
                      color={theme.PRIMARY_COLOR}
                      style={[
                        styles.journalItemText,
                        { flex: 1, fontSize: 40 },
                      ]}
                    />
                  </TouchableOpacity>
                  {state.journalExpanded[index] > 0 && (
                    <View style={styles.journalExpandedContainer}>
                      <View style={styles.journalExpandedRow}>
                        <View style={styles.journalDataBlock}>
                          <Text style={styles.journalDetailsHeader}>
                            Details
                          </Text>
                          <Text style={styles.journalDetails}>
                            {item.details}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.journalExpandedRow}>
                        <View style={styles.journalDataBlock}>
                          <Text style={styles.journalDetailsHeader}>
                            Prescriptions
                          </Text>
                          {item.prescriptions.map((txt) => {
                            return <Text key={txt}>{txt}</Text>;
                          })}
                        </View>
                        <View style={styles.journalDataBlock}>
                          <Text style={styles.journalDetailsHeader}>
                            Diagnoses
                          </Text>
                          {item.diagnoses.map((txt) => {
                            return <Text key={txt}>{txt}</Text>;
                          })}
                        </View>
                        <View style={styles.journalDataBlock}>
                          <Text style={styles.journalDetailsHeader}>
                            Written by
                          </Text>
                          <Text style={styles.journalAuthor}>
                            {item.medicalPersonnel}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}
            />
          </View>
        </View>
      </View>
      <Footer />
    </View>
  );
}
