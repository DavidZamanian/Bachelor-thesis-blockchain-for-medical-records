import React, { useState, setState } from "react";
import { Text, View, Pressable , Image, SafeAreaView, FlatList, Alert, Modal} from "react-native";
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Header from "../../../components/Header/Header";
import Icon from "react-native-vector-icons/Ionicons";
import ColouredIcon from "../../../components/colouredIcon";
import ColouredButton from "../../../components/colouredButton";
import RemoveButton from "../../../components/removeButton";
import ContrastIcon from "../../../components/contrastIcon";
import ContrastText from "../../../components/contrastText";
import styles from "../../../styles";
import EhrEntry from "../../../../../server/jsonHandling/ehrEntry";
  

  


export function NewEntryScreen() {

  

  // These are for testing purposes only
  const prescriptions = [
    /*
    {
      name:'PollenStopper 2000',
      dosage:'1 pill twice a day when neede'
    },
    {
      name:'StomachAcheCleanser',
      dosage:'no more than 4 dosage per day'
    },
    {
      name:'OuchHinderer',
      dosage:'1 pill every other day'
    },
    {
      name:'EyeDropper',
      dosage:'1 pill every other day'
    },
    {
      name:'TummyHelper',
      dosage:'1 pill every other day'
    }*/

  ];
  const diagnoses = [
    /*
    {
      diagnosis:'Birch allergy'
    },
    {
      diagnosis:'Tummy ache'
    }*/
  ];



  // Storing the states of inputs
  const [inputPrescription, setInputPrescription] = useState("");
  const [inputDosage, setInputDosage] = useState("");
  const [inputDiagnosis, setInputDiagnosis] = useState("");
  const [inputDetails, setInputDetails] = useState("");
  /* For patient ID to be preled, enter it here below */
  const [inputPatient, setInputPatient] = useState("1234 5678 1234");
  const medicalPerson = "Placeholder Staff";
  const healthcareInst = "Placeholder Hospital";

  /* This is the popup window - whether it is visible or no */ 
  const [modalVisible, setModalVisible] = useState(false);

  /* These can have useState(prescriptions) for testing purposes*/
  const [prescriptionsList, setPrescriptionsList] = useState(prescriptions);
  const [diagnosesList, setDiagnosesList] = useState(diagnoses);

  /*
    Method is given an index of a prescription to be deleted.
    It deletes the prescription at (index).
    The <FlatList> will automatically re-render to reflect this change.
    
    @Chrimle 
  */
  const removePrescription = (index) => {
  
    setPrescriptionsList((prevState) => { 

      prevState.splice(index,1);
      
      return [...prevState];
    })
    
  }

  /*
    Method gathers TextInput values for Prescription name and dosage.
    Adds it to locally stored JSON object, by updating the state.
    The <FlatList> will automatically trigger a re-render to reflect the new state.
    Clears both <TextInput> fields.
    
    @Chrimle 
  */
  const addPrescription = () => {

    setPrescriptionsList((prevState) => {
      
      prevState.push({name:inputPrescription,dosage:inputDosage});

      return [...prevState];
    })
    setInputPrescription((prevState) => {
      return "";
    })
    setInputDosage((prevState) => {
      return "";
    })
  }
  


  /* 
    Method for removing a diagnosis.
    This removes a diagnosis at index from the list of diagnoses.
    This in turn triggers a re-render of the <FlatList> of diagnoses.

    @Chrimle
  */
  const removeDiagnosis = (index) => {
  
    setDiagnosesList((prevState) => {

      prevState.splice(index,1);
      
      return [...prevState];
    })
    
  }
  /* 
    Method for adding diagnosis to the list of diagnoses
    This updates the list, triggers a re-render of the <FlatList>,
    and clears the old text in the <TextInput>

    @Chrimle
  */
  const addDiagnosis = () => {

    setDiagnosesList((prevState) => {
      
      prevState.push({diagnosis:inputDiagnosis});

      return [...prevState];
    })
    setInputDiagnosis((prevState) => {
      return "";
    })
  }


  /* 
    Method for submitting data.
    Create an EHR entry object, and populate it with data.
    (Includes a work-around for prescription names and dosages being separate).
    The resulting contents of the EHR object is printed as an alert message - for testing.

    @Chrimle
  */
  const submitData = () => {
    
    let ehr = new EhrEntry();

    ehr.setPatientID(inputPatient);
    ehr.setMedicalPersonnel(medicalPerson);
    ehr.setHealthcareInstitution(healthcareInst);
    ehr.setDetails(inputDetails.toString());
    
    // Merge prescription name and dosage into single string
    let prescriptList = [];
    prescriptionsList.forEach(element => prescriptList.push(element.name.toString()+" "+element.dosage.toString()));
    ehr.setPrescriptions(prescriptList);

    // Create list of diagnoses
    let diagnoseList = [];
    diagnosesList.forEach(element => diagnoseList.push(element.diagnosis.toString()))
    ehr.setDiagnoses(diagnoseList);

    // Set date to current time and date
    let dateNow = new Date().toJSON();
    ehr.setDate(dateNow);


    // Mainly for testing and debugging
    alert("Date: "+ehr.date+
    "\nPatient ID: "+ehr.patientID+
    "\nStaff:"+ehr.medicalPersonnel+
    "\nInstitution:"+ehr.healthcareInstitution+
    "\nPrescriptions:"+ehr.prescriptions+
    "\nDiagnoses:"+ehr.diagnoses+
    "\nDetails:"+ehr.details);
  }

  const openPopup = () => {
    // Trigger a popup warning
    // Show the pop up window (Modal)
    setModalVisible(true);

  }




  return (
    <View style={styles.main}>
      <Header/>
      <View style={styles.content}>
        <Modal
          
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            alert("The submission was cancelled.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={{width:"100%", height:"100%", backgroundColor:'rgba(0,0,0,0.80)', justifyContent:"center", alignItems:"center",}}>
            <View style={styles.popupWindow}>
              <View style={{flexDirection:"row", justifyContent:"center", padding:10, borderBottomColor:"grey", borderBottomWidth:2}}>
                <ColouredIcon name="warning" size={40}/>
                <Text style={[styles.genericHeader,{alignSelf:"flex-end"}]}>Before Submitting</Text>
              </View>
              <View style={{padding:20, flex:5, justifyContent:"space-evenly"}}>
                <Text style={{fontSize:20,fontWeight:"bold", textAlign:"center"}}>You are about to submit a record entry for:</Text>
                <Text style={{fontSize:25, textAlign:"center"}}>Patient ID: {inputPatient}</Text>
                <Text style={{fontSize:20, fontStyle:"italic", textAlign:"center"}}>By submitting, you ensure this record is meant for the individual listed above.</Text>
              </View>
              <View style={{flex:1, padding:10, borderTopColor:"grey", borderTopWidth:2, flexDirection:"row", justifyContent:"flex-end"}}>
                <TouchableOpacity style={[styles.normalButton,styles.popupButton,styles.greyButton,{height:"100%"}]} onPress={()=>{setModalVisible(false)}}>
                  <Text style={[styles.greyText,{fontWeight:"bold"}]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.normalButton,styles.popupButton,styles.primaryButton,{height:"100%"}]} onPress={()=>{submitData()}}>
                  <Text style={[styles.contrastText,{fontWeight:"bold"}]}>Submit</Text>
                </TouchableOpacity>
                
              </View>
            </View>
          </View>
        </Modal>
        <View style={{width:250}}>
        <TouchableOpacity style={{flexDirection:'row', margin:15, width:250}}>
          <ColouredIcon name="arrow-back-circle-outline" size={40}/>
          <Text style={styles.navigation_text}>Cancel & Return</Text>
        </TouchableOpacity>
        </View>
        <View style={{marginBottom:10}}>
          <Text style={styles.genericHeader}>Add Entry</Text>
        </View>
        <View style={styles.splitContainer}> 
          <View style={{flex:'49', height:'100%', alignItems:"center",}}>
            <View style={{marginVertical:25, marginHorizontal:15, maxWidth:300}}>
              <Text style={styles.inputHeader}>Patient ID:</Text>
              <TextInput
                style={styles.largeTextInputForm}
                placeholder="XXXX XXXX XXXX"
                placeholderTextColor="Black"
                onChangeText={setInputPatient}
                value={inputPatient}
                disabled
              />
              <View style={{flexDirection:"row",backgroundColor:"cornsilk", padding:5, borderRadius:10, justifyContent:"center"}}>
                <Icon name="warning-outline" size={20} color="#FF7700"/>
                <Text style={{color:"#FF7700", fontWeight:"bold", alignSelf:"center", marginLeft:5}}>Ensure this is the intended patient.</Text>
              </View>
            </View>
            <View style={{marginVertical:25, paddingHorizontal:15, width:"100%", maxWidth:500}}>
              <Text style={styles.inputHeader}>Details:</Text>
              <TextInput
                style={styles.multilineTextInputForm}
                placeholder="Details..."
                placeholderTextColor="Black"
                multiline={true}
                onChangeText={setInputDetails}
                value={inputDetails}
              />
            </View>
          </View>
          <View style={{flex:'1', height: '90%',borderLeftWidth:2,borderColor:"lightgray"}}></View>
          <View style={{flex:'49', height:'100%', paddingTop:25, paddingHorizontal:10}}>
            <Text style={styles.genericListItemHeader}>Prescriptions:</Text>
            <ScrollView style={{borderWidth:1, borderRadius:5, maxHeight:175, maxWidth:500,}}>
              <SafeAreaView>
                <FlatList
                  data={prescriptionsList}
                  extraata={prescriptionsList}
                  keyExtractor={({item, index}) => index}
                  renderItem={({item, index}) => (
                    <View style={[styles.genericListItem,{ backgroundColor: index % 2 == 0 ? "#F1F1F1": "#FDFDFD"}]}>
                      <View >
                        <Text style={styles.genericListItemText}>{item.name}</Text>
                        <Text>{item.dosage}</Text>
                      </View>
                      
                      <RemoveButton onPress={() => {removePrescription(index)}}/>
                    </View>
                  )}
                />
              </SafeAreaView>
            </ScrollView>
            <View style={{flexDirection:'row',maxWidth:500}}>
              <View style={{flex:2}}>
                <TextInput
                  style={styles.regularTextInput}
                  placeholder="Name of prescription"
                  placeholderTextColor="black"
                  onChangeText={setInputPrescription}
                  value={inputPrescription}
                />
                <TextInput
                  style={styles.regularTextInput}
                  placeholder="Dosage"
                  placeholderTextColor="black"
                  onChangeText={setInputDosage}
                  value={inputDosage}
                />
              </View>
              <View style={{flex:1, margin:15, justifyContent:"center"}}>
                <TouchableOpacity style={styles.largeButton} onPress={() => addPrescription()}>
                  <ContrastIcon name="add-outline" size={20}/>
                  <ContrastText>Add</ContrastText>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.genericListItemHeader}>Diagnoses:</Text>
            <ScrollView style={{borderWidth:1, borderRadius:5, maxHeight:175, maxWidth:500,}}>
              <SafeAreaView>
                <FlatList
                  data={diagnosesList}
                  extraata={diagnosesList}
                  keyExtractor={({item, index}) => index}
                  renderItem={({item, index}) => (
                    <View style={[styles.genericListItem,{ backgroundColor: index % 2 == 0 ? "#F1F1F1": "#FDFDFD"}]}>
                      <View >
                        <Text style={styles.genericListItemText}>{item.diagnosis}</Text>
                      </View>
                      <RemoveButton onPress={() => {removeDiagnosis(index)}}/>
                    </View>
                  )}
                />
              </SafeAreaView>
            </ScrollView>
            <View style={{flexDirection:'row',maxWidth:500}}>
              <View style={{flex:2}}>
                <TextInput
                  style={styles.regularTextInput}
                  placeholder="Diagnosis"
                  placeholderTextColor="black"
                  onChangeText={setInputDiagnosis}
                  value={inputDiagnosis}
                />
              </View>
              <View style={{flex:1, margin:15, justifyContent:"center"}}>
                <ColouredButton onPress={() => addDiagnosis()}>
                  <ContrastIcon name="add-outline" size={20}/>
                  <ContrastText>Add</ContrastText>
                </ColouredButton>
              </View>
            </View>
            <ColouredButton onPress={() => openPopup()}>
              <ContrastIcon name="checkmark-circle-outline" size={40}/>
              <ContrastText>Complete</ContrastText>
            </ColouredButton>
          </View>
        </View>
      </View>
    </View>
  );
}


