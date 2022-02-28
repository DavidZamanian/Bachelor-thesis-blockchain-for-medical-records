import React from "react";
import { View, Text, Image, SafeAreaView, useWindowDimensions, Switch, Button, Pressable, StyleSheet } from "react-native";
import theme from "../theme.style";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class ColouredIcon extends React.Component{
    render(){
        return(
            <Icon name={this.props.name} size={50} color={theme.PRIMARY_COLOR}/>
        );
    }
};