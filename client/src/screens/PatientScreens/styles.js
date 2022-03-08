import { StyleSheet } from "react-native";
import theme from "../../theme.style";

const styles = StyleSheet.create({
    content:{
        width:"100%",
        height:"100%",
    },
    contentHeader:{
        color:theme.PRIMARY_COLOR,
        fontSize:30,
        alignSelf:"center",
        marginTop:20,
        fontWeight:"bold",
    },
    rowContainer:{
        flexDirection:"row",
        justifyContent:"center",
        marginVertical:25,
    },
    container:{
        backgroundColor:"white",
        minWidth:300,
        minHeight:100,
        maxWidth:400,
        flex:1,
        marginHorizontal:25,
        borderRadius:25,
        elevation:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
        padding:20,
        alignItems:"center",
    },
    doubleContainer:{
        maxWidth:850,
    },
    header:{
        fontSize:24,
        fontWeight:"bold",
        color:theme.PRIMARY_COLOR,
        alignSelf:"center",
        textAlign:"center",
        borderBottomWidth:2,
        borderBottomColor:theme.PRIMARY_COLOR,
        width:"100%",
        marginBottom:10,
    },
    contactItem:{
        width:"100%",
        justifyContent:"center",
        flexDirection:"row",
        marginVertical:5,
    },
    contactKey:{
        textAlign:"right",
        fontWeight:"bold",
        flex:1,
        color:theme.PRIMARY_COLOR,
        fontSize:16,
    },
    contactValue:{
        textAlign:"left",
        fontWeight:"normal",
        flex:2,
        fontSize:16,
    },
    description:{
        fontSize:16,
        color:"grey",
        marginVertical:5,
    },
    bulletpointList:{
        fontWeight:"700",
        marginVertical:5,
    },
});

export default styles;