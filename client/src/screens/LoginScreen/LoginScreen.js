import React, { useState } from "react";
import { Text, View, TextInput, StyleSheet} from "react-native";
import { AuthContext } from "../../../contexts/AuthContext";
import Header from "../../components/Header/Header";
import { apiService } from "../../../hooks/apiService";
import Icon from "react-native-vector-icons/Ionicons";
import Footer from "../../components/Footer";
import theme from "../../theme.style";
import ThemeButton from "../../components/themeButton"
import styles from "./styles";

export function LoginScreen() {
  const { login } = React.useContext(AuthContext);
  const { user } = apiService();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const BulletPoint = (props) => {
    const {iconName, labelText} = props;
    return(
      <View style={styles.bulletpointContainer}>
        <Icon size={50} name={iconName} color={theme.PRIMARY_COLOR}/>
        <Text style={{color:theme.PRIMARY_COLOR, fontSize:20}}>{labelText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.main}>
      <Header/>
      <View style={styles.content}>
        <View style={styles.splitContainer}>
          <View style={{flex:'49', height:'100%', justifyContent:'space-evenly',alignItems:'center'}}>
            <View style={styles.loginContainer}>
              <Text style={styles.genericHeader}>Sign In</Text>
              <View>
                <Text style={styles.inputHeader}>Email:</Text>
                <TextInput
                  style={styles.largeTextInputForm}
                  onChangeText={setEmail}
                  value={email}
                  placeholder="Email"
                  placeholderTextColor="Black"
                  returnKeyType="done"
                  keyboardType="email-address"
                />
                <Text style={styles.inputHeader}>Password:</Text>
                <TextInput
                  style={styles.largeTextInputForm}
                  onChangeText={setPassword}
                  value={password}
                  placeholder="Password"
                  placeholderTextColor="Black"
                  returnKeyType="done"
                  secureTextEntry
                />
                <ThemeButton 
                  iconSize={35}
                  iconName="key"
                  labelText="Login"
                  labelSize={25}
                  onPress={async () => {
                    try {
                      await login(email, password);
                    } catch (e) {
                      alert(e);
                    }
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{flex:'1', height: '80%',borderLeftWidth:2,borderColor:"lightgray"}}></View>
          <View style={{flex:'49', height:'100%', justifyContent:'center'}}>
            <BulletPoint 
              labelText="Access your medical records any time, any where"
              iconName="clipboard"
            />
            <BulletPoint 
              labelText="Authenticate with BankID"
              iconName="shield-checkmark"
            />
            <BulletPoint 
              labelText="Take control of your data"
              iconName="lock-closed"
            />
          </View>
        </View>
      </View>
      <Footer/>
    </View>
  );
}


