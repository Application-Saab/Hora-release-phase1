// AuthLoadingScreen.js
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const userToken = await AsyncStorage.getItem('token');
        if (userToken) {
          // User is authenticated, navigate to Home or any authenticated screen
          navigation.replace('DrawerNavigator');
        } else {
          // User is not authenticated, navigate to Login
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error reading user authentication state:', error);
      }
    };

    checkUserAuthentication();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default AuthLoadingScreen;
