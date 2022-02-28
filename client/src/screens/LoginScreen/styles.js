import { StyleSheet } from "react-native";
import theme from '../../components/theme.style';


const styles = StyleSheet.create({
  main : {
    width: '100%',
    height: '100%',
    backgroundColor: theme.SECONDARY_COLOR
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
    backgroundColor: theme.PRIMARY_COLOR,
    color: "white",
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navbar_buttons_container:{
    flexDirection: 'row',
  },
  navbar_button: {
    width: 70,
    height: 70,
    marginLeft: 10,
    position: 'relative',
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.SECONDARY_COLOR,
    alignItems: 'center',
  },
  navbar_button_icon: {
    width: 50,
    height: 50,
  },
  navbar_button_text: {
    color: theme.SECONDARY_COLOR,
  },
  content: {
    width: '100%',
    height: theme.CONTENT_HEIGHT,
    backgroundColor: theme.SECONDARY_COLOR,
  },
  splitContainer: {
    flexDirection:'row',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    width: 500,
    height: 400,
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
    paddingHorizontal: 90,
    paddingVertical: 50,
    justifyContent: 'space-between',
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
    width: 325,
  },
  largeButton: {
    height: 50,
    width:325,
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
