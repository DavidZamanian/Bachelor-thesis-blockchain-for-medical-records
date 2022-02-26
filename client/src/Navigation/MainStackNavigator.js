import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StackNavigators } from "./StackNavigators";
import { AuthContext } from "../../contexts/AuthContext";

const MainStack = createStackNavigator();

export function MainStackNavigator({ navigation }) {
  const { logOut } = React.useContext(AuthContext);

  return (
    <MainStack.Navigator>
      <MainStack.Screen
        options={{
          headerShown: false,
        }}
        name="MainScreen"
        component={StackNavigators}
      />
    </MainStack.Navigator>
  );
}
