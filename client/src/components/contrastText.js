import React from "react";
import { Text } from "react-native";
import theme from "../theme.style";

export default class ContrastText extends React.Component {
  render() {
    return (
      <Text style={{ color: theme.SECONDARY_COLOR, fontSize: 20 }}>
        {this.props.children}
      </Text>
    );
  }
}
