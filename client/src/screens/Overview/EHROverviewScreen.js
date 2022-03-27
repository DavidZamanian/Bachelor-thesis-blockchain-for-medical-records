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

export function EHROverviewScreen(props) {
  const { updateEmail, updateAddress, updatePhoneNr } =
    React.useContext(SubmitContext);

  const { role } = React.useContext(RoleContext);
  const route = useRoute();
  const navigation = useNavigation();

  // FOR TESTING, CHANGE THIS TO "doctor" or "patient", to access the 2 views
  const placeholderRole = "patient";

  const [state, setState] = useState({
    doctorRole: false,
    regions: [],
    patientInfo: PlaceholderValues.patient,
    patientID: props.route.params == null ? 8701104455 : props.route.params,
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
      patientInfo: PlaceholderValues.patient,
    }));
  };

  /* 
    Gather patient info from Firebase (runs automatically at the start) 
  */
  const fetchPatientData = () => {
    //alert("attempting fetch "+patientID)
    if (state.patientID == state.patientInfo.patientId) {
      return;
    }
    const patientRef = ref(database, "Users/" + state.patientID);

    try {
      onValue(patientRef, (snapshot) => {
        if (snapshot.val() === null) {
          alert("ERROR: This patient does not exist:" + state.patientID);
        } else {
          // REPLACE ALL OF THESE WITH METHOD CALLS TO BACKEND!
          const userRole = placeholderRole; //snapshot.val().role
          const allRegions = PlaceholderValues.allRegions;
          const patientJournals = PlaceholderValues.journals;
          const patientPermittedRegions = PlaceholderValues.permittedRegions;
          const patientPrescriptions = PlaceholderValues.prescriptions;
          const patientDiagnoses = PlaceholderValues.diagnoses;

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
            journalExpanded: journalIndexes,
            doctorRole: userRole == "doctor",
            patientInfo: {
              patientId: state.patientID,
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
    alert(state.patientInfo.patientId);
    // Get rid of patient data
    wipePatientData();
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
    // populate input forms before editing
    setAddress(state.patientInfo.address);
    setEmail(state.patientInfo.email);
    setPhoneNr(state.patientInfo.phoneNr);
  };

  const discardContactInfo = () => {
    toggleEditingContactInfo(false);
  };

  const saveContactInfo = () => {
    if (
      validEmail(inputEmail) &&
      validAddress(inputAddress) &&
      validPhoneNr(inputPhoneNr)
    ) {
      if (inputAddress !== state.patientInfo.address) {
        updateAddress(state.patientInfo.patientId, inputAddress);
      }
      if (inputEmail !== state.patientInfo.email) {
        updateEmail(state.patientInfo.patientId, inputEmail);
      }
      if (inputEmail !== state.patientInfo.email) {
        updatePhoneNr(state.patientInfo.patientId, inputPhoneNr);
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

  // FETCH PATIENT DATA
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
                    <View style={styles.regionContainer} key={item.toString()}>
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
          {role == "doctor" ? (
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
