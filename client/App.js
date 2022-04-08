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
import { RoleContext } from "./contexts/RoleContext";

const RootStack = createStackNavigator(); //Contains all of our application

function App() {
  const [data, setData] = React.useState(null);
  const { authentication, user, updateInfo } = apiService();

  // set the single chainConnection instance to be used throughout the entire app. 
  // This is async, so chainConnection will need to be awaited wherever used. 
  const [chainConnection] = React.useState({
    chainConnection: ChainConnectionFactory.getChainConnection(),
  });

  const [role, setRole] = useState("");
  const [userSSN, setUserSSN] = useState("");
  const [institution, setInstitution] = useState("");
  const value = { role, setRole, userSSN, setUserSSN, institution, setInstitution };

  //For testing only
  /*
  React.useEffect(() => {
    fetch("http://localhost:4000/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);
  */

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
      <RoleContext.Provider value={value}>
        <NavigationContainer>
          <RootStack.Navigator>
            {user && role != ""? (
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
      </RoleContext.Provider>
    </AuthContext.Provider>
    </ChainConnectionContext.Provider>
  );
}

export default App;
