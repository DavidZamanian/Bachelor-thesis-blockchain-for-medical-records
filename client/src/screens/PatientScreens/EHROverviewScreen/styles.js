import { StyleSheet } from "react-native";
import theme from "../../../theme.style";

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
        marginVertical:15,
    },
    container:{
        backgroundColor:"white",
        minWidth:300,
        minHeight:100,
        maxWidth:400,
        flex:1,
        marginHorizontal:15,
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
    journalListItem:{
        padding:10,
        flexDirection:"row",
        alignItems:"center",
    },
    journalContainer:{
        borderColor:"#777777",
        borderWidth:1,
    },
    journalExpandedContainer:{
        backgroundColor:"white",
        borderTopWidth:1,
        borderTopColor:"#777777",
    },
    journalListHeader:{
        fontWeight:"600",
    },
    journalItemText:{
        fontSize:18,
        marginHorizontal:10,
        flex:2,
        textAlign:"center",
    },
    detailButton:{
        borderRadius:10,
        borderWidth:1,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        padding:10,
    },
    journalDetailsHeader:{
        fontSize:18,
        color:theme.PRIMARY_COLOR,
        fontWeight:"bold",
        marginVertical:5,
    },
    journalDetails:{
        fontWeight:"bold",
    },
    journalAuthor:{
        color:"#666666",
        fontWeight:"bold"
    },
    journalExpandedRow:{
        flexDirection:"row",
    },
    journalDataBlock:{
        margin:5,
        padding:5,
    },
    popupWindow:{
        height:500,
        width:500,
        backgroundColor:"white",
        borderRadius:15,
        blurRadius:20
    },
    popupButton:{
        borderRadius:15,
        padding:10,
        marginHorizontal:10,
    },
    greyButton:{
        backgroundColor:"#F5F5F5",
        borderColor:"#545D69",
        borderWidth:2
    },
    primaryButton:{
        backgroundColor:theme.PRIMARY_COLOR,
    },
    checkbox:{
        width:25,
        height:25,
        borderColor:"black",
        borderWidth:1,
        borderRadius:5,
    },
    regionList:{
        paddingHorizontal:20,
    },
    regionContainer:{
        flex: 1,
        flexDirection: 'row',
        margin: 1,
        alignItems:"center"
    },
    regionLabel:{
        margin:10,
    },

});

export default styles;