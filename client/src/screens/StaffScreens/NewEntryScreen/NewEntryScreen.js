import React, { useState, setState } from "react";
import { Text, View, Pressable , Image, SafeAreaView, FlatList} from "react-native";
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Header from "../../../components/Header/Header";
import Icon from "react-native-vector-icons/Ionicons";
import ColouredText from "../../../components/colouredText";
import ColouredIcon from "../../../components/colouredIcon";
import ColouredButton from "../../../components/colouredButton";
import RemoveButton from "../../../components/removeButton";
import ContrastIcon from "../../../components/contrastIcon";
import ContrastText from "../../../components/contrastText";
import styles from "../../../styles";

  

  


export function NewEntryScreen() {

  // Storing the states for inputs
  const [inputPrescription, setInputPrescription] = useState("");
  const [inputDosage, setInputDosage] = useState("");

  // These would be empty, but for testing purposes... keep it for now.
  const prescriptions = [
    {
      name:'PollenStopper 2000',
      dosage:'1 pill twice a day when needed'
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
    }
  ];
  const diagnoses = [
    {
      id:'1',
      diagnosis:'Birch allergy'
    },
    {
      id:'2',
      diagnosis:'Tummy ache'
    }
  ];

  const [prescriptionsList, setPrescriptionsList] = useState(prescriptions);


  /*
    Method is given an index of a prescription to be deleted.
    It deletes the prescription at (index).
    NOTE: The <FlatList> will automatically update when this change to the state is made.
    
    @Chrimle 
  */
  const removePrescription = (index) => {
  
    setPrescriptionsList((prevState) => {
      // Debugging purposes
      //alert(prescriptionsList[index].name); 

      prevState.splice(index,1);
      
      return [...prevState];
    })
    
  }

  /*
    Method gathers TextInput values for Prescription name and dosage.
    Adds it to locally stored JSON object.
    Clears both TextInput fields.
    
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
  

  return (
    <View style={styles.main}>
      <Header/>
      <View style={styles.content}>
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
            <View style={{flexDirection:'row',}}>
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
            <Text style={[styles.genericListItemHeader,{marginTop:15}]}>Diagnoses (Very WIP, not functional!):</Text>
            <ScrollView style={{borderWidth:1, borderRadius:5, maxHeight:175, maxWidth:500,}}>
              <SafeAreaView>
                <FlatList
                  data={diagnoses}
                  keyExtractor={({item, index}) => index}
                  renderItem={({item, index}) => (
                    <View style={[styles.genericListItem,{ backgroundColor: index % 2 == 0 ? "#F1F1F1": "#FDFDFD"}]}>
                      <View>
                        <Text style={styles.genericListItemText}>{item.diagnosis}</Text>
                      </View>
                      <RemoveButton/>
                    </View>
                  )}
                />
              </SafeAreaView>
            </ScrollView>
            <View style={{flexDirection:'row', marginHorizontal:15,}}>
              <View style={{flex:2}}>
                <TextInput
                  style={styles.regularTextInput}
                  placeholder="Diagnosis"
                  placeholderTextColor="black"
                />
              </View>
              <View style={{flex:1, margin:15, justifyContent:"center"}}>
                <TouchableOpacity style={styles.largeButton}>
                  <ContrastIcon name="add-outline" size={20}/>
                  <ContrastText>Add</ContrastText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}


