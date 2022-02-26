import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/LoginScreen/LoginScreen";

const AuthStack = createStackNavigator();
const LoginStack = createStackNavigator();

export function AuthStackNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        options={{
          headerShown: false,
        }}
        name="LoginStack"
      >
        {() => (
          <LoginStack.Navigator>
            <LoginStack.Screen
              options={{
                headerShown: false,
              }}
              name="Login"
              component={LoginScreen}
            />
          </LoginStack.Navigator>
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}
