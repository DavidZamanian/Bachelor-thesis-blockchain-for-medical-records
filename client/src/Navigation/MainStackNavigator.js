import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StackNavigators } from "./StackNavigators";

const MainStack = createStackNavigator();

export function MainStackNavigator() {
  /**
   * This might not be needed but let it stay for now
   *
   * @author David Zamanian
   */

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
