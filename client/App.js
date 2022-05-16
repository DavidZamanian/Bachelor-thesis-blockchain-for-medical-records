import React, { useState } from "react";
import { apiService } from "./hooks/apiService";
import { AuthContext } from "./contexts/AuthContext";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AuthStackNavigator } from "./src/Navigation/AuthStackNavigator";
import { MainStackNavigator } from "./src/Navigation/MainStackNavigator";
import { SubmitContext } from "./contexts/SubmitContext";
import { ChainConnectionContext } from "./contexts/ChainConnectionContext";
import ChainConnectionFactory from "./src/chainConnection/chainConnectionFactory";
import { UserDataContext } from "./contexts/UserDataContext";

const RootStack = createStackNavigator(); //Contains all of our application

function App() {
  const { authentication, user, updateInfo } = apiService();

  const [chainConnection] = React.useState({
    chainConnection: ChainConnectionFactory.getChainConnection(),
  });

  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const [role, setRole] = useState("");
  const [userSSN, setUserSSN] = useState("");
  const [institution, setInstitution] = useState("");
  const value = {
    role,
    setRole,
    userSSN,
    setUserSSN,
    institution,
    setInstitution,
    privateKey,
    setPrivateKey,
    publicKey,
    setPublicKey,
  };

  /**
   * AuthContext makes the authentication methods reachable throughout the entire application
   *
   *
   * @author David Zamanian
   */

  return (
    <ChainConnectionContext.Provider value={chainConnection}>
      <AuthContext.Provider value={authentication}>
        <UserDataContext.Provider value={value}>
          <NavigationContainer>
            <RootStack.Navigator>
              {user && role != "" ? (
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
        </UserDataContext.Provider>
      </AuthContext.Provider>
    </ChainConnectionContext.Provider>
  );
}

export default App;
