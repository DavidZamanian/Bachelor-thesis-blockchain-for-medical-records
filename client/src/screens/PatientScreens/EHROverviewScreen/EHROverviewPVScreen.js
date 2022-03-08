import React, { useState } from "react";
import { Text, View } from "react-native";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header/Header";
import styles from "../styles";
import ThemeButton from "../../../components/themeButton";
import { FlatList } from "react-native-gesture-handler";

export function EHROverviewPVScreen() {

  const patientID = 1234567890;
  const patientEmail = "example@example.com";
  const patientAddress = "42nd Example Street, Example City";
  const patientFirstname = "John";
  const patientLastname = "Smith";
  const patientPhone = "0707123456";
  const patientPrescriptions = ["PollenStopper, 1 pill per day when needed","NoseSpray, 1 dose in each nostril per day if needed"];
  const patientDiagnoses = ["Birch Allergy"];

  const [prescriptionsList, setPrescriptionsList] = useState(patientPrescriptions);
  const [diagnosesList, setDiagnosesList] = useState(patientDiagnoses);

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
              <Text style={styles.header}>Add EHR entry</Text>
              <Text style={styles.description}>Create a new EHR entry for the current patient, including diagnoses and prescriptions.</Text>
              <ThemeButton labelText="Add" labelSize={25} iconName="add-outline" iconSize={30} bWidth={120} bHeight={60}/>
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
              <Text style={styles.header}>Long list of journal entries here...</Text>
            </View>
          </View>
        </View>
      <Footer />
    </View>
  );
}
