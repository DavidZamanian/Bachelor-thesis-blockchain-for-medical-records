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
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => {}}>
          <Text>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Text>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={user ? logOut : logIn}>
          <Text>{user ? "Sign Out" : "Sign In"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
