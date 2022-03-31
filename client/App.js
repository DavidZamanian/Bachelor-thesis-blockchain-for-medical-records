import React from "react";
import { apiService } from "./hooks/apiService";
import { AuthContext } from "./contexts/AuthContext";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthStackNavigator } from "./src/Navigation/AuthStackNavigator";
import { MainStackNavigator } from "./src/Navigation/MainStackNavigator";
import { SubmitContext } from "./contexts/SubmitContext";
import {ChainConnectionContext} from "./contexts/ChainConnectionContext";
import ChainConnectionFactory from "./src/chainConnection/chainConnectionFactory";

const RootStack = createStackNavigator(); //Contains all of our application

function App() {
  const [data, setData] = React.useState(null);
  const { authentication, user, updateInfo } = apiService();
  const [chainConnection, setChainConnection] = React.useState(
    ChainConnectionFactory.getChainConnection()
  );

  //TODO This will be moved
  React.useEffect(() => {
    fetch("http://localhost:4000/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);
  /**
   * AuthContext makes the authentication methods reachable throughout the entire application
   *
   * Need to think about how we split up patient and doctors, might need to split 'user'
   * into 'patient' and 'staff'.
   *
   * @author David Zamanian
   */

  return (
    <ChainConnectionContext.Provider value={chainConnection}>
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
                {() => (
                  <SubmitContext.Provider value={updateInfo}>
                    <MainStackNavigator />
                  </SubmitContext.Provider>
                )}
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
    </ChainConnectionContext.Provider>
  );
}

export default App;
