import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Text, View, Modal } from "react-native";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header/Header";
import styles from "./styles";
import ThemeButton from "../../../components/themeButton";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import theme from "../../../theme.style";
import { database, ref, onValue} from "../../../../firebaseSetup";

export function EHROverviewPVScreen(props) {

  const route = useRoute();

  const patientID = props.route.params == null ? 8701104455 : props.route.params;

  const placeholderEmail = "example@example.com";
  const placeholderFirstname = "John";
  const placeholderLastname = "Smith";
  const placeholderAddress = "42nd Example Street, Example City";
  const placeholderPhone = "0707123456";
  const placeholderPrescriptions = ["PollenStopper, 1 pill per day when needed","NoseSpray, 1 dose in each nostril per day if needed"];
  const placeholderDiagnoses = ["Birch Allergy"];
  const placeholderPatientRegions = ["Vastra Gotaland","Skane"];
  const placeholderRegions = [
    {name:"Stockholm","enabled":false},
    {name:"Uppsala","enabled":false},
    {name:"Sormland","enabled":false},
    {name:"Ostergotland","enabled":false},
    {name:"Jonkoping","enabled":false},
    {name:"Kronoberg","enabled":false},
    {name:"Kalmar","enabled":false},
    {name:"Gotland","enabled":false},
    {name:"Blekinge","enabled":false},
    {name:"Skane","enabled":false},
    {name:"Halland","enabled":false},
    {name:"Vastra Gotaland","enabled":false},
    {name:"Varmland","enabled":false},
    {name:"Orebro","enabled":false},
    {name:"Vastmanland","enabled":false},
    {name:"Dalarna","enabled":false},
    {name:"Gavleborg","enabled":false},
    {name:"Vasternorrland","enabled":false},
    {name:"Jamtland","enabled":false},
    {name:"Vasterbotten","enabled":false},
    {name:"Norrbotten","enabled":false},
  ];

  const [patientEmail,setPatientEmail] = useState(placeholderEmail);
  const [patientAddress,setPatientAddress] = useState(placeholderAddress);
  const [patientFirstname,setPatientFirstname] = useState(placeholderFirstname);
  const [patientLastname,setPatientLastname] = useState(placeholderLastname);
  const [patientPhone,setPatientPhone] = useState(placeholderPhone);
  const [patientPrescriptions,setPatientPrescriptions] = useState(placeholderPrescriptions);
  const [patientDiagnoses,setPatientDiagnoses] = useState(placeholderDiagnoses);
  const [patientRegions,setPatientRegions] = useState(placeholderPatientRegions);
  const [regions,setRegions] = useState(placeholderRegions);


  const patientRef = ref(database, 'Users/' + patientID);
  onValue(patientRef, (snapshot) => 
    {
      if(snapshot.val() === null){
        alert("ERROR: This patient does not exist:"+patientID)
      }
      else if (snapshot.val().email != patientEmail){
        setPatientEmail(snapshot.val().email)
        setPatientAddress(snapshot.val().address)
        setPatientFirstname(snapshot.val().firstName)
        setPatientLastname(snapshot.val().lastName)
        setPatientPhone(snapshot.val().phoneNr)
        // GET DIAGNOSES
        // GET PRESCRIPTIONS
        // GET ALL AVAILABLE REGIONS
        // GET CURRENTLY PERMITTED REGIONS
        setRegions((prevState) => {
          patientRegions.forEach((reg) => prevState.find(r => r.name === reg).enabled = true)
          
          return[...prevState]
        })
      }
    }
  );

  const journals = [
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
  const [journalExpanded, setJournalExpanded] = useState([false*(journals.length)]);

  /* This is the popup window - whether it is visible or no */ 
  const [modalVisible, setModalVisible] = useState(false);

  /* 
    Method for toggle the collapsing of a journal entry.
    Takes index as parameter to identify which one to toggle.

    @Chrimle
  */
  const toggleExpandJournal = (index) => {
    setJournalExpanded((prevState) => {
      prevState.splice(index,1,!journalExpanded.at(index))
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
                  <Text style={styles.contactValue}>{patientLastname}, {patientFirstname}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Text style={styles.contactKey}>Address: </Text>
                  <Text style={styles.contactValue}>{patientAddress}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Text style={styles.contactKey}>Phone: </Text>
                  <Text style={styles.contactValue}>{patientPhone}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Text style={styles.contactKey}>Email: </Text>
                  <Text style={styles.contactValue}>{patientEmail}</Text>
                </View>
              </View>
            </View>
            <View style={styles.container}>
              <Text style={styles.header}>Data Privacy</Text>
              <Text style={styles.description}>Configure what regions can access and view your medical record. You can change this at any time.</Text>
              <ThemeButton labelText="Configure" labelSize={25} iconName="eye-outline" iconSize={30} bWidth={200} bHeight={60} onPress={() => setModalVisible(true)}/>
            </View>
          </View>
          <View style={styles.rowContainer}>
          <View style={styles.container}>
            <Text style={styles.header}>Prescriptions</Text>
            <FlatList
              data={patientPrescriptions}
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
              data={patientDiagnoses}
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
              data={journals}
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
