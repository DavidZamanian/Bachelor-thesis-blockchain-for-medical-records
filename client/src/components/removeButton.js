import React from "react";
import styles from "../styles";
import { View, Text, Image, SafeAreaView, useWindowDimensions, Switch, Button, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";



export default class RemoveButton extends React.Component{
    render(){
        return(
            <TouchableOpacity style={styles.removeButton}>
                <Icon name="trash" size={20} color="white"/>
                <Text style={{color:"white"}}>Remove</Text>
            </TouchableOpacity>
        );
    }
};