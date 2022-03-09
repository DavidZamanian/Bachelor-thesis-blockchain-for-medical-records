import React from "react";
import { View, Text, Image } from "react-native";
import theme from "../theme.style";
import Icon from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";

const ThemeButton = (props) => {
    const {iconName, iconSize, labelText, labelSize, bWidth, bHeight, extraStyle, onPress} = props;
    return(
        <TouchableOpacity 
        onPress={onPress}
        style={[{
            height:bHeight,
            width:bWidth,
            flexDirection:'row',
            backgroundColor: theme.PRIMARY_COLOR,
            borderRadius: 100,
            borderWidth: 3,
            borderColor: theme.SECONDARY_COLOR,
            justifyContent: 'center',
            padding:5,
            elevation:5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,
            alignItems:"center",
        },extraStyle]}>
            <Icon name={iconName} size={iconSize} color="white"/>
            <Text style={{fontSize:labelSize, color:"white",alignSelf:"center",fontWeight:"bold"}}>{labelText}</Text>
        </TouchableOpacity>
    );

};

export default ThemeButton;