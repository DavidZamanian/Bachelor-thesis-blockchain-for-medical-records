import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../../../contexts/AuthContext";
import { apiService } from "../../../hooks/apiService";
import styles from "../../styles";
import ColouredIcon from "../colouredIcon";
import ContrastText from "../contrastText";
import { useNavigation } from "@react-navigation/native";

const Header = () => {
  const { authentication, user } = apiService();
  const { logOut } = React.useContext(AuthContext);

  const navigation = useNavigation();
  const onPressContact = () => {
    //navigation.navigate("NewEntryScreen");
  };
  const onPressAbout = () => {
    //navigation.navigate("PatientSearchScreen");
  };

  function logIn() {}

  return (
    <View style={styles.navbar}>
      <View style={styles.navbar_logo_container}>
        <Image
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
          style={{ width: 70, height: 70 }}
        />
        <ContrastText>Bachelor Project</ContrastText>
      </View>

      <View style={styles.navbar_buttons_container}>
        <TouchableOpacity style={styles.navbar_button} onPress={onPressAbout}>
          <ColouredIcon
            size={45}
            name="information-circle-outline"
            color="white"
          />
          <Text style={styles.navbar_button_text}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navbar_button} onPress={onPressContact}>
          <ColouredIcon size={45} name="mail-outline" color="white" />
          <Text style={styles.navbar_button_text}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navbar_button}
          onPress={user ? logOut : logIn}
        >
          <ColouredIcon
            size={45}
            name={user ? "log-out-outline" : "log-in-outline"}
          />
          <Text style={styles.navbar_button_text}>
            {user ? "Sign Out" : "Sign In"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
