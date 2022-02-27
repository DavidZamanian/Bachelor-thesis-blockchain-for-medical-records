import React, { useState } from "react";
import { Text, View, Pressable , Image} from "react-native";
import { AuthContext } from "../../../contexts/AuthContext";
import { TextInput } from "react-native-gesture-handler";
import Header from "../../components/Header/Header";
import { apiService } from "../../../hooks/apiService";
import styles from './styles';

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
          <View style={{width:'49%', height:'100%', justifyContent:'space-evenly',alignItems:'center'}}>
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
                <Pressable
                  style={styles.largeButton}
                  onPress={async () => {
                    try {
                      await login(email, password);
                    } catch (e) {
                      alert(e);
                    }
                  }}
                >
                <Text>LOGIN</Text>
              </Pressable>
              </View>
            </View>
          </View>
          <View style={{width:1, height: '80%',borderLeftWidth:2,borderColor:"lightgray"}}></View>
          <View style={{width:'49%', height:'100%', justifyContent:'space-evenly'}}>
            <View style={{flexDirection:'row'}}>
              <Image style={{width:40, height:40}}source={{uri: 'https://reactnative.dev/img/tiny_logo.png',}}/>
              <Text>Access your medical records any time, any where</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Image style={{width:40, height:40}}source={{uri: 'https://reactnative.dev/img/tiny_logo.png',}}/>
              <Text>Authenticate with BankID</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <Image style={{width:40, height:40}}source={{uri: 'https://reactnative.dev/img/tiny_logo.png',}}/>
              <Text>Take control of your data</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
