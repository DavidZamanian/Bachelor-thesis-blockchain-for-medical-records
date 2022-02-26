import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { EHROverviewDVScreen } from "../screens/StaffScreens/EHROverviewDVScreen";
import { EHROverviewPVScreen } from "../screens/PatientScreens/EHROverviewScreen/EHROverviewPVScreen";
import Header from "../screens/Header/Header";

const Stack = createStackNavigator();

const StackNavigators = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Header"
        component={Header}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="EHRODV"
        component={EHROverviewDVScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="EHROPV"
        component={EHROverviewPVScreen}
      />
    </Stack.Navigator>
  );
};

export { StackNavigators };
