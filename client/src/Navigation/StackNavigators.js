import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { EHROverviewDVScreen } from "../screens/StaffScreens/EHROverviewDVScreen";
import { EHROverviewPVScreen } from "../screens/PatientScreens/EHROverviewScreen/EHROverviewPVScreen";
import Header from "../components/Header/Header";

const Stack = createStackNavigator();

/**
 * Here we will put all the screens(pages) we have
 *
 * @author David Zamanian
 */

//With development of new screen/page, place it on top off this navigator, it will
//pop up after signing in (hopefully..) Also need to place <Header><Header/> on top of
//every screen right now. Might come up with a better solution in the future.
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
        name="EHROverviewDoctorV"
        component={EHROverviewDVScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="EHROverviewPatientV"
        component={EHROverviewPVScreen}
      />
    </Stack.Navigator>
  );
};

export { StackNavigators };
