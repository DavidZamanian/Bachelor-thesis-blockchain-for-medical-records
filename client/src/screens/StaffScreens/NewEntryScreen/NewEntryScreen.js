import React, { useState, setState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Text, View, TextInput, SafeAreaView, FlatList, Modal, ActivityIndicator} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Header from "../../../components/Header/Header";
import Icon from "react-native-vector-icons/Ionicons";
import ColouredIcon from "../../../components/colouredIcon";
import RemoveButton from "../../../components/removeButton";
import styles from "../../../styles";
import Footer from "../../../components/Footer";
import ThemeButton from "../../../components/themeButton";
import EHRService from "../../../Helpers/ehrService";
import { UserDataContext } from "../../../../contexts/UserDataContext";


export function NewEntryScreen(props) {

  const route = useRoute();
  const navigation = useNavigation();

  const { role, userSSN, institution } = React.useContext(UserDataContext);

  if (role != "doctor"){
    alert("WARNING: NOT A DOCTOR");
    return;
  }

  // These are for testing purposes only
  const prescriptions = [];
  const diagnoses = [];

  // Storing the states of inputs
  const [inputPrescription, setInputPrescription] = useState("");
  const [inputDosage, setInputDosage] = useState("");
  const [inputDiagnosis, setInputDiagnosis] = useState("");
  const [inputDetails, setInputDetails] = useState("");
  /* For patient ID to be prefilled, enter it here below */
  const [inputPatient, setInputPatient] = useState(props.route.params);
  const medicalPerson = "Placeholder Staff";
  const healthcareInst = "Placeholder Hospital";

  /* This is the popup window - whether it is visible or no */ 
  const [modalVisible, setModalVisible] = useState(false);

  /* These can have useState(prescriptions) for testing purposes*/
  const [prescriptionsList, setPrescriptionsList] = useState(prescriptions);
  const [diagnosesList, setDiagnosesList] = useState(diagnoses);

  const [submitStatus, setSubmitStatus] = useState({
    message: "Placeholder",
    style: {},
    status: "hide",
    visible: false
  });

  /**
   * Deletes the prescription at the given index
   * @param {Number} index
   * @author @Chrimle
   */
  const removePrescription = (index) => {
  
    setPrescriptionsList((prevState) => { 
      prevState.splice(index,1);
      return [...prevState];
    })
    
  }

  /**
   * Creates a list element based on text from prescription name and dosage
   * @author @Chrimle
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
 
  /**
   * Method for removing a diagnosis at a given index.
   * @param  {Number} index - Index of diagnosis to be removed
   * @author @Chrimle
   */
  const removeDiagnosis = (index) => {

    setDiagnosesList((prevState) => {
      prevState.splice(index,1);
      return [...prevState];
    })
  }

  /**
  * Method for adding diagnosis to the list of diagnoses
  * @author @Chrimle
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

  /**
   * Constructs and submits an EHR file to Web3Storage
   * @author @Chrimle
   */
  const submitData = async () => {
    
    //For testing fetching a Web3Storage EHR file

    //let cid = "bafybeifxi2lwmni6gnqanpposc74jugdxe6g6wfpl5saxfsq3t552mrl34"
    //let fileName = "ehr"
    
    //let x = ( await EHRService.getPatientData())
    //let x = ( await FileService.fetchFileContent(cid,fileName))
    
    

    updateSubmitStatus("Loading")
    
    let status = await submitEHR()
    updateSubmitStatus(status)
    if (status == "Success"){
      setTimeout(()=>{
        navigation.navigate("PatientSearchScreen");
        setModalVisible(false);
       },3000)
     }   
  }

  /**
   * Sends input data to be made into files and uploaded
   * @returns {Promise<String>} cid -- Successful if not 'null'
   * @author @Chrimle
   */
  const submitEHR = async () => {

    // Merge prescription name and dosage into single string
    let prescriptList = [];
    prescriptionsList.forEach(element => prescriptList.push(element.name.toString()+" "+element.dosage.toString()));
    
    // Create list of diagnoses
    let diagnoseList = [];
    diagnosesList.forEach(element => diagnoseList.push(element.diagnosis.toString()))

    let medicalPersonnel = await EHRService.getDoctorFullName(userSSN);

    let healthcareInstitution = await EHRService.getInstitutionName(institution);



    console.log(medicalPersonnel+institution+healthcareInstitution)
    try{
      let status =  await EHRService.packageAndUploadEHR(
      props.route.params.toString(),
      medicalPersonnel,
      healthcareInstitution,
      inputDetails,
      prescriptList,
      diagnoseList
      )

      return status;
    }
    catch(e){
      updateSubmitStatus("Error")
      return false;
    }
    
  }



  const openPopup = () => {

    setModalVisible(true);
  }

  const cancelAndReturn = () => {
    navigation.navigate("EHROverview",inputPatient);
  }

  /**
   * Sets the submit message, style and text according to a given status.
   * @param {String} newStatus - if nothing is given, it will be hidden.
   * @author @Chrimle
   */
  const updateSubmitStatus = (newStatus) => {
    let newStyle;
    let newMessage;
    let newVisible = true;
    
    switch(newStatus){
      case "Loading":
        newStyle = styles.submitLoading;
        newMessage = "Submitting data, please wait...";
        break;
      case "Success":
        newStyle = styles.submitSuccess;
        newMessage = "Success, the data has successfully been submitted!"+
        "\nRedirecting in 3 seconds...";
        break;
      case "Error":
        newStyle = styles.submitError;
        newMessage = "Error, something went wrong";
        break;
      case "NoResponse":
        newStyle = styles.submitError;
        newMessage = "Error, no response from database";
        break;
      case "TimedOut":
        newStyle = styles.submitError;
        newMessage = "Error: Operation timed out";
        break;
      default:
        newStyle = {};
        newMessage = "";
        newVisible != newVisible
        break;
    }

    setSubmitStatus({
      style: newStyle,
      status: newStatus,
      message: newMessage,
      visible: newVisible
    })
  }

  return (
    <View style={styles.main}>
      
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
                {
                submitStatus.visible && 
                <View style={[styles.submitMessage,submitStatus.style]}>
                  <Text>{submitStatus.message}</Text>
                  {submitStatus.status=="Loading" && <ActivityIndicator size="small" color="grey"/>} 
                </View>
                }
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
        <TouchableOpacity style={{flexDirection:'row', margin:15, width:250}} onPress={() => cancelAndReturn()}>
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
              <ThemeButton 
                onPress={() => addPrescription()}
                labelSize={18}
                labelText={"Add"}
                iconSize={30}
                iconName={"add-outline"}
                bWidth={100}
                extraStyle={{margin:5, justifyContent:"center", borderWidth:2}}
              />
            </View>
            <Text style={styles.genericListItemHeader}>Diagnoses:</Text>
            <ScrollView style={{borderWidth:1, borderRadius:5, maxHeight:175, maxWidth:500,}}>
              <SafeAreaView>
                <FlatList
                  data={diagnosesList}
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
                <ThemeButton 
                  onPress={() => addDiagnosis()}
                  labelSize={18}
                  labelText={"Add"}
                  iconSize={30}
                  iconName={"add-outline"}
                  bWidth={100}
                  extraStyle={{margin:5, justifyContent:"center", borderWidth:2}}
                /> 
            </View>
            <ThemeButton 
              onPress={() => openPopup()}
              labelSize={30}
              labelText={"Complete"}
              iconSize={40}
              iconName={"checkmark-circle-outline"}
              extraStyle={{marginTop:20}}
            />
          </View>
        </View>
      </View>
      <Header/>
      <Footer/>
    </View>
  );
}


