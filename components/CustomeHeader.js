import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { SafeAreaView } from 'react-native';
import { getCurrentPosition } from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
const CustomHeader = ({ title, navigation }) => {

  const [currentAddress, setCurrentAddress] = useState('');
  const route = useRoute();
  const GOOGLE_MAP_KEY = "AIzaSyBmHupwMPDVmKEryBTT9LlIeQITS3olFeY"
  useEffect(() => {
    Geocoder.init(GOOGLE_MAP_KEY);
    getCurrentLocation()
    checkAndRequestLocationPermission();
  }, []);
  const checkAndRequestLocationPermission = async () => {
    try {
      const permissionResult = await check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );

      if (permissionResult === RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        requestLocationPermission();
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const permissionResult = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );

      if (permissionResult === RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        console.warn('Location permission denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };


  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        Geocoder.from(latitude, longitude)
          .then((response) => {
            const address = response.results[0].formatted_address;
            setCurrentAddress(address);
          })
          .catch((error) => console.warn('Error fetching location address:', error));
      },
      (error) => console.log('Error getting current location:', error),
      { enableHighAccuracy: true, timeout: 10000000, maximumAge: 10000000000000 }
    );
  };

  const handleBackPress = () => {
    if (title === "Profile" || title === "Contact" || title === "Order History") {
      navigation.navigate('Home');
    }
    else {
      navigation.goBack();
    }
  };

  const handleDrawerPress = () => {
    navigation.openDrawer();
  };

  return (
    
    <LinearGradient
      colors={['#6730B2', '#EE7464']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerContainer}
    >
      {route.name === 'Home' ? (
        <View style={{ flexDirection: 'row', alignItems: "center"  , justifyContent:"flex-start" , paddingLeft:10 , paddingRight:20 }}>
          <View>
            <Pressable onPress={handleDrawerPress}>
              <Image
                source={require('../assets/menu-icon-img.png')}
                style={styles.menuimage}
              />
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: "center" }}>
            <Image
              source={require('../assets/Location.png')}
              style={{ width: 20, height: 20, marginRight: 4 }}
            />
            <Text style={{ color: "white", fontSize: 14, fontWeight: "400" }}>
              {/* {currentAddress} */}
              {currentAddress.length > 38 ? currentAddress.slice(0, 38) + '...' : currentAddress}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.headerContainer}>
          <Pressable onPress={handleBackPress}>
            <Image
              source={require('../assets/back_arrow.png')}
              style={styles.image}
            />
          </Pressable>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      )}


    </LinearGradient>

  );
};

const styles = StyleSheet.create({
  headerBackground: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 57,
  },
  headerTitle: {
    fontSize: 15,
    color: 'white',
    fontWeight: '500',
    marginLeft: -5,
  },
  image: {
    height: 60,
    width: 60,
    marginLeft: 8,
    marginTop: 15,
  },
  menuimage: {
    height: 30,
    width: 30,
    marginRight:12
  },
});

export default CustomHeader;