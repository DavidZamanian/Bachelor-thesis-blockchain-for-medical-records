import React, { useState } from "react";
import { Text, View, Pressable , Image} from "react-native";
import { AuthContext } from "../../../contexts/AuthContext";
import { TextInput } from "react-native-gesture-handler";
import Header from "../../components/Header/Header";
import { apiService } from "../../../hooks/apiService";
import styles from '../../styles';
import Icon from "react-native-vector-icons/Ionicons";
import ColouredText from "../../components/colouredText";
import ColouredIcon from "../../components/colouredIcon";
import ColouredButton from "../../components/colouredButton";
import Footer from "../../components/Footer";

export function LoginScreen() {
  const { login } = React.useContext(AuthContext);
  const { user } = apiService();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
                <ColouredButton
                  
                  onPress={async () => {
                    try {
                      await login(email, password);
                    } catch (e) {
                      alert(e);
                    }
                  }}
                >
                  <Icon style={{marginHorizontal:10,}} name="key" size={35} color="white"/>
                  <Text style={{color:"white", fontSize:25, marginHorizontal:10,}}>Login</Text>
                </ColouredButton>
              </View>
            </View>
          </View>
          <View style={{flex:'1', height: '80%',borderLeftWidth:2,borderColor:"lightgray"}}></View>
          <View style={{flex:'49', height:'100%', justifyContent:'center'}}>
          <View style={{marginLeft:25, marginVertical:25, flexDirection:'row', alignItems:'center'}}>
              <ColouredIcon size={50} name="clipboard"/>
              <ColouredText>Access your medical records any time, any where</ColouredText>
            </View>
            <View style={{marginLeft:25,marginVertical:25,flexDirection:'row', alignItems:'center'}}>
              <ColouredIcon size={50} name="shield-checkmark"/>
              <ColouredText>Authenticate with BankID</ColouredText>
            </View>
            <View style={{marginLeft:25,marginVertical:25,flexDirection:'row', alignItems:'center'}}>
              <ColouredIcon size={50} name={"lock-closed"}/>
              <ColouredText>Take control of your data</ColouredText>
            </View>
          </View>
        </View>
      </View>
      <Footer/>
    </View>
  );
}
