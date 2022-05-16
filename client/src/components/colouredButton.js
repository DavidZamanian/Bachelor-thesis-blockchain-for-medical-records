import React from "react";
import style from "../styles";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class ColouredButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={style.largeButton}
        onPress={() => {
          this.props.onPress(this.props.btnName);
        }}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
