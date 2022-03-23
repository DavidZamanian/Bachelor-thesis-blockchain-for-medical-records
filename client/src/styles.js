import { StyleSheet } from "react-native";
import theme from './theme.style';


const styles = StyleSheet.create({
  main : {
    width: '100%',
    height: '100%',
    backgroundColor: "white",
  },
  content: {
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
  largeButton: {
    height: 50,
    width:"100%",
    flexDirection:'row',
    backgroundColor: theme.PRIMARY_COLOR,
    color: theme.SECONDARY_COLOR,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.SECONDARY_COLOR,
    alignItems: 'center',
    textAlignVertical: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf:'center',
    padding:5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  navigation_text:{
    fontSize: 28,
    color: theme.PRIMARY_COLOR,
    justifyContent: 'center',
    alignSelf:'center',
  },
  multilineTextInputForm: {
    fontSize:16,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignSelf: 'center',
    width:'100%',
    height:350,
  },
  genericListItem: {
    padding:10,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
  },
  genericListItemText: {
    fontSize:16,
    fontWeight:"bold",
    height:20,
  },
  genericListItemHeader: {
    fontSize:20,
    color:theme.PRIMARY_COLOR,
  },
  normalButton:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    padding:5,
    borderRadius:5,
  },
  regularTextInput:{
    fontSize: 16,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height:40,
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
  greyText: {
    color:"#545D69",
  },
  contrastText: {
    color: theme.SECONDARY_COLOR,
  },
  submitMessage:{
    borderWidth:2,
    borderRadius:10,
    padding:10,
    fontSize:18,
    fontWeight:"500",
    borderColor:"black",
    backgroundColor:"white",
    textAlign:"center",
    flexDirection:"row",
    justifyContent:"center"
  },
  submitLoading:{
    
    borderColor:"#333333"
  },
  submitSuccess:{
    backgroundColor:theme.SECONDARY_COLOR,
    borderColor:theme.PRIMARY_COLOR
  },
  submitError:{
    borderColor:"#ce0018",
    backgroundColor:"#ffdcd5",
  }
});
export default styles;
