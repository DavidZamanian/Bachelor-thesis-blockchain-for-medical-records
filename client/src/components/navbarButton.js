import React from "react";
import { Text, StyleSheet } from "react-native";
import theme from "../theme.style";
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";

const NavbarButton = (props) => {
  const { iconName, labelText, onPress } = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <Icon name={iconName} size={45} color={theme.PRIMARY_COLOR} />
      <Text style={{ color: theme.PRIMARY_COLOR }}>{labelText}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    width: 70,
    height: 70,
    marginLeft: 10,
    position: "relative",
    alignSelf: "flex-end",
    alignItems: "center",
  },
});

export default NavbarButton;
