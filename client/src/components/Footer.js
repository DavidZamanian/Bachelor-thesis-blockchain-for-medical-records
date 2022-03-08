import React from "react";
import styles from "../styles";
import { View, Text, Image, SafeAreaView, useWindowDimensions, Switch, Button, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default class Footer extends React.Component{
    render(){
        return(
            <View style={styles.footer}>
                <Text style={styles.footerText}>Group 58 Copyright {'\u00A9'} 2022</Text>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <Text style={styles.footerText}>Powered by: </Text>
                    <Icon style={styles.footerIcon} name="logo-javascript" size={20}/>
                    <Icon style={styles.footerIcon} name="logo-nodejs" size={20}/>
                    <Icon style={styles.footerIcon} name="logo-react" size={20}/>
                    <Icon style={styles.footerIcon} name="logo-npm" size={20}/>
                </View>
            </View>
        );
    }
};