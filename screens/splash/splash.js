import React, { useEffect } from 'react';
import { StatusBar,View, Text,Image, StyleSheet,Dimensions } from 'react-native';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Splash = ({ navigation }) => {
  useEffect(() => {
    
    const timer = setTimeout(() => {
      checkLoggedInStatus()
    }, 2000);


    return () => clearTimeout(timer); // Clear the timeout when the component unmounts
  }, [navigation]);
 const checkLoggedInStatus = async () =>  {

  const isLoggedin = await AsyncStorage.getItem("isLoggedIn")
  try {
  if(isLoggedin=== "true") {
    navigation.navigate('ConfirmOrder')
  }
  else{
    navigation.navigate('CreateOrder')
  }
}
catch(error){

}
  


 }
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image source={require('../../assets/splash.png')} style={styles.image} />
    </View>
  );
};

export default Splash;