import React from "react";
import styles from "../styles";
import { Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default class RemoveButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={[styles.normalButton, { backgroundColor: "#DA1414" }]}
        onPress={() => {
          this.props.onPress(this.props.btnName);
        }}
      >
        <Icon name="trash" size={20} color="white" />
        <Text style={{ color: "white" }}>Remove</Text>
      </TouchableOpacity>
    );
  }
}
