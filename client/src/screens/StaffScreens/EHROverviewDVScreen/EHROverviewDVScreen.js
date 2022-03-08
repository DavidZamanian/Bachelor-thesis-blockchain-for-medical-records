import React from "react";
import { Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import styles from "./styles";

export function EHROverviewDVScreen(props) {

  const route = useRoute();

  //const patientID = route.params;
  
  alert(props.route.params)
  //alert(props.route.params.patientID);
  
  return (
    <View>
      
      <Text>Medical Record Overview (Doctors View) Screen </Text>
      
    </View>
  );
}
