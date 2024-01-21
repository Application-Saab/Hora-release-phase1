import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    text: {
      color: "#863FA1",
      fontSize: 18,
      marginLeft: 20,
      marginBottom: 5,
      fontStyle:'normal'
    },
    subText: {
      color: 'rgba(0, 0, 0, 0.7)',
      fontSize: 13,
      marginLeft: 20,
      marginBottom: 10,
      marginEnd:15
    },
    container: {
      flexDirection: 'column',
  
    },
    parentContainer: {
      marginHorizontal: 18,
      height: 'auto',
      borderBottomRightRadius: 5,
      borderBottomLeftRadius: 5,
      backgroundColor: 'rgba(240, 242, 255, 0.9)',
    },
    containerText: {
      color: '#000000',
      fontSize: 16,
      marginHorizontal: 16,
      fontFamily: 'bold',
      marginTop: 16,
      marginBottom: 5
    },
    listContainer: {
      padding: 10
    },
    item: {
      flexDirection: 'row',
      marginBottom: 10
    },
    image: {
      width: 36,
      height: 36,
      marginRight: 10,
    },
    listText: {
      fontSize: 13,
      color: 'rgba(0, 0, 0, 0.7)',
    },
    textOverlay: {
      position: 'absolute',
      top: -5,
      left: -5,
      right: 5,
      bottom: -3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centerText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center'
    },
    imageContainer: {
      position: 'relative',
    },
    topImage: {
      width: '100%',
      height: 300,
      marginBottom: 5
    },
    imageStyle:{
      width:336,
      height:36,
      marginStart:20
    },
    imageView:{
      flexDirection:'row'
    },
    textInsideImage:{
      marginStart:25,
      fontSize: 13,
      color: 'white',
      marginVertical:7
    },
    referralText:{
      fontSize: 13,
      color: 'white',
      fontFamily:'bold',
      marginLeft:5,
      marginVertical:7
    },
    viewInsideContainer:{
      flexDirection:'row'
    },
    shareIcon:{
      width:68,
      height:68,
      right:20,
      bottom:16,
      position:'relative'
    }
  
  })