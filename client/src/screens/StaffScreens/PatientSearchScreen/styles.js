import { StyleSheet } from "react-native";
import theme from "../../../theme.style";

const styles = StyleSheet.create({
    content:{
        top:theme.NAVBAR_HEIGHT,
        padding:50,
        width:"100%",
        height:"100%",
        flexDirection:"row",
        justifyContent:"center",
    },
    container :{
        maxWidth:500,
        backgroundColor:"white",
        borderRadius:15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding:25,
        height:300,
        flex:1,
    },
    headingText: {
        fontSize:28,
        fontWeight:"600",
        color:theme.PRIMARY_COLOR,
        textAlign:"center",
        width:"100%",
        borderBottomColor:theme.PRIMARY_COLOR,
        borderBottomWidth:2,
        marginBottom:15,
    },
    describeText: {
        fontSize:18,
        fontStyle:"italic",
        color:"grey",
        textAlign:"center",
        marginBottom:5,
    },
    searchBar:{
        fontSize:30,
        height:35,
        borderWidth: 1,
        borderRadius: 100,
        padding: 5,
        backgroundColor:"#F8F8F8",
        height:50,
        textAlign:"center",
        maxWidth:325,
        alignSelf:"center",
        marginVertical:5,
    },
    searchButton:{
        alignSelf:"center",
        maxWidth:325,
    },
    errorText: {
        color:"red",
        textAlign:"center",
        fontWeight:"bold",
        fontSize:18,
        
    }
});

export default styles;