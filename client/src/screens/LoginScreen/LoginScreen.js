import React, { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { AuthContext } from "../../../contexts/AuthContext";
import { TextInput } from "react-native-gesture-handler";
import Header from "../../components/Header/Header";
import { apiService } from "../../../hooks/apiService";

export function LoginScreen() {
  const { login } = React.useContext(AuthContext);
  const { user } = apiService();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View>
      <View>
        <Header></Header>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          placeholderTextColor="Black"
          returnKeyType="done"
          keyboardType="email-address"
        />
        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          placeholderTextColor="Black"
          returnKeyType="done"
          secureTextEntry
        />
      </View>
      <Pressable
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
  );
}
