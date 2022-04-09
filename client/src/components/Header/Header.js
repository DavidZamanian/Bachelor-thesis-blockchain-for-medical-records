import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../../../contexts/AuthContext";
import { apiService } from "../../../hooks/apiService";
import { useNavigation } from "@react-navigation/native";
import NavbarButton from "../navbarButton";
import theme from "../../theme.style";
import { RoleContext } from "../../../contexts/RoleContext";


const Header = () => {
  const { authentication, user } = apiService();
  const { logOut } = React.useContext(AuthContext);

  const { role } = React.useContext(RoleContext);

  const navigation = useNavigation();
  const onPressContact = () => {
    navigation.navigate("ContactScreen");
  };
  const onPressAbout = () => {
    navigation.navigate("AboutScreen");
  };

  function logIn() {
    
    if (role == "doctor"){
      navigation.navigate("PatientSearchScreen");
    }
    else if (role == "patient"){
      navigation.navigate("EHROverview");
    }
    else {
      navigation.navigate("Login"); 
    }
    // Danger, this is not the screen to show for doctors!
    
  }

  return (
    <View style={styles.navbarContainer}>
      <TouchableOpacity style={styles.navbarHomeContainer} onPress={logIn}>
        <Image
          source={{ uri: "https://i.imgur.com/0rr056z.png" }}
          style={styles.navbarLogo}
        />
        <Text style={styles.navbarLogoName}>Bachelor Project</Text>
      </TouchableOpacity>
      <View style={styles.navbarButtonContainer}>
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

const styles = StyleSheet.create({
  navbarContainer:{
    position:"fixed",
    top:0,
    left:0,
    width: '100%',
    height: theme.NAVBAR_HEIGHT,
    backgroundColor: theme.SECONDARY_COLOR,
    color: "white",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navbarHomeContainer:{
    backgroundColor: theme.PRIMARY_COLOR,
    minWidth:325,
    width:"50%",
    height:"100%",
    borderBottomRightRadius:500,
    flexDirection:"row",
    alignItems:"center",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  navbarLogo:{ 
    width: 70, 
    height: 70, 
    margin:10
  },
  navbarLogoName:{
    color:theme.SECONDARY_COLOR, 
    fontSize:20
  },
  navbarButtonContainer:{
    flexDirection: 'row',
    margin:10,
  },
})

export default Header;
