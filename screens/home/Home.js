import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ImageBackground, TouchableHighlight, Pressable, Image, BackHandler, TouchableOpacity, ScrollView } from 'react-native';
import CarouselComponent from '../dialog/CarouselComponent';
import CustomHeader from '../../components/CustomeHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, UPDATE_USER_DETAIL_ENDPOINT, GET_USER_DETAIL_ENDPOINT, ORDERLIST_ENDPOINT } from '../../utils/ApiConstants';

const Home = ({ navigation }) => {

  const [token, setToken] = useState('')
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

  // Function to fetch user details
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
        
        AsyncStorage.setItem("userID", userData.data._id);
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
    // Fetch token and user details when the component mounts
    fetchUserAccount();
    
  }, [token]);

  
  const [service, setService] = useState([
    { id: '1', image: require('../../assets/decoration.png'), name: 'Decoration', openLink: 'DecorationPage', category: "decoration" },
    { id: '2', image: require('../../assets/chefforparty.png'), name: 'Chef for Party', openLink: 'CreateOrder', category: "chef" },
    { id: '3', image: require('../../assets/hospitality-service.png'), name: 'Hospitality Services', openLink: 'HospitalityService', category: "hospitalityService" },
    { id: '4', image: require('../../assets/fooddeliveryhome.png'), name: 'Food Delivery', openLink: 'FoodDelivery', category: "fooddelivery" },
    { id: '5', image: require('../../assets/gift.png'), name: 'Gift & Party Supplies', openLink: 'Gifts', category: "gift" },
   { id: '6', image: require('../../assets/entainment.png'), name: 'Entertainment', openLink: 'Entertainment', category: "enterntainment" },
  ]);

  const openCat = (item) => {
    navigation.navigate(item.openLink, { category: item.category });

  };

  const [currentAddress, setCurrentAddress] = useState(null);

  
  const bookNowData = [
    { id: '1', image: require('../../assets/homebanner1.png'), name: 'Decoration', text: "Book Decorations for your Events", openLink: 'DecorationPage', category: "decoration" },
   { id: '2', image: require('../../assets/homebanner2.png'), name: 'Chef for Party',text: "Book Chef for party - Food by Trained Chef", openLink: 'CreateOrder', category: "chef" },
   { id: '3', image: require('../../assets/homebanner4.png'), name: 'Hospitality Services', text: "Waiter/Cleaner/Helper - Professionals at your home",  openLink: 'HospitalityService', category: "hospitalityService" },
   // { id: '4', image: require('../../assets/homebanner3.png'), name: 'Food Delivery', text: "Food Delivery - Starting at just Rs 300 per person with multiple dish options", openLink: 'FoodDelivery', category: "foodDelivery" },
   // { id: '5', image: require('../../assets/homebanner5.png'), name: 'Gift & Party Supplies',text: "Buy Gifts to Surprise", openLink: 'Gifts', category: "gifts" },
   // { id: '6', image: require('../../assets/homebanner5.png'), name: 'Entertainment', text: "Entertainment", openLink: 'Entertainment', category: "enterntainment" },
 ];

  const popularDishes = [
    { id: '1', image: require('../../assets/homeslider2-firstimg.png') },
    { id: '2', image: require('../../assets/homeslider2-secondimg.png') },
    { id: '3', image: require('../../assets/homeslider2-thirdimg.png') }
  ];



  const desertsData = [
    { id: '1', image: require('../../assets/burner.png') },
    { id: '2', image: require('../../assets/burner.png') },
    { id: '3', image: require('../../assets/burner.png') }
  ];

  const reviewData = [
    { id: '1', image: require('../../assets/happycustomers.png') },
    { id: '2', image: require('../../assets/happycustomers.png') },
    { id: '3', image: require('../../assets/happycustomers.png') }
  ];

  const openCreateOrder = () => {
    navigation.navigate('CreateOrder');
  }

  return (
    <ScrollView style={styles.container}>
      <CustomHeader title={"Home"} navigation={navigation} />
      <View style={{ marginTop: 2 }}>
        <CarouselComponent data={bookNowData} navigation={navigation} />
      </View>
      <View style={{ marginStart: 16, marginTop: 16 }}>
        <Text>
          <Text style={styles.normalText}>Explore Our  </Text>
          <Text style={styles.dishesText}>Services</Text>
        </Text>
      </View>
      <View style={styles.decContainer}>
        {service.map((item, index) => (
          <TouchableOpacity onPress={() => openCat(item)} style={{ width: "31%", marginBottom: 6 }}>
            <Image source={item.image} style={styles.decCatimage} />
            <Text style={{ fontSize: 11, textAlign: 'center', fontWeight: '600', paddingTop: 5, color: "#000", height: 22 }}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* celebrate section */}
      <View>
        <Image
          source={require('../../assets/celebrate.png')}
          style={{ height: 496, width: Dimensions.get('window').width, marginTop: 10 }}
        />
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.customButton} activeOpacity={1} onPress={openCreateOrder}>
            <Text style={styles.buttonText}> Book Now</Text>
          </TouchableOpacity>
        </View> */}
      </View>



      {/* howdoesitworks */}
      <View style={{ width: "100%", marginVertical: 30 }}>
        <View>
          <Image
            source={require('../../assets/how-work-icon.png')}
            style={{
              height: 90,
              width: 110,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 25 }}>
          <View style={styles.box}>
            <ImageBackground
              source={require('../../assets/hw-bg.png')}
              style={styles.imageBackground}
            >
              <View style={styles.content}>
                <Image
                  source={require('../../assets/how1.png')}
                  style={styles.hwicon}
                />
                <Text style={styles.hwheading}>Select Service</Text>
                <Text style={styles.hwtext}>Select from the wide range of services and dishes</Text>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.box}>
            <ImageBackground
              source={require('../../assets/hw-bg.png')}
              style={styles.imageBackground}
            >
              <View style={styles.content}>
                <Image
                  source={require('../../assets/how2.png')}
                  style={styles.hwicon}
                />
                <Text style={styles.hwheading}>Book a slot</Text>
                <Text style={styles.hwtext}>Pick your preferred date and time for service</Text>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.box}>
            <ImageBackground
              source={require('../../assets/hw-bg.png')}
              style={styles.imageBackground}
            >
              <View style={styles.content}>
                <Image
                  source={require('../../assets/how3.png')}
                  style={styles.hwicon}
                />
                <Text style={styles.hwheading}>Confirm Order</Text>
                <Text style={styles.hwtext}>Confirm your order and rest back we ll take it from here</Text>
              </View>
            </ImageBackground>
          </View>
        </View>
      </View>


      {/* why hora */}

      <TouchableHighlight onPress={openCreateOrder}>
        <Image
          source={require('../../assets/whyHora.png')}
          style={{
            height: 460,
            width: Dimensions.get('window').width,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </TouchableHighlight>


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  normalText: { color: '#323643', fontSize: 14, fontWeight: '600' },
  dishesText: { color: '#9252AA', fontSize: 14, fontWeight: '600' },
  customButton: {
    height: 34,
    width: 138,
    marginTop: 10,
    backgroundColor: '#9252AA',
    marginHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 16,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  decContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: "center",
    marginTop: 10,
  },
  decCatimage: {
    width: "100%",
    height: Dimensions.get('window').height*0.13,
    borderRadius: 10,
  },
  box: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 20, // Adjust as needed
    borderColor: '#E8E7E7',
    borderRadius: 9,
    borderWidth: 1,
    overflow: 'hidden', // Ensure content doesn't overflow the box
  },
  imageBackground: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 5,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  content: {
    textAlign: 'center',
  },
  hwicon: {
    height: 70,
    width: 80,
    marginBottom: 10, // Adjust as needed
    marginLeft: "auto",
    marginRight: "auto",
  },
  hwheading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
    marginBottom: 5, // Adjust as needed
    textAlign: 'center',
  },
  hwtext: {
    color: '#8C8C8C',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default Home;

