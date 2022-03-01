import React from "react";
import { View, Text, Image, SafeAreaView, useWindowDimensions, Switch, Button, Pressable, StyleSheet } from "react-native";
import theme from "../theme.style";

export default class ColouredText extends React.Component{
    render(){
        return(
            <Text style={{color:theme.PRIMARY_COLOR, fontSize:20}}>{this.props.children}</Text>
        );
    }
};