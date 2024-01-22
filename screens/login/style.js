import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    image: {
        height: 72,
        width: 132,
        marginTop:175,
        alignItems:'center'
    },
    text1: {
        fontSize: 18,
        color: '#000',
        marginLeft: 36,
        marginBottom: 31,
        fontWeight: '700'
    },
    text2: {
        fontSize: 14,
        color: '#414141',
        marginLeft: 36,
        fontWeight: '500'
    },
    text3: {
        fontSize: 14,
        color: '#BEBEBE',
        marginTop:2,
        fontWeight: '500'
    },
    text4: {
        fontSize: 14,
        color: '#414141',
        marginLeft:8,
        marginTop:2,
        fontWeight: '600',
        opacity: 0.6000000238418579
    },
    

    input: {
        fontSize:20,
        fontWeight:'700',
        color:"#433939",
        justifyContent: 'center'

    },
    prefix: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#414141',
        paddingLeft:10
    
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        marginLeft: 34,
        marginRight:26,
        paddingHorizontal: 2,
        marginTop:-10,
        marginBottom: 95},

        borderWithOpacity: {
            flex: 1,
            flexDirection:'row',
            borderColor: 'rgba(84, 84, 84, 0.35)', // Set the border color with the desired opacity
            borderWidth: 1,
            borderRadius: 8
          
    },
    button: {
        height: 50,
        borderRadius: 20,
        backgroundColor: '#9252AA',
        marginLeft: 36,
        marginRight:26,
        justifyContent: 'center',
        alignItems:'center',
    },

    buttonText: {
        alignItems:'center',
        justifyContent:'center',
        color: '#FFF',
        fontSize: 18,
        fontWeight: '500',
        marginHorizontal:32
    },
    buttonText1: {
        justifyContent:'flex-end',
        color: '#9252AA',
        fontSize: 13,
        fontWeight: '600',
    },
    
      otpContainer: {
        flexDirection: 'row',
        marginTop:20,
        alignItems:"center",
        justifyContent:"center"
    },
      otpInput: {
        width: 56,
        height: 45,
        borderColor: '#D9D9D9',
        borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: 4,
        fontSize: 19,
        backgroundColor:'#E7E7E7',
        textAlign: 'center',
        opacity: 0.800000011920929,
        color:'#292929',
        fontWeight:'500'
      },
      invalidOtpText:{
        fontSize:14,
        color:'#F46C5B',
        fontWeight:'600',
      },
      timerText:{
        fontSize:12,
        fontWeight:'600',
        color:'#8A8A8A',
        maxWidth:700,
        textAlign:'center'
      },
      backgroundImage:{
        height: Dimensions.get('window').height + 30,
        width: Dimensions.get('window').width
      },
      bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 22,
        marginLeft:65,
        marginRight: 40,
      },
    
      resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
    
      resendCodeText: {
        color:"#9252AA",
        fontSize:13,
        fontWeight:'600',
        maxWidth:100
      },
      rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
      },
    
      leftContainer: {
        flex: 1,
      },
    
      centerContainer: {
        flex: 1,
      }
    },
    

    
    
    );
    

export default styles;