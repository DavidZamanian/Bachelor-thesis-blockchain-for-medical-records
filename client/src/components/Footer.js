import React from "react";
import styles from "../styles";
import { View, Text, Image, SafeAreaView, useWindowDimensions, Switch, Button, Pressable, StyleSheet } from "react-native";

export default class Footer extends React.Component{
    render(){
        return(
            <View style={styles.footer}>Group 58 Copyright {'\u00A9'} 2022 </View>
        );
    }
};