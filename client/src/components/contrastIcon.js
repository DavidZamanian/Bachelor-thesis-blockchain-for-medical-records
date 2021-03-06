import React from "react";
import theme from "../theme.style";
import Icon from "react-native-vector-icons/Ionicons";

export default class ContrastIcon extends React.Component {
  render() {
    return (
      <Icon name={this.props.name} size={35} color={theme.SECONDARY_COLOR} />
    );
  }
}
