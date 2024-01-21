import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const styles = StyleSheet.create({

    screenContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    view1: { flexDirection: 'row', backgroundColor: '#EFF0F3',elevation:2,width:Dimensions.get('window').width},
    text1: { color: '#676767', fontSize: 12, fontWeight: '400', paddingVertical:5 ,marginStart:8},
    image1: { width: 16, height: 16, marginLeft: 16, marginTop: 5,marginBottom:5},
    view2: {
       flexDirection: 'row',
       marginEnd:21,
       marginStart:16 ,
       marginTop:15 ,
        paddingBottom:5 ,
         justifyContent:"space-around",
    borderBottomColor:"#efefef",
},
    image2: { height: 36, width: 47},
    image3: { height: 2, width: 80, marginLeft: 20, marginTop:15 },
    image4: {height:25,width:25,marginLeft:16},
    image5: {height: 40, width: 70},
    vegNonVegContainer:{
      display:"flex",
      flexDirection:"row",
      justifyContent:"flex-start",
      alignContent:"center",
      paddingLeft:20,
      paddingTop:15,
      width:"100%"
    },
    boxvegContainer:{
      marginRight:20,
      flexDirection:"row",
      borderColor:"#00FF00",
      borderWidth:1,
      justifyContent:"space-around",
      alignItems:"center",
      padding:2,
    },
    boxnonvegContainer:{
      marginRight:20,
      flexDirection:"row",
      borderColor:"red",
      borderWidth:1,
      justifyContent:"space-around",
      alignItems:"center",
      paddingTop:2,
      paddingBottom:2,
      paddingRight:2,
      paddingLeft:8
      
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 20,
        marginTop:15,
      },
      button: {
        paddingHorizontal: 9,
        paddingVertical: 8,
        backgroundColor: 'white',
        borderRadius: 15,
        borderWidth:1,
        borderColor:'#A0A5B',
      },
      selectedButton: {
        backgroundColor: '#9252AA',
        borderColor:'#9252AA',
        borderWidth:1 // Change to the desired highlight color
      },

      buttonText: {
        fontSize: 12,
        color:'black'
      },
      selectedButtonText: {
        color: 'white', // Change to the desired highlight text color
      },
      button1: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 5,
        marginVertical: 5,
        backgroundColor: 'lightgray',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
      },
      selectedButton1: {
        backgroundColor: 'green', // Change to the desired highlight color
      },
      buttonText1: {
        fontSize: 16,
      },
      
      selectedButtonText1: {
        color: 'white', // Change to the desired highlight text color
      },
      container1: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
      },
      bottomSheetContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 12,
        paddingTop:12
  
      },
      bottomSheetWrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      draggableIcon: {
        backgroundColor: '#000',
      },
      buttonText1: {
        color: 'white',
        fontWeight:'500',
        fontSize: 18,
      },
      customButton: {
        height:57,
        width:Dimensions.get('window').width * 0.9,
        backgroundColor: '#9252AA',
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 20,
      },
      textContainer: {
        width: '33%',
        paddingVertical:5,
        paddingHorizontal:4,
        borderRadius:3,
        backgroundColor: 'rgba(146, 82, 170, 0.37)',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal:5
      },
      text: {
        fontSize: 12,
        fontWeight: '400',
        color: '#4B4B4B',
      },
      container: {
        padding: 4, // Adds spacing between rows
      },
      columnWrapper: {
        justifyContent: 'space-between', // Adds spacing between columns
        padding:2
      },
      verticalSeparator:{
        marginStart:39,
        height:1,
        width:Dimensions.get('window').width*.8,
        marginTop:9
      },
      cuisineContainer: {
        marginTop:9,
        marginBottom:-4,
        color:"#000",
      },
      cuisineColumnWrapper: {
        justifyContent: 'space-between', // Adds spacing between columns
        marginBottom:10,
      },
      dishContainer: {
      },
      dishColumnWrapper: {
        justifyContent: 'space-between',
      },
      bottomButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        alignItems: 'center',
    },
    bottomButtonContainer1:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        top:"100%",
        right: 0,
        padding: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        alignItems: 'center',
    },
    continueButton: {
      marginTop: 10,
      backgroundColor: 'gray',
      marginBottom:15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft:21,
      paddingEnd:20,
      paddingVertical:17,
      borderRadius: 20,
  },
    buttonContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
  },
  continueButtonLeftText: {
    color: 'white',
    fontSize: 19,
    fontWeight: '500',
},
continueButtonRightText: {
  color: '#FFF',
  fontSize: 16,
  fontWeight: '400',
}

})

export default styles;