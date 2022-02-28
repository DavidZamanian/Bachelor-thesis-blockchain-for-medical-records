import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../../../contexts/AuthContext";
import { apiService } from "../../../hooks/apiService";
import styles from "./styles";
import Icon from "react-native-vector-icons/MaterialIcons";

const Header = () => {
  const { authentication, user } = apiService();
  const { logOut } = React.useContext(AuthContext);

  function logIn() {}

  return (
    <View style={styles.navbar}>
      <Image
        source={{uri: 'https://reactnative.dev/img/tiny_logo.png',}}
        style={{width: 70, height: 70}}
    />
      <View style={styles.navbar_buttons_container}>
        <TouchableOpacity style={styles.navbar_button} onPress={() => {}}>
          <Icon size={40} name="info-outline" color="white"/>
          <Text style={styles.navbar_button_text}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.navbar_button} onPress={() => {}}>
          <Icon size={40} name="email" color="white"/>
          <Text style={styles.navbar_button_text}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.navbar_button} onPress={user ? logOut : logIn}>
          <Icon size={40} name={user ? "logout" : "login"} color="white"/>
          <Text style={styles.navbar_button_text}>{user ? "Sign Out" : "Sign In"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
