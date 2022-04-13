import React, { useState } from "react";
import { Text, View, TextInput, FlatList, Image } from "react-native";
import { AuthContext } from "../../../contexts/AuthContext";
import Header from "../../components/Header/Header";
import { apiService } from "../../../hooks/apiService";
import Icon from "react-native-vector-icons/Ionicons";
import Footer from "../../components/Footer";
import theme from "../../theme.style";
import ThemeButton from "../../components/themeButton";
import styles from "./styles";
import { getAuth } from "@firebase/auth";
import { LoginLocalisation } from "../../Localisation/Login";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";


export function LoginScreen() {
  const { login } = React.useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const userUID = auth.currentUser;
  const inter = LoginLocalisation.loc;
  const langs = ["en","sv","de","pl"];
  const [lang, setLang] = useState("en");

  const BulletPoint = (props) => {
    const { iconName, labelText, descText } = props;
    return (
      <View style={styles.bulletpointContainer}>
        <Icon size={50} name={iconName} color={theme.PRIMARY_COLOR} />
        <View>
          <Text style={{ color: theme.PRIMARY_COLOR, fontSize: 20, marginLeft:10}}>
            {labelText}
          </Text>
          <Text style={{ color: theme.PRIMARY_COLOR, fontSize: 15, marginLeft:20}}>
            {descText}
          </Text>
        </View>
        
      </View>
    );
  };

  const changeLanguage = (newLang) => {
    setLang(newLang)
  };


  return (
    <View style={styles.main}>
      
      <View style={styles.content}>
        <View style={styles.splitContainer}>
          <View
            style={{
              flex: "49",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.loginContainer}>
              <Text style={styles.genericHeader}>{inter["sign-in"][lang]}</Text>
              <View>
                <Text style={styles.inputHeader}>{inter["email"][lang]}:</Text>
                <TextInput
                  style={styles.largeTextInputForm}
                  onChangeText={setEmail}
                  value={email}
                  placeholder={inter["email"][lang]}
                  placeholderTextColor="Black"
                  returnKeyType="done"
                  keyboardType="email-address"
                />
                <Text style={styles.inputHeader}>{inter["password"][lang]}:</Text>
                <TextInput
                  style={styles.largeTextInputForm}
                  onChangeText={setPassword}
                  value={password}
                  placeholder={inter["password"][lang]}
                  placeholderTextColor="Black"
                  returnKeyType="done"
                  secureTextEntry
                />
                <ThemeButton
                  iconSize={35}
                  iconName="key"
                  labelText={inter["sign-in"][lang]}
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
            <View style={styles.langContainer}>
              <ScrollView>
                <FlatList
                horizontal={true}
                data={langs}
                keyExtractor={({ item, index }) => index}
                renderItem={({ item, index }) => (
                  <TouchableOpacity style={[styles.langItem,item == lang ?{}:{backgroundColor:"white"}]} onPress={() => {changeLanguage(item)}}>
                    <Image source={require("../../../assets/flags/"+item+".png")}
                    style={{ 
                      width: 40, 
                      height: 30, 
                      marginTop:10,
                      alignSelf:"center"
                    }}/>
                    <Text style={styles.langText}>{inter["langs"][item]}</Text>
                  </TouchableOpacity>
                )}/>
              </ScrollView>
            </View>
          </View>
          <View
            style={{
              flex: "1",
              height: "80%",
              borderLeftWidth: 2,
              borderColor: "lightgray",
            }}
          ></View>
          <View
            style={{ flex: "49", height: "100%", justifyContent: "center" }}
          >
            <BulletPoint
              labelText={inter["label-access"][lang]}
              descText={inter["desc-access"][lang]}
              iconName="clipboard"
            />
            <BulletPoint
              labelText={inter["label-auth"][lang]}
              descText={inter["desc-auth"][lang]}
              iconName="shield-checkmark"
            />
            <BulletPoint
              labelText={inter["label-control"][lang]}
              descText={inter["desc-control"][lang]}
              iconName="lock-closed"
            />
          </View>
        </View>
      </View>
      <Header />
      <Footer />
    </View>
  );
}
