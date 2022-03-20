import React from "react";
import { Text, View } from "react-native";
import Footer from "../../components/Footer";
import Header from "../../components/Header/Header";
import styles from "./styles";

export function ContactScreen() {

  return (
    <View>
      <Header/>
      <View style={styles.content}>
        <View style={styles.container}>
          <Text style={styles.headingText}>Contact</Text>
          <Text style={[styles.mainText,styles.describeText]}>Some contact information goes here...</Text>
        </View>
      </View> 
      <Footer/>
    </View>
  );
};
