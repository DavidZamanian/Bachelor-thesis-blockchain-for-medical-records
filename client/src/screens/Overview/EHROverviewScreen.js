import React, { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Text, View, Modal } from "react-native";
import Footer from "../../components/Footer";
import Header from "../../components/Header/Header";
import styles from "./styles";
import ThemeButton from "../../components/themeButton";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import theme from "../../theme.style";
import { database, ref, onValue} from "../../../firebaseSetup";

export function EHROverviewScreen(props) {

  const route = useRoute();
  const navigation = useNavigation();

  /* TODO: Replace this in some way, need to cross-reference with Firebase with User UID */
  const patientID = props.route.params == null ? 8701104455 : props.route.params;


  // FOR TESTING, CHANGE THIS TO "doctor" or "patient", to access the 2 views
  const placeholderRole = "doctor";

  const [doctorRole,setDoctorRole] = useState(false);

  const placeholderPrescriptions = ["PollenStopper, 1 pill per day when needed","NoseSpray, 1 dose in each nostril per day if needed"];
  const placeholderDiagnoses = ["Birch Allergy"];
  const placeholderPatientRegions = ["Vastra Gotaland","Skane"];
  const placeholderRegions=["Stockholm","Uppsala","Sormland","Ostergotland","Jonkoping","Kronoberg","Kalmar","Gotland","Blekinge","Skane","Halland","Varmland","Orebro","Vastmanland","Dalarna","Gavleborg","Vasternorrland","Jamtland","Vasterbotten","Norrbotten","Vastra Gotaland"];
  const placeholderPatient={
    patientId:null,
    email:"ErrorEmail",
    firstName:"ErrorFirstName",
    lastName:"ErrorLastName",
    address:"ErrorAddress",
    phoneNr:"ErrorPhoneNr",
    prescriptions:[],
    diagnoses:[],
    permittedRegions:[],
    journals:[],
  };

  const [regions,setRegions] = useState([]);

  const [patientInfo,setPatientInfo] = useState(
    placeholderPatient
  );

    

    const wipePatientData = () => {
      setPatientInfo(placeholderPatient);
    }

  /* 
    Gather patient info from Firebase (runs automatically at the start) 
  */
    const fetchPatientData = () => {
      alert("attempting fetch "+patientID)
      if (patientID == patientInfo.patientId){
        return;
      }
      const patientRef = ref(database, 'Users/' + patientID);
      onValue(patientRef, (snapshot) => 
        {
          if(snapshot.val() === null){
            alert("ERROR: This patient does not exist:"+patientID)
          }
          else{
            
            // REPLACE ALL OF THESE WITH METHOD CALLS TO BACKEND!
            const userRole                = placeholderRole; //snapshot.val().role 
            const allRegions              = placeholderRegions;
            const patientJournals         = placeholderJournals;
            const patientPermittedRegions = placeholderPatientRegions;
            const patientPrescriptions    = placeholderPrescriptions;
            const patientDiagnoses        = placeholderDiagnoses;
            
            setDoctorRole(userRole == "doctor")

            alert("accessing patient:"+patientID)
            setJournalExpanded((prevState) => {
              prevState = [];
              patientJournals.forEach(() => prevState.push(false))
              return[...prevState]
            })
            // getPatientContactInfo
            setPatientInfo(() => ({
              patientId:patientID,
              firstName:snapshot.val().firstName,
              lastName:snapshot.val().lastName,
              email:snapshot.val().email,
              address:snapshot.val().address,
              phoneNr:snapshot.val().phoneNr,
              // getPrescriptions
              // getDiagnoses
              // getPermittedRegions
              prescriptions:patientPrescriptions,
              diagnoses:patientDiagnoses,
              permittedRegions:patientPermittedRegions,
              journals:patientJournals
            }))
            setRegions((prevState) => {
              prevState = [];
              allRegions.forEach((reg) => prevState.push({name:reg,enabled:false}))
              patientPermittedRegions.forEach((reg) => prevState.find(r => r.name === reg).enabled = true)
              return[...prevState]
            })
          }
        }
      );
    }

  const placeholderJournals = [
    {
      date: "2022-03-04T08:44:44.118Z",
      patientID: "fdjsajkfvhkcjasjcas",
      healthcareInstitution: "Ostra sjukhuset",
      medicalPersonnel: "Lolly Pop",
      details: "thick throat",
      diagnoses: ["allergy against birch"],
      prescriptions: [
        "pollenStopperPill, 2 mg 3 times / day, 4 hrs in between",
        "pollenStopperSpray 2 pills 2 times / day"
      ]
    },
    {
      date: "2022-03-04T08:44:44.118Z",
      patientID: "fdjsajkfvhkcjasjcas",
      healthcareInstitution: "Ostra sjukhuset",
      medicalPersonnel: "Lolly Pop",
      details: "thick throat",
      diagnoses: ["allergy against birch"],
      prescriptions: [
        "pollenStopperPill, 2 mg 3 times / day, 4 hrs in between",
        "pollenStopperSpray 2 pills 2 times / day"
      ]
    },
    {
      date: "2022-03-04T08:44:44.118Z",
      patientID: "fdjsajkfvhkcjasjcas",
      healthcareInstitution: "Ostra sjukhuset",
      medicalPersonnel: "Lolly Pop",
      details: "thick throat",
      diagnoses: ["allergy against birch"],
      prescriptions: [
        "pollenStopperPill, 2 mg 3 times / day, 4 hrs in between",
        "pollenStopperSpray 2 pills 2 times / day"
      ]
    },
  ]

  
  

  // This causes a bug where the first journal expand will show a "0" from the start
  // Workaround: added ">0" to journalExpanded[index] of the show-condition - no issues!
  const [journalExpanded, setJournalExpanded] = useState([]);

  

  /* This is the popup window - whether it is visible or no */ 
  const [modalVisible, setModalVisible] = useState(false);

  /* 
    Method for toggle the collapsing of a journal entry.
    Takes index as parameter to identify which one to toggle.

    @Chrimle
  */
  const toggleExpandJournal = (index) => {
    setJournalExpanded((prevState) => {
      prevState.splice(index,1,!prevState.at(index))
      return[...prevState]
    })
  }

  /* 
    Submit new permitted regions

    @Chrimle
  */
  const submitData = () => {
    alert("Submitting settings...");
    const regStrings = regions.map(function(item) {
      return item['name']+" "+item['enabled']+"\n";
    });
    alert(regStrings.toString())
    setModalVisible(false);
  }

  /* 
    Toggle the (index):th checkbox on or off

    @Chrimle
  */
  const toggleCheckbox = (index) => {
    setRegions((prevState) => {
      prevState[index].enabled = !prevState[index].enabled; 
      return[...prevState]
    })
  } 


  /*
    Method for redirecting to NewEntryScreen to make a new EHR entry
    Possibly check privilege before proceeding?

    @Chrimle
  */
    const requestAddEHR = () => {
      // CHECK PRIVILEGE?
      alert(patientInfo.patientId)
      // Get rid of patient data
      wipePatientData();
      navigation.navigate("NewEntryScreen",patientID);

    }


  // FETCH PATIENT DATA
  fetchPatientData();
  return (
    <View>
      <Header />
        <View style={styles.content}>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          horizontal={false}
          numColumns={3}
          onRequestClose={() => {
            alert("The submission was cancelled.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={{width:"100%", height:"100%", backgroundColor:'rgba(0,0,0,0.80)', justifyContent:"center", alignItems:"center",}}>
            <View style={styles.popupWindow}>
              <View style={{flex:1,flexDirection:"row", justifyContent:"center", padding:10, borderBottomColor:"grey", borderBottomWidth:2}}>
                <Text style={styles.contentHeader}>Configure Data Privacy</Text>
              </View>
              <View style={{flex:7}}>
                <Text style={[styles.description,{padding:10}]}>Select which regions you allow to read your medical record, by checking the corresponding box. Regions you currently have given permission to are pre-filled.</Text>
                <FlatList
                style={styles.regionList}
                data={regions}
                numColumns={3}
                keyExtractor={({item, index}) => index}
                renderItem={({item, index}) => 
                  <View style={styles.regionContainer}>
                    <TouchableOpacity style={[styles.checkbox,{backgroundColor:item.enabled ? theme.PRIMARY_COLOR:"white"}]} onPress={() => toggleCheckbox(index)}>
                      {item.enabled && <Icon name="checkmark-outline" size={20} color="white"/>}
                    </TouchableOpacity>
                    <Text style={styles.regionLabel}>{item.name}</Text>
                  </View>
                }/>
              </View>
              <View style={{flex:1,flexDirection:"row",borderTopColor:"grey",borderTopWidth:1,alignItems:"center",justifyContent:"space-evenly"}}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.popupButton,styles.greyButton]}><Text>Discard changes</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => submitData()} style={[styles.popupButton,styles.primaryButton]}><Text style={{color:"white"}}>Submit changes</Text></TouchableOpacity>
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
                  <Text style={styles.contactValue}>{patientInfo.lastName}, {patientInfo.firstName}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Text style={styles.contactKey}>Address: </Text>
                  <Text style={styles.contactValue}>{patientInfo.address}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Text style={styles.contactKey}>Phone: </Text>
                  <Text style={styles.contactValue}>{patientInfo.phoneNr}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Text style={styles.contactKey}>Email: </Text>
                  <Text style={styles.contactValue}>{patientInfo.email}</Text>
                </View>
              </View>
            </View>
            { doctorRole ?
              // Doctor Version
              <View style={styles.container}>
                <Text style={styles.header}>Add EHR entry</Text>
                <Text style={styles.description}>Create a new EHR entry for the current patient, including diagnoses and prescriptions.</Text>
                <ThemeButton labelText="Add" labelSize={25} iconName="add-outline" iconSize={30} bWidth={120} bHeight={60} onPress={() => requestAddEHR()}/>
              </View>
            : // Patient Version
              <View style={styles.container}>
                <Text style={styles.header}>Data Privacy</Text>
                <Text style={styles.description}>Configure what regions can access and view your medical record. You can change this at any time.</Text>
                <ThemeButton labelText="Configure" labelSize={25} iconName="eye-outline" iconSize={30} bWidth={200} bHeight={60} onPress={() => setModalVisible(true)}/>
              </View>
            }
          </View>
          <View style={styles.rowContainer}>
          <View style={styles.container}>
            <Text style={styles.header}>Prescriptions</Text>
            <FlatList
              data={patientInfo.prescriptions}
              keyExtractor={({item, index}) => index}
              renderItem={({item, index}) => (
                <View>
                  <Text style={styles.bulletpointList}>{'\u2022'} {item}</Text>
                </View>
              )}
            />
          </View>
          <View style={styles.container}>
            <Text style={styles.header}>Diagnoses</Text>
            <FlatList
              data={patientInfo.diagnoses}
              keyExtractor={({item, index}) => index}
              renderItem={({item, index}) => (
                <View>
                  <Text style={styles.bulletpointList}>{'\u2022'} {item}</Text>
                </View>
              )}
            />
          </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={[styles.container,styles.doubleContainer]}>
              <Text style={styles.header}>Past record entries</Text>
              <FlatList
              style={{width:"100%"}}
              data={patientInfo.journals}
              keyExtractor={({item, index}) => index}
              ListHeaderComponent={
                <View style={styles.journalListItem}>
                  <Text style={[styles.journalItemText,styles.journalListHeader]}>Date</Text>
                  <Text style={[styles.journalItemText,styles.journalListHeader,{flex:4}]}>Location</Text>
                  <Text style={[styles.journalItemText,styles.journalListHeader]}>Details</Text>
                  <Text style={[styles.journalItemText,styles.journalListHeader,{flex:4}]}>Issued by</Text>
                  <Text style={[styles.journalItemText,styles.journalListHeader,{flex:1}]}></Text>
                </View>
              }
              renderItem={({item, index}) => 

                <View style={styles.journalContainer}>
                  <TouchableOpacity style={[styles.journalListItem,{ backgroundColor: journalExpanded[index] ? theme.SECONDARY_COLOR :"#F3F3F3"}]} onPress={() => toggleExpandJournal(index)}>
                    <Text style={styles.journalItemText}>{item.date.toString().slice(0,10)}</Text>
                    <Text style={[styles.journalItemText,{flex:4}]}>{item.healthcareInstitution}</Text>
                    <ThemeButton  labelText="See details" labelSize={15} iconSize={15} extraStyle={[styles.detailButton,styles.journalItemText]}/>
                    <Text style={[styles.journalItemText,{flex:4}]}>{item.medicalPersonnel}</Text>
                    <Icon name={journalExpanded[index] ? "chevron-up-outline" : "chevron-down-outline"} color={theme.PRIMARY_COLOR} style={[styles.journalItemText,{flex:1, fontSize:40}]}/>
                  </TouchableOpacity>
                  {journalExpanded[index]>0 && 
                    <View style={styles.journalExpandedContainer}>
                      <View style={styles.journalExpandedRow}>
                        <View style={styles.journalDataBlock}>
                          <Text style={styles.journalDetailsHeader}>Details</Text>
                          <Text style={styles.journalDetails}>{item.details}</Text>
                        </View>
                      </View>
                      <View style={styles.journalExpandedRow}>
                        <View style={styles.journalDataBlock}>
                          <Text style={styles.journalDetailsHeader}>Prescriptions</Text>
                          {item.prescriptions.map(txt => {return (<Text>{txt}</Text>)})}
                        </View>
                        <View style={styles.journalDataBlock}>
                          <Text style={styles.journalDetailsHeader}>Diagnoses</Text>
                          {item.diagnoses.map(txt => {return (<Text>{txt}</Text>)})}
                        </View>
                        <View style={styles.journalDataBlock}>
                          <Text style={styles.journalDetailsHeader}>Written by</Text>
                          <Text style={styles.journalAuthor}>{item.medicalPersonnel}</Text>
                        </View>
                      </View>
                    </View>
                  }
                </View>
              }
              />
            </View>
          </View>
        </View>
      <Footer />
    </View>
  );
}
