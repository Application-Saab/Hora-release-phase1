import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Contact from '../screens/contact/Contact';
import Profile from '../screens/profile/Profile';
import Orderlist from '../screens/orderlist/Orderlist';
import Faq from '../screens/Faq/Faq';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Home from '../screens/home/Home';
import Login from '../screens/login/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, GET_USER_DETAIL_ENDPOINT } from '../utils/ApiConstants';

const Drawer = createDrawerNavigator();



const UserInfo = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  // Function to fetch the token from AsyncStorage
  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      } else {
        console.log('Token not found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  
  const fetchUserAccount = async () => {
    try {
      const response = await fetch(BASE_URL + GET_USER_DETAIL_ENDPOINT, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: token,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // setName(userData.data.name || '');
        setMobileNumber(userData.data.phone);
        setEmail(userData.data.email || '');
      } else {
        const errorData = await response.json();
        console.log(`Error fetching user account: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error fetching user account:', error);
    }
  };
  useEffect(() => {
    // Fetch token and user details when the component mounts
    fetchToken();
  }, []);

  useEffect(() => {
    fetchUserAccount();
  }, [token]);

 
  return (
    <View style={styles.profileimagesec}>
      <Image
        source={require('../assets/profile.png')}
        style={styles.profileimage}
      />
      <Text style={styles.profileText1}>{'User - '}{mobileNumber}</Text>
      {/* <Text style={styles.profileText}>{email}</Text> */}
      <Text style={styles.profileText}>{mobileNumber}</Text>
    </View>
  );
};

const CustomDrawerContent = (props) => {
  return (
    <View style={styles.drawerContent}>
      <UserInfo />
      <DrawerContentScrollView {...props}>
        <DrawerItemList
          {...props}
          itemStyle={styles.drawerItem}
          labelStyle={styles.drawerLabel}
        />
      </DrawerContentScrollView>
    </View>
  );
};

const DrawerNavigation = () => {
  return (
    
    <Drawer.Navigator
    initialRouteName="Home"
    drawerPosition="right"
    drawerType="slide"
    headerMode="none"
    screenOptions={{
      drawerStyle: {
        backgroundColor: '#fff',
        width: 320,
        paddingTop: 30,
        paddingLeft: 7,
        paddingRight: 10,
      },
      drawerActiveTintColor: '#9252AA',
      drawerActiveBackgroundColor: '#fff',
      headerTintColor: '#9252AA',
      headerTitleStyle: {
        fontWeight: '700',
      },
    }}
    tabBarOptions={{
      activeTintColor: '#9252AA', // Active tab text color
      style: {
        marginBottom: -5, // Adjust space at the bottom of each tab
        paddingBottom: 0,
      },
      labelStyle: {
        fontWeight: '800',
        fontSize: 37, // Set font size to 30px
        marginLeft: -5, // Adjust space between icon and label
        color: "#000",
      },
    }}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen
      name="Home"
      component={Home}
      options={{
        drawerIcon: ({ focused, size }) => (
          <Image
            source={require('../assets/Profilemenu.png')}
            style={{ height: 24, width: 24 }}
          />
        ),
        headerShown: false,
        tabBarLabel: 'Home',
      }}
    />
    <Drawer.Screen
      name="Profile"
      component={Profile}
      options={{
        drawerIcon: ({ focused, size }) => (
          <Image
            source={require('../assets/Message.png')}
            style={{ height: 24, width: 24 }}
          />
        ),
        headerShown: false,
        tabBarLabel: 'Profile',
      }}
    />
    <Drawer.Screen
      name="My Order"
      component={Orderlist}
      options={{
        drawerIcon: ({ focused, size }) => (
          <Image
            source={require('../assets/Document.png')}
            style={{ height: 20, width: 20 }}
          />
        ),
        headerShown:false,
        tabBarLabel: 'My Order',
      }}
    />
     <Drawer.Screen
        name="Contact"
        component={Contact}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Image
              source={require('../assets/Message.png')}
              style={{ height: 24, width: 24 }}
            />
          ),
          headerShown:false,
          tabBarLabel: 'Contact',

        }
      }
      />
       <Drawer.Screen
        name="Helps & FAQs"
        component={Faq}
        options={{
          drawerIcon: ({ focused, size }) => (
            <Image
              source={require('../assets/Helps.png')}
              style={{ height: 24, width: 24 }}
            />
          ),
          headerShown:false,
          tabBarLabel: 'Helps & FAQs',
        }
      }
      />
     
      
    {/* Add other Drawer.Screen components with similar options */}
  </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  profileimagesec: {
    padding: 10,
  },
  profileimage: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderWidth:2,
    borderColor:"#9252AA",
    // borderRadius: 200,
  },
  profileText: {
    color: '#9EA1B1',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  profileText1: {
    color: '#9252AA',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
  },
});

export default DrawerNavigation;