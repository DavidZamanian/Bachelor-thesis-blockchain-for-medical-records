import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, SafeAreaView, useWindowDimensions } from "react-native";
import { apiService } from "./hooks/apiService";
import { AuthContext } from "./contexts/AuthContext";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthStackNavigator } from "./src/Navigation/AuthStackNavigator";
import { MainStackNavigator } from "./src/Navigation/MainStackNavigator";
import { TouchableOpacity } from "react-native-gesture-handler";

const RootStack = createStackNavigator(); //Contains all of our application

function App() {
  const [data, setData] = React.useState(null);
  const { authentication, user } = apiService();

  //Need to restart the server for the message to update
  React.useEffect(() => {
    fetch("http://localhost:4000/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);
  /**
   * AuthContext makes the authenticaion methods reachable throughout the entire application
   *
   * @author David Zamanian
   */

  return (
    <AuthContext.Provider value={authentication}>
      <NavigationContainer>
        <RootStack.Navigator>
          {user ? (
            <RootStack.Screen
              options={{
                headerShown: false,
              }}
              name="MainStack"
            >
              {() => <MainStackNavigator />}
            </RootStack.Screen>
          ) : (
            <RootStack.Screen
              options={{
                headerShown: false,
              }}
              name="AuthStack"
              component={AuthStackNavigator}
            />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;

/*
      <View>
        <Text>{!data ? "Loading..." : data}</Text>
        <Text>Hello</Text>
      </View>
*/
