import React from 'react';
import { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dimensions, ImageBackground, FlatList, ScrollView, StatusBar, View, Text, TextInput, Image, TouchableOpacity, TouchableHighlight, BackHandler } from 'react-native';
import ProductDateSummary from '../screens/Decoration/ProductDateSummary';
import CustomHeader from '../components/CustomeHeader';
import Splash from '../screens/splash/splash'
import Home from '../screens/home/Home';
import Login from '../screens/login/Login'
import MyAccount from '../screens/myaccount/MyAccount'
import CreateOrder from '../screens/createorder/CreateOrder';
import ConfirmOrder from '../screens/confirmOrder/ConfirmOrder';
import ConfirmLocation from '../screens/confirmlocation/ConfirmLocation';
import SelectDate from '../screens/SelectDate/SelectDate';
import ConfirmDishOrder from '../screens/confirmdishorder/ConfirmDishOrder';
import ConfirmFoodDeliveryOrder from '../screens/foodDelivery/ConfirmFoodDeliveryOrder';
import Onboarding from '../screens/Onboarding/Onboarding';
import DecorationCatPage from '../screens/Decoration/DecorationCatPage';
import DrawerNavigation from '../components/DrawerNavigation';
import OrderDetails from '../screens/orderdetails/OrderDetails';
import DecorationPage from '../screens/Decoration/DecorationPage';
import FoodDeliveryPage from '../screens/foodDelivery/FoodDeliveryPage';
import CreateOrderFoodDelivery from '../screens/foodDelivery/CreateOrderFoodDelivery';
import HospitalityService from '../screens/hospitalityservice/HospitalityService';
import Gifts from '../screens/gifts/Gifts';
import AuthLoadingScreen from '../screens/AuthLoadingScreen/AuthLoadingScreen';
import Entertainment from '../screens/entertainment/Entertainment';
import Orderlist from '../screens/orderlist/Orderlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import SelectDateFoodDelivery from '../screens/foodDelivery/SelectDateFoodDelivery';

const Stack = createNativeStackNavigator();
const navigationRef = React.createRef();

const StackNavigation = () => {


  useEffect(() => {
    const backAction = () => {

      
        if (navigationRef.current && navigationRef.current.getCurrentRoute().name === 'Home') {

            return true; // Prevent default behavior (going back to the previous screen)
          }
          
          // If not on the Home screen, let the default behavior happen
          return false;
    };

    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
        backHandler.remove();
    };
}, []);

const handleLogin = async (userToken) => {
  // Save user authentication state in AsyncStorage
  try {
    
    await AsyncStorage.setItem('userToken', userToken);
    setIsUserLoggedIn(true);
  } catch (error) {
    console.error('Error saving user authentication state:', error);
  }
};

const handleLogout = async () => {
  // Remove user authentication state from AsyncStorage
  try {
    await AsyncStorage.removeItem('userToken');
    setIsUserLoggedIn(false);
  } catch (error) {
    console.error('Error removing user authentication state:', error);
  }
};


  return (
    <NavigationContainer ref={navigationRef}>
    <Stack.Navigator
      screenOptions={{
        header: ({ route }) => { },
      }}
      initialRouteName="DrawerNavigator"
    > 
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigation} />
      <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} />
      <Stack.Screen name="MyAccount" component={MyAccount}  options={{ headerShown: true }} />
      <Stack.Screen name="Splash" component={Splash}  options={{ headerShown: true }} />
      <Stack.Screen name="Login" component={Login}  options={{ headerShown: false }} />
      <Stack.Screen name="CreateOrder" component={CreateOrder}  options={{ headerShown: true }} />
      <Stack.Screen name="ConfirmOrder" component={ConfirmOrder}  options={{ headerShown: true }} />
      <Stack.Screen name="ConfirmLocation" component={ConfirmLocation}  options={{ headerShown: true }} />
      <Stack.Screen name="SelectDate" component={SelectDate}  options={{ headerShown: true }} />
      <Stack.Screen name="SelectDateFoodDelivery" component={SelectDateFoodDelivery}  options={{ headerShown: true }} />
      <Stack.Screen name="ConfirmDishOrder" component={ConfirmDishOrder}  options={{ headerShown: true }} />
      <Stack.Screen name="Onboarding" component={Onboarding}  options={{ headerShown: true }} />
      <Stack.Screen name="DecorationCatPage" component={DecorationCatPage}  options={{ headerShown: true }}/>
      <Stack.Screen name="ProductDateSummary" component={ProductDateSummary} options={{ headerShown: true }}/>
      <Stack.Screen name="DecorationPage" component={DecorationPage}  options={{ headerShown: true }} />
      <Stack.Screen name="CreateOrderFoodDelivery" component={CreateOrderFoodDelivery}  options={{ headerShown: true }} />
      <Stack.Screen name="ConfirmFoodDeliveryOrder" component={ConfirmFoodDeliveryOrder}  options={{ headerShown: true }} />
      <Stack.Screen name="FoodDeliveryPage" component={FoodDeliveryPage}  options={{ headerShown: true }} />
      <Stack.Screen name="OrderDetails" component={OrderDetails}  options={{ headerShown: true }} />
      <Stack.Screen name="FoodDelivery" component={FoodDeliveryPage}  options={{headerShown:true}}/>
      <Stack.Screen name="HospitalityService" component={HospitalityService}  options={{headerShown:true}}/>
      <Stack.Screen name="Gifts" component={Gifts}  options={{headerShown:true}}/>
      <Stack.Screen name="OrderList" component={Orderlist}  options={{headerShown:true}}/>
	  <Stack.Screen name="Entertainment" component={Entertainment} options={{headerShown:true}}/>
																							
    </Stack.Navigator>
    </NavigationContainer>
  );
};
export default StackNavigation;