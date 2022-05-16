import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/LoginScreen/LoginScreen";
import { AboutScreen } from "../screens/MiscScreens/AboutScreen";
import { ContactScreen } from "../screens/MiscScreens/ContactScreen";

const AuthStack = createStackNavigator();
const LoginStack = createStackNavigator();

/**
 * The authentication and miscellaneous stack.
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
            <LoginStack.Screen
              options={{
                headerShown: false,
              }}
              name="ContactScreen"
              component={ContactScreen}
            />
          </LoginStack.Navigator>
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}
