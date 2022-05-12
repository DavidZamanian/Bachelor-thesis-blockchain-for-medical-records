import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { EHROverviewScreen } from "../screens/Overview/EHROverviewScreen";
import { NewEntryScreen } from "../screens/StaffScreens/NewEntryScreen/NewEntryScreen";
import { PatientSearchScreen } from "../screens/StaffScreens/PatientSearchScreen/PatientSearchScreen";
import { AboutScreen } from "../screens/MiscScreens/AboutScreen";
import { ContactScreen } from "../screens/MiscScreens/ContactScreen";
import { UserDataContext } from "../../contexts/UserDataContext";

const Stack = createStackNavigator();

/**
 * Here we will put all the screens(pages) we have
 *
 * @author David Zamanian
 */

const StackNavigators = () => {
  const { role } = React.useContext(UserDataContext);

  return (
    <Stack.Navigator
      initialRouteName={
        role == "doctor" ? "PatientSearchScreen" : "EHROverview"
      }
    >
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
        name="NewEntryScreen"
        component={NewEntryScreen}
      />
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
