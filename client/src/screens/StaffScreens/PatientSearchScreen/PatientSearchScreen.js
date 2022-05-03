import React, { useState } from "react";
import { Text, View, TextInput } from "react-native";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header/Header";
import ThemeButton from "../../../components/themeButton";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import EHRService from "../../../Helpers/ehrService";
import { ChainConnectionContext } from "../../../../contexts/ChainConnectionContext";

export function PatientSearchScreen() {

  const { chainConnection } = React.useContext(ChainConnectionContext);

  // Change this accordingly
  const expectedPatientIDLength = 10;
  const [patientID, setPatientID] = useState("");
  const [showError, setShowError] = useState("");

  // Navigation: redirect to the overview (staff version)
  const navigation = useNavigation();
  const redirectTo = () => {
    navigation.navigate("EHROverview",patientID);
  };

  
  /**
   * Validates the <TextInput> field to be only digits within certain length.
   * Quite secure, as it will also check when trying to paste non-numeric inputs.
   * @param  {String} id
   * @author Christopher Molin
   */
  const makeValidPatientID = (id) => {
    setShowError("");
    const re = /^[0-9\b]+$/;
      if (id.target.value === "" || re.test(id.target.value)) {
        setPatientID(() => {
          return [id.target.value]
        })
      }
  };

 
  /**
   * Check if the provided patient exist and if the ID is of correct length.
   * Ensures the doctor has permission to access the patient's EHR.
   * Redirects if permitted, shown an error message if not.
   * @author Christopher Molin
   */
  const searchPatient = async () => {
    //alert("[DEBUG] Attempting to search for patient: "+patientID);
    if(patientID.toString().length === expectedPatientIDLength &&
      await EHRService.checkPatientExist(patientID)){
        
        let connection = await chainConnection;

        let patID = "".concat(patientID);
        
        if(await connection.hasPermission(patID)){
          setPatientID("");
          setShowError("");
          redirectTo();
        }
        else{
          setShowError("Error: You lack permission to access "+patientID+"!");
        }
      }
    else{
      setShowError("Error: "+patientID+" is not a valid patient ID!");
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
          <Text style={styles.errorText}>{showError}</Text>
          <View style={{width:325, alignSelf:"center", marginTop:5}}>
            <ThemeButton extraStyle={styles.searchButton} iconName="search-sharp" iconSize={50} labelSize={25} labelText="View Patient EHR" bWidth="100%" onPress={() => {searchPatient()}}/>
          </View>
        </View>
      </View> 
      <Footer/>
    </View>
  );
};
