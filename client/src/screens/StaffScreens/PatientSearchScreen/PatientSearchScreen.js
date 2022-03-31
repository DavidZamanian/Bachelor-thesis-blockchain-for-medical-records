import React, { useState } from "react";
import { Text, View, TextInput } from "react-native";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header/Header";
import ThemeButton from "../../../components/themeButton";
import styles from "./styles";
import { database, ref, onValue} from "../../../../firebaseSetup";
import { useNavigation } from "@react-navigation/native";

export function PatientSearchScreen() {

  // Change this accordingly
  const expectedPatientIDLength = 10;
  const [patientID, setPatientID] = useState("");
  const [showError, setShowError] = useState(false);

  // Navigation: redirect to the overview (staff version)
  const navigation = useNavigation();
  const redirectTo = () => {
    navigation.navigate("EHROverview",patientID);
  };

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
    This method uses the global patientID to check if the provided patient exist.
    patientID is checked to be the correct length and it is assumed REGEX ensures it is only digits.
    Depending on if the patient exists, an error message will show resp. the redirecting-method will be called.

    @Chrimle
  */
  const searchPatient = () => {
    //alert("[DEBUG] Attempting to search for patient: "+patientID);
    if(patientID.toString().length === expectedPatientIDLength){
        const patientRef = ref(database, 'Users/' + patientID);
        onValue(patientRef, (snapshot) => {
          if(snapshot.val() === null){
            setShowError(true);
          }
          else{
            // This will occur only if the specified user exists
            /*
              PLACE CODE HERE
              This is where a check for permission COULD be made. 
            */
            setPatientID("");
            redirectTo();
          }
        });
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
