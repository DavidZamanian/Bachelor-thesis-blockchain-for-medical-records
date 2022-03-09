import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header/Header";
import styles from "./styles";
import ThemeButton from "../../../components/themeButton";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import theme from "../../../theme.style";

export function EHROverviewPVScreen(props) {

  const route = useRoute();
  


  const patientID = props.route.params == null ? 1234567890 : props.route.params;
  const patientEmail = "example@example.com";
  const patientAddress = "42nd Example Street, Example City";
  const patientFirstname = "John";
  const patientLastname = "Smith";
  const patientPhone = "0707123456";
  const patientPrescriptions = ["PollenStopper, 1 pill per day when needed","NoseSpray, 1 dose in each nostril per day if needed"];
  const patientDiagnoses = ["Birch Allergy"];

  const [prescriptionsList, setPrescriptionsList] = useState(patientPrescriptions);
  const [diagnosesList, setDiagnosesList] = useState(patientDiagnoses);

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
    Method for configuring data privacy settings.
    Should trigger popup with Region options.
    Needs to gather list of all available regions
    Needs to fetch currently permitted regions and tick "True" for those.
    The responsible popup will feature a submit button and call another method for data submission.

    @Chrimle
  */
  const configurePrivacy = () => {
    alert("attempting to configure privacy setting for:"+patientID)
  } 

  return (
    <View>
      <Header />
        <View style={styles.content}>
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
              <ThemeButton labelText="Configure" labelSize={25} iconName="eye-outline" iconSize={30} bWidth={200} bHeight={60} onPress={() => configurePrivacy()}/>
            </View>
          </View>
          <View style={styles.rowContainer}>
          <View style={styles.container}>
            <Text style={styles.header}>Prescriptions</Text>
            <FlatList
              data={prescriptionsList}
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
              data={diagnosesList}
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
