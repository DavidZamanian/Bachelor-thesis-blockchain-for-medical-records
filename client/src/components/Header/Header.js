import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../../../contexts/AuthContext";
import { apiService } from "../../../hooks/apiService";
import styles from "../../styles";
import ColouredIcon from "../colouredIcon";
import ContrastText from "../contrastText";
import { useNavigation } from "@react-navigation/native";
import NavbarButton from "../navbarButton";

const Header = () => {
  const { authentication, user } = apiService();
  const { logOut } = React.useContext(AuthContext);

  const navigation = useNavigation();
  const onPressContact = () => {
    //navigation.navigate("NewEntryScreen");
  };
  const onPressAbout = () => {
    navigation.navigate("AboutScreen");
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
        <NavbarButton labelText="About" iconName="information-circle-outline" onPress={onPressAbout}/>
        <NavbarButton labelText="Contact" iconName="mail-outline" onPress={onPressContact}/>
        {
          user ?
          <NavbarButton labelText="Sign Out" iconName="log-out-outline" onPress={logOut}/>
          :
          <NavbarButton labelText="Sign In" iconName="log-in-outline" onPress={logIn}/>
        }
      </View>
    </View>
  );
};

export default Header;
