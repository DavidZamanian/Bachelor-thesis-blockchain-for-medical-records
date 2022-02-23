import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Text, SafeAreaView, useWindowDimensions } from "react-native";

function App() {
  const [data, setData] = React.useState(null);

  //Need to restart the server for the message to update
  React.useEffect(() => {
    fetch("http://localhost:4000/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <View>
      <Text>{!data ? "Loading..." : data}</Text>
      <Text>Hello</Text>
    </View>
  );
}

export default App;
