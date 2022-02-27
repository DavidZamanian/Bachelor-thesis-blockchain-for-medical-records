import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../../../contexts/AuthContext";
import { apiService } from "../../../hooks/apiService";
import styles from "./styles";

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
          <Image style={styles.navbar_button_icon} source={{uri: 'https://reactnative.dev/img/tiny_logo.png',}}/>
          <Text style={styles.navbar_button_text}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.navbar_button} onPress={() => {}}>
          <Image style={styles.navbar_button_icon} source={{uri: 'https://reactnative.dev/img/tiny_logo.png',}}/>
          <Text style={styles.navbar_button_text}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.navbar_button} onPress={user ? logOut : logIn}>
          <Image style={styles.navbar_button_icon} source={{uri: user ? 'https://reactnative.dev/img/tiny_logo.png': 'https://reactnative.dev/img/tiny_logo.png'}}/>
          <Text style={styles.navbar_button_text}>{user ? "Sign Out" : "Sign In"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
