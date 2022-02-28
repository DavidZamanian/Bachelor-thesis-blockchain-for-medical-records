import React from "react";
import { View, Text, Image, SafeAreaView, useWindowDimensions, Switch, Button, Pressable, StyleSheet } from "react-native";
import theme from "./theme.style";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class ContrastText extends React.Component{
    render(){
        return(
            <Text style={{color:theme.SECONDARY_COLOR, fontSize:20}}>{this.props.children}</Text>
        );
    }
};