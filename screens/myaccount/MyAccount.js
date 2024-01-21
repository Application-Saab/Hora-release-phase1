import React from 'react';
import { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, TextInput, TouchableHighlight, Button, ImageBackground, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import styles from './styles'
import CustomStatusBar from '../../components/CustomStatusBar';
import { BASE_URL, GET_USER_DETAIL_ENDPOINT, API_SUCCESS_CODE, UPDATE_USER_DETAIL_ENDPOINT } from '../../utils/ApiConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyAccount = ({ navigation }) => {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');


  useEffect(() => {
    fetchMobileNumber()
    fetchUserAccount();
  }, []);

  const fetchMobileNumber = async () => {
    const number= await AsyncStorage.getItem("mobileNumber")
    setMobileNumber(number)
    console.warn(mobileNumber)
  }



  const fetchUserAccount = async () => {
    const url = BASE_URL + GET_USER_DETAIL_ENDPOINT
    const requestData = {
      "phone": mobileNumber
    }
    const header = {
      'Content-Type': 'application/json',
      'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDEzMzQwZjU0OWI1OGUzZGMzOWEwMzUiLCJuYW1lIjoiUmFodWwiLCJlbWFpbCI6ImFiY0BnbWFpbC5jb20iLCJwaG9uZSI6IjgzODc5OTkzODIiLCJyb2xlIjoic3VwcGxpZXIiLCJpYXQiOjE2ODQ4MzUyMjEsImV4cCI6MTcxNjM3MTIyMX0.t_zNmFXX-gvjAiB9G62h_G8dPESeevYdiNFGOTXe_JU'

    }
    const response = await axios.get(url, requestData, header)
    console.warn(response.data)

    if (response.data.code === API_SUCCESS_CODE) {
      setName(response.data.data.name)
      setEmail(response.data.data.email)
    }
  }

  const handleUpdateAccount = async () => {
    const queryParams = {
      'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDEzMzQwZjU0OWI1OGUzZGMzOWEwMzUiLCJuYW1lIjoiUmFodWwiLCJlbWFpbCI6ImFiY0BnbWFpbC5jb20iLCJwaG9uZSI6IjgzODc5OTkzODIiLCJyb2xlIjoic3VwcGxpZXIiLCJpYXQiOjE2ODQ4MzUyMjEsImV4cCI6MTcxNjM3MTIyMX0.t_zNmFXX-gvjAiB9G62h_G8dPESeevYdiNFGOTXe_JU'
      // Add more query parameters as needed
    };

    const queryString = Object.keys(queryParams)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join('&');
    const url = BASE_URL + UPDATE_USER_DETAIL_ENDPOINT + '?' + queryString
    const requestData = {
      "name": name,
      "email": email
    }
    const header = {
      'Content-Type': 'application/json',
    }
    const response = await axios.post(url, requestData, header)
    if (response.data.code === API_SUCCESS_CODE) {
      console.warn('success')
    }
    else {
      console.warn('success')
      
    }

  };

  return (
    <View>
      <CustomStatusBar />
      <View style={styles.contentContainer} >
        <ImageBackground source={require('../../assets/Rectangle.png')} style={{ ...styles.backgroundImage, marginTop: 54 }}>
          <View style={styles.contentContainer1} >
            <Text style={styles.text}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              // placeholderTextColor="transparent"
              style={styles.textInput} />
          </View>
        </ImageBackground>
        <Image source={require('../../assets/name.png')} style={{ ...styles.iconImage, marginTop: 57 }} />

      </View>


      <View style={styles.contentContainer} >
        <ImageBackground source={require('../../assets/Rectangle.png')} style={{ ...styles.backgroundImage, marginTop: 25 }}>
          <View style={styles.contentContainer1} >
            <Text style={styles.text}>Contact Number</Text>
            <TextInput
              value={mobileNumber}
              // placeholderTextColor="transparent"
              style={styles.textInput}
              editable={false} />
          </View>
        </ImageBackground>
        <Image source={require('../../assets/name.png')} style={{ ...styles.iconImage, marginTop: 28 }} />

      </View>
      <View style={styles.contentContainer} >
        <ImageBackground source={require('../../assets/Rectangle.png')} style={{ ...styles.backgroundImage, marginTop: 25 }}>
          <View style={styles.contentContainer1} >
            <Text style={styles.text}>Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              // placeholderTextColor="transparent"
              style={styles.textInput} />
          </View>
        </ImageBackground>
        <Image source={require('../../assets/name.png')} style={{ ...styles.iconImage, marginTop: 28 }} />
      </View>

      <TouchableHighlight style={styles.button} onPress={navigation.navigate('ConfirmOrder')} underlayColor="#E56352">
        <Text style={styles.buttonText}>Update</Text>
      </TouchableHighlight>
    </View>
  );
};

export default MyAccount;
