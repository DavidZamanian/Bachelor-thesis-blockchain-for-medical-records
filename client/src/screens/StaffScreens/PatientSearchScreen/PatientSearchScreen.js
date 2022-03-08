import React, { useState } from "react";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header/Header";
import ThemeButton from "../../../components/themeButton";
import styles from "./styles";

export function PatientSearchScreen() {

  // Change this accordingly
  const expectedPatientIDLength = 12;
  const [patientID, setPatientID] = useState("");
  const [showError, setShowError] = useState(false);

  /* 
    Validates the <TextInput> field to be only digits
    Quite secure, as it will also check when trying to paste non-numeric inputs.

    @Chrimle
  */
  const makeValidPatientID = (e) => {
    setShowError(false);
    const re = /^[0-9\b]+$/;
      if (e.target.value === "" || re.test(e.target.value)) {
        setPatientID(() => {
          return [e.target.value]
        })
      }
  };


  /* 
    This method is called when requesting to search for a patient.
    It uses the global state variable "patientID", no parameters needed.
    The length is checked, it is already assumed the patientID consists of only digits.

    @Chrimle
  */
  const searchPatient = () => {
    //alert("[DEBUG] Attempting to search for patient: "+patientID);
    if(patientID.toString().length === expectedPatientIDLength){
      /* 
        PLACE CODE HERE

        This is where the code for redirecting to the patient overview (staff version)
        the patient ID is stored as an int in: "patientID"
      */
      alert("[PLACEHOLDER] Redirecting to view Patient #"+patientID+"'s EHR...");
    }
    else{
      setShowError(true);
    }
    
  };

  return (
    <View>
      <Header />
      <View style={styles.content}>
        <View style={styles.container}>
          <Text style={styles.headingText}>Patient Search</Text>
          <Text style={styles.describeText}>Search for a patient using their Patient ID</Text>
          <TextInput 
            style={styles.searchBar}
            onChange={makeValidPatientID}
            value={patientID}
            maxLength={expectedPatientIDLength}
            placeholder="Enter patient ID..."
            placeholderTextColor={"grey"}
          />
          {showError && <Text style={styles.errorText}>Error: "{patientID}" is not a valid patient ID!</Text>}
          <View style={{width:325, alignSelf:"center", marginTop:5}}>
            <ThemeButton extraStyle={styles.searchButton} iconName="search-sharp" iconSize={50} labelSize={25} labelText="View Patient EHR" bWidth="100%" onPress={() => {searchPatient()}}/>
          </View>
        </View>
      </View> 
      <Footer />
    </View>
  );
};
