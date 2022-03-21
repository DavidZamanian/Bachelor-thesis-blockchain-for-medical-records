import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { EHROverviewScreen } from "../screens/Overview/EHROverviewScreen";
import { NewEntryScreen } from "../screens/StaffScreens/NewEntryScreen/NewEntryScreen";
import { PatientSearchScreen } from "../screens/StaffScreens/PatientSearchScreen/PatientSearchScreen";
import { AboutScreen } from "../screens/MiscScreens/AboutScreen";
import { ContactScreen } from "../screens/MiscScreens/ContactScreen";

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
        name="EHROverview"
        component={EHROverviewScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="NewEntryScreen"
        component={NewEntryScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="PatientSearchScreen"
        component={PatientSearchScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="AboutScreen"
        component={AboutScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ContactScreen"
        component={ContactScreen}
      />
    </Stack.Navigator>
  );
};

export { StackNavigators };
