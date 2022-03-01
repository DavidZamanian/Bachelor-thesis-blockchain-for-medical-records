import React from "react";
import { View, Text, Image, SafeAreaView, useWindowDimensions, Switch, Button, Pressable, StyleSheet } from "react-native";
import theme from "../theme.style";
import Icon from "react-native-vector-icons/Ionicons";

export default class ColouredIcon extends React.Component{
    render(){
        return(
            <Icon size={this.props.size} name={this.props.name} color={theme.PRIMARY_COLOR}/>
        );
    }
};