import React from "react";
import { View, Text, Image, SafeAreaView, useWindowDimensions, Switch, Button, Pressable, StyleSheet } from "react-native";
import theme from "../theme.style";
import style from "../styles";

export default class ColouredButton extends React.Component{
    render(){
        return(
            <Pressable style={style.largeButton} onPress={()=>{this.props.onPress(this.props.btnName)}}>
                {this.props.children}
            </Pressable>
        );
    }
};