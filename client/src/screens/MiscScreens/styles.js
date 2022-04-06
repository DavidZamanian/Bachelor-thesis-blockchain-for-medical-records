import { StyleSheet } from "react-native";
import theme from "../../theme.style";

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
        maxWidth:850,
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
    mainText: {
        fontSize:18,
        marginHorizontal:50,
    },
    describeText: {
        fontSize:18,
        fontStyle:"italic",
        color:"grey",
        textAlign:"center",
        marginHorizontal:50,
        marginBottom:10,
    },
    contentHeader:{
        fontSize:22,
        fontWeight:"400",
        color:theme.PRIMARY_COLOR,
        textAlign:"center",
        width:"100%",
        marginTop:20,
        marginBottom:10,
        borderBottomColor:theme.PRIMARY_COLOR,
        borderBottomWidth:2,
    },
});

export default styles;