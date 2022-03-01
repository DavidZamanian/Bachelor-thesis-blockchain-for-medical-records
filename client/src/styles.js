import { StyleSheet } from "react-native";
import theme from './theme.style';


const styles = StyleSheet.create({
  main : {
    width: '100%',
    height: '100%',
    backgroundColor: "white",
  },
  footer : {
    position: 'fixed',
    bottom: 0,
    height: 25,
    width: '100%',
    backgroundColor: theme.PRIMARY_COLOR,
    color: theme.SECONDARY_COLOR,
    textAlign: 'center',
  },
  navbar : {
    width: '100%',
    height: theme.NAVBAR_HEIGHT,
    backgroundColor: theme.SECONDARY_COLOR,
    color: "white",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navbar_logo_container:{
    backgroundColor: theme.PRIMARY_COLOR,
    width:300,
    height:"100%",
    borderBottomRightRadius:500,
    flexDirection:"row",
    alignItems:"center",
    padding: 10,
  },
  navbar_buttons_container:{
    flexDirection: 'row',
    margin:10,
  },
  navbar_button: {
    width: 70,
    height: 70,
    marginLeft: 10,
    position: 'relative',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  navbar_button_icon: {
    width: 50,
    height: 50,
  },
  navbar_button_text: {
    color: theme.PRIMARY_COLOR,
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
    height: 40,
    textAlign: 'center',
    fontSize: 22,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignSelf: 'center',
    width: '100%',
  },
  largeButton: {
    height: 50,
    width:"100%",
    flexDirection:'row',
    backgroundColor: theme.PRIMARY_COLOR,
    color: theme.SECONDARY_COLOR,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    textAlignVertical: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf:'center',
  },
});
export default styles;
