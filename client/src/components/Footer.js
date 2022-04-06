import React from "react";

import { View, Text, StyleSheet } from "react-native";
import theme from "../theme.style";
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
const styles = StyleSheet.create({
    footer : {
        position: 'fixed',
        bottom: 0,
        height: theme.FOOTER_HEIGHT,
        width: '100%',
        backgroundColor: theme.SECONDARY_COLOR,
        textAlign: 'center',
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-evenly",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
      },
      footerIcon:{
        color:theme.PRIMARY_COLOR,
        marginHorizontal:5,
      },
      footerText:{
        color:theme.PRIMARY_COLOR,
      },
});