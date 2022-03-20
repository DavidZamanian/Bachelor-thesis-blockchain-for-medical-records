import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/LoginScreen/LoginScreen";
import { AboutScreen } from "../screens/MiscScreens/AboutScreen";

const AuthStack = createStackNavigator();
const LoginStack = createStackNavigator();

/**
 * The authentication stack. Need to think about how we split up patient and doctors,
 * might need one more AuthStack to separate.
 *
 * @author David Zamanian
 */

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
            <LoginStack.Screen
              options={{
                headerShown: false,
              }}
              name="AboutScreen"
              component={AboutScreen}
            />
          </LoginStack.Navigator>
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}
