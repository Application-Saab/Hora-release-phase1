import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, Dimensions,StatusBar, View, Text, KeyboardAvoidingView, Platform, TextInput, Image, ImageBackground, TouchableOpacity, TouchableHighlight, BackHandler } from 'react-native';
import styles from './style';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomStatusBar from '../../components/CustomStatusBar';
import { BASE_URL, OTP_GENERATE_END_POINT, API_SUCCESS_CODE, OTP_VERIFY_ENDPOINT } from '../../utils/ApiConstants';

const Login = ({ navigation, route }) => {

    const [mobileNumber, setMobileNumber] = useState('');
    const [isPressed, setIsPressed] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = useRef([]);
    const [timer, setTimer] = useState(0);
    const [validOtp, setValidOtp] = useState(undefined);
    const [fetchedOtp, setFetchedOtp] = useState(null)
    const [validMobileNumber, setValidMobileNumber] = useState(true)

    // useEffect(() => {
    //     const backAction = () => {
    //         BackHandler.exitApp();
    //         return true;
    //     };

    //     // Reset isPressed to false after the component has mounted
    //     setTimeout(() => {
    //         setIsPressed(false);
    //     }, 100);

    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    //     return () => {
    //         backHandler.remove();
    //     };
    // }, []);


    const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text === '' && index > 0) {
            // Move the cursor to the previous input on backspace
            inputRefs.current[index - 1].focus();
        } else if (text.length === 1 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }

        if (newOtp.join('').length === 4) {
            validateOtp(newOtp.join(''));
        } else {
            setValidOtp(undefined);
        }
    };

    const handleMobileNumberChange = (text) => {
        if (text.length <= 10) {
            setMobileNumber(text);
        }
        if (text.length === 10) {
            setValidMobileNumber(true)
        }
    };

    const handleResendOtp = () => {
        setTimer(30);
        setOtp(['', '', '', ''])
        inputRefs.current[0].focus();
        setValidOtp(undefined);
        fetchOtp();
    };

    const fetchOtp = async () => {
        try {
            const url = BASE_URL + OTP_GENERATE_END_POINT;
            const requestData = {
                phone: mobileNumber,
                role: 'customer',
            };
            const response = await axios.post(url, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.status === API_SUCCESS_CODE) {
                setFetchedOtp(response.data.otp);
                console.log("OTP send succeefuly")
            } else {
                console.log('OTP sending failed');
            }
        } catch (error) {
            console.log('Error sending OTP:', error.message);
        }
    };


    const setData = async (enteredOtp) => {
        try {
            const url = BASE_URL + OTP_VERIFY_ENDPOINT;
            const requestData = {
                phone: mobileNumber,
                role: 'customer',
                otp: enteredOtp
            };
            const response = await axios.post(url, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.status === API_SUCCESS_CODE) {
                AsyncStorage.setItem("isLoggedIn", "true")
                AsyncStorage.setItem("mobileNumber", mobileNumber)
                AsyncStorage.setItem('token', response.data.token)
                    .then(() => {
                        navigation.navigate('DrawerNavigator');
                    })
                    .catch((error) => {
                        console.log('Error storing token:', error.message);
                    });
            }
        } catch (error) {
            console.log('Error sending OTP:', error.message);
        }

    }

    const validateOtp = (enteredOtp) => {
        if (fetchedOtp != null) {
            if (enteredOtp === String(fetchedOtp)) {
                setValidOtp(true);
                setData(enteredOtp)
            } else {
                setValidOtp(false);
            }
        }
    };

    useEffect(() => {
        let intervalId;
        if (timer > 0) {
            intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [timer]);

    
    const handlePress = () => {
        if (mobileNumber.length < 10) {
            setValidMobileNumber(false)
        } else {
            setValidMobileNumber(true)
            setIsPressed(true);
            setValidOtp(undefined)
            fetchOtp();
            setTimer(30);
        }
    };

    const validOtpInputStyle = {
        ...styles.otpInput,
        backgroundColor: validOtp === true ? 'rgba(86, 152, 105, 0.2)' : validOtp === false ? '#FFE0E0' : undefined,
        borderColor: validOtp === true ? '#2D9362' : validOtp === false ? '#F66' : undefined,
    };


   
	
    return (
		<View>
        <ImageBackground source={require('../../assets/loginBackground.png')} style={styles.backgroundImage} resizeMode="cover">
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems:"center" , marginTop:"5%" }}>
                <Image source={require('../../assets/hora.png')} style={styles.image} />
            </View>
            <View style={{ justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginTop: 8, marginHorizontal: 45 }}>
                <Text style={{ fontWeight: '500', fontSize: 14, color: "#9252AA" }}>Simplifying and Enhancing Celebrations{'\n'}            All Party Services, One App</Text>
                {!isPressed ? (<Text style={{ fontWeight: '800', fontSize: 18, color: 'black', marginTop: 9 }}>Get Started</Text>) : null}
                {isPressed ? (<Text style={{ fontSize: 18, color: 'black', fontWeight: '700', marginTop: 3 }}>Enter OTP</Text>) : null}
                <View style={{ marginLeft: 16 }}>

                    <Text style={[styles.text3]}>
                        {isPressed ? 'Check your phone we have sent you \n       an OTP to' : null}
                        {isPressed ?
                            <Text style={{ color: '#9252AA', fontSize: 14, fontWeight: '700' }}>
                                {' (+91) ' + mobileNumber}
                            </Text>
                            : null}
                    </Text>


                </View>


                {!isPressed ? (<Text style={{ fontSize: 14, lineHeight: 16, fontWeight: '500', color: '#BEBEBE' }}>Login with your mobile number </Text>) : null}
            </View>



            {!isPressed || (isPressed && validMobileNumber === false) ? (
                <View style={{ flexDirection: 'row', justifyContent:"center", marginTop: 15 , alignItems:"center"}}>
                   
                    <View style={{ width: 56, paddingHorizontal: 10,backgroundColor: '#E7E7E7', justifyContent: 'center', borderRadius: 8, borderWidth: 1, borderColor: "#D9D9D9" , paddingVertical:12 }}>
                        <Text style={{ color: "#929292", fontSize: 16, fontWeight: '700' }}> +91 </Text>
                    </View>

                    <View style={{ width: 240, marginStart: 3, backgroundColor: validMobileNumber ? "#E7E7E7" : '#FFE0E0', justifyContent: 'center', paddingLeft: 29, borderRadius: 8, borderWidth: 1, borderColor: validMobileNumber ? "#D9D9D9" : '#F46C5B' }}>
                        <TextInput
                            style={{ ...styles.input }}
                            placeholder="000 000 0000"
                            keyboardType="phone-pad"
                            maxLength={10}
                            textContentType='telephoneNumber'
                            value={mobileNumber}
                            onChangeText={handleMobileNumberChange}
                        />
                    </View>

						   
                </View>) : <View style={styles.otpContainer}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        style={[
                            validOtp === undefined ? styles.otpInput : validOtpInputStyle,
                        ]}
                        keyboardType="numeric"
                        maxLength={1}
                        value={otp[index]}
                        onChangeText={(text) => handleOtpChange(text, index)}
                    />
                ))}
            </View>}
            {validMobileNumber === false ? (

                <View style={{ marginTop: 10, marginStart: 31, marginRight: 35 }}>
                    <Text style={{ color: '#F46C5B', fontSize: 12, fontWeight: '600' }}>*Invalid phone no, length can not be less than 10 digits</Text>
                </View>
            ) :
                <View style={{ marginTop: 10, marginStart: 31, marginRight: 35 }}>
                    <Text style={{ color: 'transparent', fontSize: 12, fontWeight: '600' }}>*Invalid phone no, length can not be less than 10 digits</Text>
                </View>}

            {isPressed ? (
                <View style={styles.bottomContainer}>
                    <View style={styles.leftContainer}>
                        {validOtp === false && (
                            <Text style={styles.invalidOtpText}>*Wrong OTP</Text>
                        )}
                    </View>
                    <View style={styles.centerContainer}>
                        {timer !== 0 ? (
                            <Text style={styles.timerText}>Resend Code in 00:{timer}</Text>
                        ) : (
                            <Text style={styles.timerText}></Text>
                        )}
                    </View>
                    <View style={styles.rightContainer}>
                        {timer === 0 ? (
                            <TouchableOpacity onPress={handleResendOtp}>
                                <Text style={styles.resendCodeText}>Resend Code</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
            ) : null}

            {!isPressed ?

                <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 30 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={20}
                >

                    <TouchableHighlight style={styles.button} onPress={handlePress} underlayColor="#9252AA">
                        <Text style={styles.buttonText}>GET OTP</Text>
                    </TouchableHighlight>

                </KeyboardAvoidingView>
                : null}
        </ImageBackground>
		</View>
			   
	   

    );
};

export default Login;
