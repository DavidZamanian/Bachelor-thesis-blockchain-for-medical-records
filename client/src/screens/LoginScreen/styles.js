import { StyleSheet } from "react-native";
import theme from "../../theme.style";

const styles = StyleSheet.create({
    main : {
      width: '100%',
      height: '100%',
      backgroundColor: "white",
    },
    content: {
      top: theme.NAVBAR_HEIGHT,
      width: '100%',
      height: theme.CONTENT_HEIGHT,
    },
    splitContainer: {
      flexDirection:'row',
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginContainer: {
      backgroundColor: 'white',
      borderRadius: 25,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      paddingHorizontal: 25,
      paddingVertical: 35,
      justifyContent: 'space-between',
      marginHorizontal: 15,
    },
    langContainer: {
      backgroundColor: 'white',
      borderRadius: 25,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginVertical:25,
      marginHorizontal: 15,
      flexDirection:"row"
    },
    langItem: {
      margin:5,
      padding:5,
      backgroundColor:theme.SECONDARY_COLOR,
      borderRadius:25,
      width:75,
      height:75,
    },
    langText: {
      marginTop:5,
      textAlign:"center",
      color:theme.PRIMARY_COLOR,
    },
    genericHeader: {
      fontSize: 32,
      color: theme.PRIMARY_COLOR,
      textAlign:'center',
      fontWeight:'bold',
    },
    inputHeader: {
      color: 'darkgray',
    },
    largeTextInputForm: {
      textAlign: 'center',
      fontSize: 22,
      margin: 12,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      alignSelf: 'center',
      width:"100%",
    },
    bulletpointContainer:{
      marginLeft:25, 
      marginVertical:25, 
      flexDirection:'row', 
      alignItems:'center'
    },
  });

  export default styles;