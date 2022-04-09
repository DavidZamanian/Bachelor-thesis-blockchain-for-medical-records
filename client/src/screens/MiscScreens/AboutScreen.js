import React from "react";
import { Text, View, Image } from "react-native";
import Footer from "../../components/Footer";
import Header from "../../components/Header/Header";
import styles from "./styles";

export function AboutScreen() {

  return (
    <View>
      <Header/>
      <View style={styles.content}>
        <View style={styles.container}>
        <Image
          source={{ uri: "https://i.imgur.com/AbCRays.png" }}
          style={{ 
            width: 50, 
            height: 50, 
            margin:10,
            alignSelf:"center"
          }}
        />
          <Text style={styles.headingText}>About this project</Text>
          <Text style={[styles.mainText,styles.describeText]}>This is a web application is solely a prototype and was created as part of a Bachelor's Thesis project.</Text>
          <Text style={styles.mainText}>
            This web application is tied to the Bachelor Thesis named "Blockchain for Secure, Distributed and Shareable Medical Records", at Gothenburg University, Sweden.
            {"\n"}{"\n"} 
            As the project is only partially about the web application, additional security measures, performance optimitizations nor user experience evaluations were ever performed.
          </Text>
          <Text style={styles.contentHeader}>About Us</Text>
          <Text style={styles.mainText}>who cares</Text>
          <Text style={styles.contentHeader}>Acknowledgements</Text>
          <Text style={[styles.mainText,styles.describeText]}>This web application, and it's behind-the-scenes functionality, was made possible thanks to the following frameworks and services...</Text>
          <Text style={[styles.mainText,{textAlign:"center"}]}>
            JavaScript{'\n'}
            npm{'\n'}
            NodeJs{'\n'}
            React Native{'\n'}
            Firebase{'\n'}
            Web3Storage{'\n'}
            GitHub{'\n'}
          </Text>
        </View>
      </View> 
      <Footer/>
    </View>
  );
};
