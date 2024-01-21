import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  FlatList,
  Linking,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import axios from 'axios';
import CustomHeader from '../../components/CustomeHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  BASE_URL,
  GET_ADDRESS_LIST,
  API_SUCCESS_CODE,
  CONFIRM_ORDER_ENDPOINT,
  PAYMENT,
  PAYMENT_STATUS,
} from '../../utils/ApiConstants';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {getCurrentPosition} from 'react-native-geolocation-service';
import OrderWarning from '../dialog/OrderWarning';

const HospitalityService = ({navigation}) => {
  const [addresses, setAddresses] = useState([]);

  const [selectedTimeWaiter, setSelectedTimeWaiter] = useState(new Date());
  const [selectedTimeCleaner, setSelectedTimeCleaner] = useState(new Date());
  const [selectedTimeBartender, setSelectedTimeBartender] = useState(
    new Date(),
  );
  const [showDatePickerWaiter, setShowDatePickerWaiter] = useState(false);
  const [showTimePickerWaiter, setShowTimePickerWaiter] = useState(false);
  const [showDatePickerBartender, setShowDatePickerBartender] = useState(false);
  const [showTimePickerBartender, setShowTimePickerBartender] = useState(false);
  const [showDatePickerCleaner, setShowDatePickerCleaner] = useState(false);
  const [showTimePickerCleaner, setShowTimePickerCleaner] = useState(false);
  const [isTimeValidWaiter, setTimeValidWaiter] = useState(null);
  const [isDateValidWaiter, setDateValidWaiter] = useState(null);
  const [isTimeValidBartender, setTimeValidBartender] = useState(null);
  const [isDateValidBartender, setDateValidBartender] = useState(null);
  const [isTimeValidCleaner, setTimeValidCleaner] = useState(null);
  const [isDateValidCleaner, setDateValidCleaner] = useState(null);
  const [errorTextWaiter, setErrorTextWaiter] = useState(null);
  const [errorTextBartender, setErrorTextBartender] = useState(null);
  const [errorTextCleaner, setErrorTextCleaner] = useState(null);
  const [isDatePressed, setIsDatePressed] = useState(false);
  const [isTimePressed, setIsTimePressed] = useState(false);
  const bottomSheetRef = useRef(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const today = new Date();
  const minimumDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );
  const [selectedDateWaiter, setSelectedDateWaiter] = useState(minimumDate);
  const [selectedDateCleaner, setSelectedDateCleaner] = useState(minimumDate);
  const [selectedDateBartender, setSelectedDateBartender] =
    useState(minimumDate);
  const [completeAddress, setCompleteAddress] = useState([]);
  const [add, setAdd] = useState('');
  let [addId, setAddId] = useState('');
  const [i, setI] = useState(0);
  let addressID;
  const [cityStatus, setCityStatus] = useState(0);
  const [isWarningVisible, setWarningVisible] = useState(false);
  const [isWarningVisibleService, setWarningVisibleService] = useState(false);

  const [categoryCounts, setCategoryCounts] = useState({
    waiter: 0,
    bartender: 0,
    cleaner: 0,
  });
  const handleWarningClose = () => {
    setWarningVisible(false);
    setWarningVisibleService(false);
  };

  const editAddress = address => {
    bottomSheetRef.current.close();
    navigation.navigate('ConfirmLocation', {data: address});
  };

  const decCat = [
    {
      id: '1',
      image: require('../../assets/waiter.jpeg'),
      name: 'Waiter',
      category: 'waiter',
      price: 800,
    },
    {
      id: '2',
      image: require('../../assets/bartender.jpg'),
      name: 'Bartender',
      category: 'bartender',
      price: 1500,
    },
    {
      id: '3',
      image: require('../../assets/cleaner.jpg'),
      name: 'Cleaner',
      category: 'cleaner',
      price: 800,
    },
  ];

  const increasePeopleCount = category => {
    setCategoryCounts(prevCounts => ({
      ...prevCounts,
      [category]: prevCounts[category] + 1,
    }));
  };

				   
											   
						 
						 
		
	  
																	  

							 
																			  
			 
									
						 
																
		
			 
			
							   
	 


	  

  const AddressItem = ({address, selected, onSelect}) => (
    <TouchableOpacity onPress={onSelect}>
      <View style={[styles.addresscontainer, selected && styles.selectedContainer]}>
        <View
          style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
          <Text style={[styles.headingText, selected && styles.selectedText]}>
            Delivers To
          </Text>
          <TouchableOpacity
            onPress={() => editAddress(address)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
            }}>
            <Image
              source={
                selected
                  ? require('../../assets/editSelected.png')
                  : require('../../assets/edit.png')
              }
              style={{height: 14, width: 14}}
            />
            <Text style={[styles.editText, selected && styles.selectedText]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            marginTop: 10,
            marginStart: 5,
            marginEnd: 16,
            paddingBottom: 25,
            alignItems: 'center',
          }}>
          <View>
            <Image
              source={
                address.title === 'Home'
                  ? selected
                    ? require('../../assets/homeSelected.png')
                    : require('../../assets/homelabel.png')
                  : address.title === 'Hotel'
                  ? selected
                    ? require('../../assets/homeSelected.png')
                    : require('../../assets/hotel.png')
                  : address.title === 'Work'
                  ? selected
                    ? require('../../assets/homeSelected.png')
                    : require('../../assets/homelabel.png')
                  : require('../../assets/hotel.png')
              }
              style={styles.homeIcon}
            />
          </View>
          <View>
            <Text
              style={[styles.parallelText, selected && styles.selectedText]}>
              {address.title}
            </Text>
            <Text
              numberOfLines={2}
              style={[styles.multiLineText, selected && styles.selectedText]}>
              {address.address2}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const BottomSheetContent = ({data, onSelectAddress}) => (
    <View style={{flexDirection: 'column'}}>
      <View style={{marginHorizontal: 40}}>
        <Text style={{fontSize: 13, fontWeight: '600', color: 'black'}}>
          Saved Address
        </Text>
      </View>
      <View style={{marginTop: 19}}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <AddressItem
              address={item}
              onSelect={() => onSelectAddress(item)}
              selected={false}
            />
          )}></FlatList>
      </View>
    </View>
  );

  useEffect(() => {
    Geocoder.init('AIzaSyBmHupwMPDVmKEryBTT9LlIeQITS3olFeY');
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;

        Geocoder.from(latitude, longitude)
          .then(response => {
            const address = response.results[0].formatted_address;
            setCompleteAddress(response.results[0].address_components);
            setAdd(address);
            //setCurrentAddress(address);
          })
          .catch(error =>
            console.warn('Error fetching location address:', error),
          );
      },
      error => console.log('Error getting current location:', error),
      {
        enableHighAccuracy: true,
        timeout: 100000000000000000,
        maximumAge: 1000000000000000000000000,
      },
    );
  };

  const fetchAddressesFromAPI = async () => {
    try {
      const url = BASE_URL + GET_ADDRESS_LIST;
      const requestData = {
        page: '1',
      };
      const token = await AsyncStorage.getItem('token');

      console.warn(token);
      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      if (response.status == API_SUCCESS_CODE) {
        setAddresses(response.data.data.address);
      }
    } catch (error) {
      console.log('Error Fetching Data:', error.message);
    }
  };

  const openBottomSheet = () => {
    bottomSheetRef.current.open();
    fetchAddressesFromAPI();
  };

  const handleSelectAddress = address => {
    setI(1);
    setAdd(address.address2);

    

    addresses.forEach(element => {
      if (
        element.address1 === address.address2 ||
        element.address2 === address.address2
      ) {
        addressID = element._id;
        setAddId(addressID);
      }
    });

    
    setCurrentAddress(address.address2);
    bottomSheetRef.current.close();
  };

  const handleConfirmOrder = async merchantTransactionId => {
    if (addId === '') {
      addId = addressID;
    }
    try {
      const message = await checkPaymentStatus(merchantTransactionId);

      const storedUserID = await AsyncStorage.getItem('userID');
      const locality = await AsyncStorage.getItem("Locality");
      const noOfWaiter = categoryCounts['waiter'];
      const noOfBartender = categoryCounts['bartender'];
      const noOfCleaner = categoryCounts['cleaner'];

      let responseWaiter;
      let responseBartender;
      let responseCleaner;

      if (message === 'PAYMENT_SUCCESS') {
        if (noOfWaiter !== 0) {
          const url = BASE_URL + CONFIRM_ORDER_ENDPOINT;
          const requestData = {
            toId: '',
            order_time: selectedTimeWaiter.toLocaleTimeString(),
            no_of_people: noOfWaiter,
            type: 3,
            fromId: storedUserID,
            is_discount: '0',
            addressId: addId,
            order_date: selectedDateWaiter.toDateString(),
            no_of_burner: 0,
            order_locality: locality,
            total_amount: noOfWaiter * 800,
            orderApplianceIds: [],
            payable_amount: noOfWaiter * 800,
            is_gst: '0',
            order_type: true,
            items: [],
          };
          
          const token = await AsyncStorage.getItem('token');

          responseWaiter = await axios.post(url, requestData, {
            headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          });
            }
          if (noOfBartender !== 0) {
            const url = BASE_URL + CONFIRM_ORDER_ENDPOINT;
            const requestData = {
              toId: '',
              order_time: selectedTimeBartender.toLocaleTimeString(),
              no_of_people: noOfBartender,
              type: 4,
              fromId: storedUserID,
              is_discount: '0',
              addressId: addId,
              order_date: selectedDateBartender.toDateString(),
              no_of_burner: 0,
              order_locality: locality,
              total_amount: noOfBartender * 1500,
              orderApplianceIds: [],
              payable_amount: noOfBartender * 1500,
              is_gst: '0',
              order_type: true,
              items: [],
            };
            
            const token = await AsyncStorage.getItem('token');

            responseBartender = await axios.post(url, requestData, {
              headers: {
                'Content-Type': 'application/json',
                authorization: token,
              },
            });
        }
        
        if (noOfCleaner !== 0) {
          const url = BASE_URL + CONFIRM_ORDER_ENDPOINT;
          const requestData = {
            toId: '',
            order_time: selectedTimeCleaner.toLocaleTimeString(),
            no_of_people: noOfCleaner,
            type: 5,
            fromId: storedUserID,
            is_discount: '0',
            addressId: addId,
            order_date: selectedDateCleaner.toDateString(),
            no_of_burner: 0,
            order_locality: locality,
            total_amount: noOfCleaner * 800,
            orderApplianceIds: [],
            payable_amount: noOfCleaner * 800,
            is_gst: '0',
            order_type: true,
            items: [],
          };
          
          const token = await AsyncStorage.getItem('token');

          responseCleaner = await axios.post(url, requestData, {
            headers: {
              'Content-Type': 'application/json',
              authorization: token,
            },
          });}
						
									 
								 
								 
															   
								
								   
												
									  
												  
							
								 
						  
				
			  
																

  
              if ((responseWaiter.status !== undefined && responseWaiter.status === API_SUCCESS_CODE) || (responseBartender.status !== undefined && responseBartender.status === API_SUCCESS_CODE) ||  (responseCleaner.status !== undefined &&  responseCleaner.status === API_SUCCESS_CODE))
													 
									   
				  
				 

				  
										 
											 
															  
               {
                
                navigation.navigate('ConfirmOrder');
              }
			 
		   
		 
      }
    } catch (error) {
      console.log('Error Confirming Order:', error.message);
    }
  };

  const checkPaymentStatus = async merchantTransactionId => {
    try {
      const storedUserID = await AsyncStorage.getItem('userID');
      const apiUrl = BASE_URL + PAYMENT_STATUS + '/' + merchantTransactionId;

      const pollInterval = 5000; // 5 seconds (adjust as needed)
      const pollingDuration = 300000; // 5 minutes

      const pollPaymentStatus = async () => {
        const startTime = Date.now();

        while (Date.now() - startTime < pollingDuration) {
          try {
            const response = await axios.post(
              apiUrl,
              {},
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            );

            if (response.data && response.data.message) {
              const message = response.data.message;
              console.log('API response message:', message);

              if (message === 'PAYMENT_PENDING') {
                console.log('Payment is still pending. Polling again...');
                await new Promise(resolve => setTimeout(resolve, pollInterval));
              } else {
                console.log('Payment status:', message);
                return message;
              }
            } else {
              console.log('API response does not contain a message field');
            }
          } catch (error) {
            console.error('API error:', error);
          }
        }

        // Stop polling after the specified duration
        console.log('Polling completed. Returning final result.');
        return 'PAYMENT_POLLING_TIMEOUT';
      };

      // Start polling and return the final result after polling completes
      return await pollPaymentStatus();
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error; // Rethrow the error for the caller to handle
    }
  };

  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  const onContinueClick = async () => {
    if (i === 0) {
      setWarningVisible(true);
    } else if (
      categoryCounts['waiter'] +
        categoryCounts['bartender'] +
        categoryCounts['cleaner'] ===
      0
    ) {
      setWarningVisibleService(true);
    } else {
      const totalPrice = getTotalAmount();
      const apiUrl = BASE_URL + PAYMENT;

      const storedUserID = await AsyncStorage.getItem('userID');
      //const locality = await AsyncStorage.getItem("Locality");
      const phoneNumber = await AsyncStorage.getItem('mobileNumber');
      
      const randomInteger =
        Math.floor(getRandomNumber(1, 1000000000000)) +
        Math.floor(getRandomNumber(1, 1000000000000)) +
        Math.floor(getRandomNumber(1, 1000000000000));

      let merchantTransactionId = randomInteger;
      const requestData = {
        user_id: storedUserID,
        price: Math.round(totalPrice * 0.2),
        phone: phoneNumber,
        name: storedUserID,
        merchantTransactionId: merchantTransactionId,
      };

      

      try {
        const response = await axios.post(apiUrl, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        
        let url = response.request.responseURL;

        handleConfirmOrder(merchantTransactionId);
        Linking.openURL(url).then(supported => {
          if (!supported) {
            console.log(`Cannot handle URL: ${url}`);
          } else {
            console.log(`Opened URL: ${url}`);
          }
        });
      } catch (error) {
        // Handle errors
        console.error('API error:', error);
      }
    }
  };

  const changeLocation = async () => {
    try {
      let address = await AsyncStorage.getItem('Address');

      const locality = completeAddress[4]?.long_name || '';
      const city = completeAddress[5]?.long_name || '';
      const state = completeAddress[7]?.long_name || '';
      const pincode = completeAddress[9]?.long_name || '';

      

      await Promise.all([
        AsyncStorage.setItem('City', city),
        AsyncStorage.setItem('State', state),
        AsyncStorage.setItem('Pincode', pincode),
        AsyncStorage.setItem('Locality', locality),
      ]);

      openBottomSheet();
    } catch (error) {
      console.error('Error fetching or setting data in AsyncStorage:', error);
    }
  };

  const addAddress = () => {
    bottomSheetRef.current.close();
    navigation.navigate('ConfirmLocation', {data: null});
  };

  const decreasePeopleCount = category => {
    if (categoryCounts[category] !== 0) {
      setCategoryCounts(prevCounts => ({
        ...prevCounts,
        [category]: prevCounts[category] - 1,
      }));
    }
  };

  const checkIsDateValid = (selectedDate, selectedTime, type) => {
    const currentTime = new Date();
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(
      selectedTime.getHours(),
      selectedTime.getMinutes(),
    );
    const timeDifference = selectedDateTime.getTime() - currentTime.getTime();
    const isDateGreaterThan24Hours = timeDifference >= 24 * 60 * 60 * 1000;
    if (type === 1) {
      setDateValidWaiter(isDateGreaterThan24Hours);
    } else if (type === 2) {
      setDateValidBartender(isDateGreaterThan24Hours);
    } else if (type === 3) {
      setDateValidCleaner(isDateGreaterThan24Hours);
    }
    return isDateGreaterThan24Hours;
  };

  const checkIsTimeValid = (selectedTime, type) => {
    const isTimeBetweenRange =
      selectedTime.getHours() >= 7 && selectedTime.getHours() <= 22;

    if (type === 1) {
      setTimeValidWaiter(isTimeBetweenRange);
    } else if (type === 2) {
      setTimeValidBartender(isTimeBetweenRange);
    } else if (type === 3) {
      setTimeValidCleaner(isTimeBetweenRange);
    }
    return isTimeBetweenRange;
  };

  const handleDateChangeWaiter = (event, date) => {
    if (date !== undefined) {
      setSelectedDateWaiter(date);
      setShowDatePickerWaiter(false);

      const isDateValid = checkIsDateValid(
        selectedDateWaiter,
        selectedTimeWaiter,
        1,
      );
      const isTimeValid = checkIsTimeValid(selectedTimeWaiter, 1);

      if (!isDateValid) {
        setErrorTextWaiter('Order can be placed at least 24 hours in advance.');
        return;
      } else if (!isTimeValid) {
        setErrorTextWaiter(
          '*Order can be placed only between 7:00 AM to 10:00 PM',
        );
        return;
      } else {
        setErrorTextWaiter(null);
      }
    }
  };

  const handleDateChangeBartender = (event, date) => {
    if (date !== undefined) {
      setSelectedDateBartender(date);
      setShowDatePickerBartender(false);

      const isDateValid = checkIsDateValid(
        selectedDateBartender,
        selectedTimeBartender,
        2,
      );
      const isTimeValid = checkIsTimeValid(selectedTimeBartender, 2);

      if (!isDateValid) {
        setErrorTextBartender(
          'Order can be placed at least 24 hours in advance.',
        );
        return;
      } else if (!isTimeValid) {
        setErrorTextBartender(
          '*Order can be placed only between 7:00 AM to 10:00 PM',
        );
        return;
      } else {
        setErrorTextBartender(null);
      }
    }
  };

  const handleDateChangeCleaner = (event, date) => {
    if (date !== undefined) {
      setSelectedDateCleaner(date);
      setShowDatePickerCleaner(false);

      const isDateValid = checkIsDateValid(
        selectedDateCleaner,
        selectedTimeCleaner,
        3,
      );
      const isTimeValid = checkIsTimeValid(selectedTimeCleaner, 3);

      if (!isDateValid) {
        setErrorTextCleaner(
          'Order can be placed at least 24 hours in advance.',
        );
        return;
      } else if (!isTimeValid) {
        setErrorTextCleaner(
          '*Order can be placed only between 7:00 AM to 10:00 PM',
        );
        return;
      } else {
        setErrorTextCleaner(null);
      }
    }
  };

  const handleTimeChangeWaiter = (event, time) => {
    if (time !== undefined) {
      setSelectedTimeWaiter(time);
      setShowTimePickerWaiter(false);

      const isDateValid = checkIsDateValid(
        selectedDateWaiter,
        selectedTimeWaiter,
        1,
      );
      const isTimeValid = checkIsTimeValid(selectedTimeWaiter, 1);

      if (!isDateValid) {
        setErrorTextWaiter('Order can be placed at least 24 hours in advance.');
        return;
      } else if (!isTimeValid) {
        setErrorTextWaiter(
          '*Order can be placed only between 7:00 AM to 10:00 PM',
        );
        return;
      } else {
        setErrorTextWaiter(null);
      }
    }
  };
  const handleTimeChangeBartender = (event, time) => {
    if (time !== undefined) {
      setSelectedTimeBartender(time);
      setShowTimePickerBartender(false);

      const isDateValid = checkIsDateValid(
        selectedDateBartender,
        selectedTimeBartender,
        2,
      );
      const isTimeValid = checkIsTimeValid(selectedTimeBartender, 2);

      if (!isDateValid) {
        setErrorTextBartender(
          'Order can be placed at least 24 hours in advance.',
        );
        return;
      } else if (!isTimeValid) {
        setErrorTextBartender(
          '*Order can be placed only between 7:00 AM to 10:00 PM',
        );
        return;
      } else {
        setErrorTextBartender(null);
      }
    }
  };
  const handleTimeChangeCleaner = (event, time) => {
    if (time !== undefined) {
      setSelectedTimeCleaner(time);
      setShowTimePickerCleaner(false);

      const isDateValid = checkIsDateValid(
        selectedDateCleaner,
        selectedTimeCleaner,
        3,
      );
      const isTimeValid = checkIsTimeValid(selectedTimeCleaner, 3);

      if (!isDateValid) {
        setErrorTextCleaner(
          'Order can be placed at least 24 hours in advance.',
        );
        return;
      } else if (!isTimeValid) {
        setErrorTextCleaner(
          '*Order can be placed only between 7:00 AM to 10:00 PM',
        );
        return;
      } else {
        setErrorTextCleaner(null);
      }
    }
  };

  function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (12 AM)
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')} ${ampm}`;
  }

  const getTotalAmount = () => {
    return decCat.reduce(
      (total, item) => total + item.price * categoryCounts[item.category],
      0,
    );
  };

  const getAdvanceAmount = () => {
    const advanceAmount = categoryCounts["waiter"] * 160 + categoryCounts["bartender"]*450 + categoryCounts["cleaner"] * 160;

    return advanceAmount;
  };

  return (
    <ScrollView>
      <CustomHeader title={'Hospitality Service'} navigation={navigation} />
	  <View  style={styles.view1}>
      <Image style={styles.image1} source={require('../../assets/info.png')} />

            <Text  style={styles.text1}>{'Services billed for 4 hours from arrival.'}</Text></View>
     
																			   

																								   
	  
      <View style={styles.container}>
        <View style={styles.dataShow}>
          <View style={styles.decImageContainer}>
            <View>
              <View style={styles.decContainer}>
			   
                <View style={{width:"10%"}}>
											  
                  <Image source={decCat[0].image} style={styles.decCatimage} />

				  </View>
                  <View>

						 
						
                  <Text style={styles.itemName}>{decCat[0].name}</Text>
				  <Text style={styles.itemPrice}>Price: {decCat[0].price}</Text>
																				
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginRight: 9,
                    }}>
                    <TouchableOpacity
                      onPress={() => decreasePeopleCount(decCat[0].category)}
                      activeOpacity={1}>
                      <Image
                        source={require('../../assets/ic_minus.png')}
                        style={{height: 22, width: 22, marginLeft: 2}}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        marginLeft: 5,
                        lineHeight: 23,
                        fontSize: 18,
                        marginTop: 2,
                        width: 22,
                        textAlign: 'center',
                        color: 'black',
                      }}>
                      {categoryCounts[decCat[0].category]}
                    </Text>
                    <TouchableOpacity
                      onPress={() => increasePeopleCount(decCat[0].category)}
                      activeOpacity={1}>
                      <Image
                        source={require('../../assets/plus.png')}
                        style={{height: 22, width: 22, marginLeft: 5}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.selectedDate}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => setShowDatePickerWaiter(true)}
                    activeOpacity={1}>
                    <View
                      style={{
                        marginStart: 0,
                        marginEnd: 18,
                        flexDirection: 'column',
                        paddingHorizontal: 17,
                        backgroundColor: 'white',
                        borderColor:
                          isDateValidWaiter != null &&
                          isDateValidWaiter == false
                            ? '#FF3636'
                            : '#F6ECEC',
                        borderRadius: 10,
                        borderWidth: 1,
                        paddingBottom: 9,
                      }}>
                      <Text
                        style={{
                          paddingTop: 4,
                          color: '#9252AA',
                          fontWeight: '500',
                          fontSize: 10,
                        }}>
                        Booking Date
                      </Text>
                      <View style={{flexDirection: 'row', marginTop: 1}}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: isDatePressed ? '#383838' : 'grey',
                          }}>
                          {selectedDateWaiter.toLocaleDateString()}
                        </Text>

                        <Image
                          source={require('../../assets/ic_calendar.png')}
                          style={{height: 19, width: 19, marginLeft: 17}}
                        />
                        {showDatePickerWaiter && (
                          <DateTimePicker
                            value={selectedDateWaiter}
                            mode="date"
                            display="default"
                            minimumDate={minimumDate}
                            onChange={handleDateChangeWaiter}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => setShowTimePickerWaiter(true)}
                      activeOpacity={1}>
                      <View
                        style={{
                          flexDirection: 'column',
                          paddingHorizontal: 21,
                          backgroundColor: 'white',
                          borderColor:
                            isTimeValidWaiter != null &&
                            isTimeValidWaiter == false
                              ? '#FF3636'
                              : '#F6ECEC',
                          borderRadius: 10,
                          borderWidth: 1,
                          paddingBottom: 9,
                        }}>
                        <Text
                          style={{
                            paddingTop: 4,
                            color: '#9252AA',
                            fontWeight: '500',
                            fontSize: 10,
                          }}>
                          Arrival time
                        </Text>
                        <View style={{flexDirection: 'row', marginTop: 1}}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              color: isTimePressed ? '#383838' : 'grey',
                            }}>
                            {formatTime(selectedTimeWaiter)}
                          </Text>

                          <Image
                            source={require('../../assets/clock.png')}
                            style={{height: 19, width: 19, marginLeft: 17}}
                          />
                          {showTimePickerWaiter && (
                            <DateTimePicker
                              value={selectedTimeWaiter}
                              mode="time"
                              display="default"
                              onChange={handleTimeChangeWaiter}
                            />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                {errorTextWaiter != null && (
                  <View style={{marginStart: 21}}>
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: '400',
                        color: '#FF2F2F',
                        marginTop: 4,
                      }}>
                      {errorTextWaiter}
                    </Text>
                  </View>
                )}
              </View>
			  <View style={styles.view2}>
                <Text style={styles.text2}>{'(Additional hour of service charged at 150.)'}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 2,
                  marginBottom: 20,
                  marginLeft: 1,
                  marginRight: 1,
                }}>
                <Image
                  style={styles.verticalSeparator}
                  source={require('../../assets/verticalSeparator.png')}></Image>
              </View>
            </View>
          </View>
          <View style={styles.decImageContainer}>
            <View>
              <View style={styles.decContainer}>
                 <View style={{width:"10%"}}>
                  <Image source={decCat[1].image} style={styles.decCatimage} />
				  </View>
                  <View>
                  <Text style={styles.itemName}>{decCat[1].name}</Text>
				  <Text style={styles.itemPrice}>Price: {decCat[1].price}</Text>

                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginRight: 9,
                    }}>
                    <TouchableOpacity
                      onPress={() => decreasePeopleCount(decCat[1].category)}
                      activeOpacity={1}>
                      <Image
                        source={require('../../assets/ic_minus.png')}
                        style={{height: 22, width: 22, marginLeft: 2}}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        marginLeft: 5,
                        lineHeight: 23,
                        fontSize: 18,
                        marginTop: 2,
                        width: 22,
                        textAlign: 'center',
                        color: 'black',
                      }}>
                      {categoryCounts[decCat[1].category]}
                    </Text>
                    <TouchableOpacity
                      onPress={() => increasePeopleCount(decCat[1].category)}
                      activeOpacity={1}>
                      <Image
                        source={require('../../assets/plus.png')}
                        style={{height: 22, width: 22, marginLeft: 5}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.selectedDate}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => setShowDatePickerBartender(true)}
                    activeOpacity={1}>
                    <View
                      style={{
                        marginStart: 0,
                        marginEnd: 18,
                        flexDirection: 'column',
                        paddingHorizontal: 17,
                        backgroundColor: 'white',
                        borderColor:
                          isDateValidBartender != null &&
                          isDateValidBartender == false
                            ? '#FF3636'
                            : '#F6ECEC',
                        borderRadius: 10,
                        borderWidth: 1,
                        paddingBottom: 9,
                      }}>
                      <Text
                        style={{
                          paddingTop: 4,
                          color: '#9252AA',
                          fontWeight: '500',
                          fontSize: 10,
                        }}>
                        Booking Date
                      </Text>
                      <View style={{flexDirection: 'row', marginTop: 1}}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: isDatePressed ? '#383838' : 'grey',
                          }}>
                          {selectedDateBartender.toLocaleDateString()}
                        </Text>

                        <Image
                          source={require('../../assets/ic_calendar.png')}
                          style={{height: 19, width: 19, marginLeft: 17}}
                        />
                        {showDatePickerBartender && (
                          <DateTimePicker
                            value={selectedDateBartender}
                            mode="date"
                            display="default"
                            minimumDate={minimumDate}
                            onChange={handleDateChangeBartender}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => setShowTimePickerBartender(true)}
                      activeOpacity={1}>
                      <View
                        style={{
                          flexDirection: 'column',
                          paddingHorizontal: 21,
                          backgroundColor: 'white',
                          borderColor:
                            isTimeValidBartender != null &&
                            isTimeValidBartender == false
                              ? '#FF3636'
                              : '#F6ECEC',
                          borderRadius: 10,
                          borderWidth: 1,
                          paddingBottom: 9,
                        }}>
                        <Text
                          style={{
                            paddingTop: 4,
                            color: '#9252AA',
                            fontWeight: '500',
                            fontSize: 10,
                          }}>
                          Arrival time
                        </Text>
                        <View style={{flexDirection: 'row', marginTop: 1}}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              color: isTimePressed ? '#383838' : 'grey',
                            }}>
                            {formatTime(selectedTimeBartender)}
                          </Text>

                          <Image
                            source={require('../../assets/clock.png')}
                            style={{height: 19, width: 19, marginLeft: 17}}
                          />
                          {showTimePickerBartender && (
                            <DateTimePicker
                              value={selectedTimeBartender}
                              mode="time"
                              display="default"
                              onChange={handleTimeChangeBartender}
                            />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                {errorTextBartender != null && (
                  <View style={{marginStart: 21}}>
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: '400',
                        color: '#FF2F2F',
                        marginTop: 4,
                      }}>
                      {errorTextBartender}
                    </Text>
                  </View>
                )}
              </View>
			  <View style={styles.view2}>
                <Text style={styles.text2}>{'(Additional hour of service charged at 350.)'}</Text>
              </View>
										 
																								  
					 
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 2,
                  marginBottom: 20,
                  marginLeft: 1,
                  marginRight: 1,
                }}>
                <Image
                  style={styles.verticalSeparator}
                  source={require('../../assets/verticalSeparator.png')}></Image>
              </View>
            </View>
          </View>
          <View style={styles.decImageContainer}>
            <View>
			<View style={styles.decContainer}>
												
              <View style={{width:"10%"}}>
                <Image source={decCat[2].image} style={styles.decCatimage} />
                </View>
				<View>
                  
                  <Text style={styles.itemName}>{decCat[2].name}</Text>
				  <Text style={styles.itemPrice}>Price: {decCat[2].price}</Text>

                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 16,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginRight: 9,
                    }}>
                    <TouchableOpacity
                      onPress={() => decreasePeopleCount(decCat[2].category)}
                      activeOpacity={1}>
                      <Image
                        source={require('../../assets/ic_minus.png')}
                        style={{height: 22, width: 22, marginLeft: 2}}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        marginLeft: 5,
                        lineHeight: 23,
                        fontSize: 18,
                        marginTop: 2,
                        width: 22,
                        textAlign: 'center',
                        color: 'black',
                      }}>
                      {categoryCounts[decCat[2].category]}
                    </Text>
                    <TouchableOpacity
                      onPress={() => increasePeopleCount(decCat[2].category)}
                      activeOpacity={1}>
                      <Image
                        source={require('../../assets/plus.png')}
                        style={{height: 22, width: 22, marginLeft: 5}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.selectedDate}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => setShowDatePickerCleaner(true)}
                    activeOpacity={1}>
                    <View
                      style={{
                        marginStart: 0,
                        marginEnd: 18,
                        flexDirection: 'column',
                        paddingHorizontal: 17,
                        backgroundColor: 'white',
                        borderColor:
                          isDateValidCleaner != null &&
                          isDateValidCleaner == false
                            ? '#FF3636'
                            : '#F6ECEC',
                        borderRadius: 10,
                        borderWidth: 1,
                        paddingBottom: 9,
                      }}>
                      <Text
                        style={{
                          paddingTop: 4,
                          color: '#9252AA',
                          fontWeight: '500',
                          fontSize: 10,
                        }}>
                        Booking Date
                      </Text>
                      <View style={{flexDirection: 'row', marginTop: 1}}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: isDatePressed ? '#383838' : 'grey',
                          }}>
                          {selectedDateCleaner.toLocaleDateString()}
                        </Text>

                        <Image
                          source={require('../../assets/ic_calendar.png')}
                          style={{height: 19, width: 19, marginLeft: 17}}
                        />
                        {showDatePickerCleaner && (
                          <DateTimePicker
                            value={selectedDateCleaner}
                            mode="date"
                            display="default"
                            minimumDate={minimumDate}
                            onChange={handleDateChangeCleaner}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => setShowTimePickerCleaner(true)}
                      activeOpacity={1}>
                      <View
                        style={{
                          flexDirection: 'column',
                          paddingHorizontal: 21,
                          backgroundColor: 'white',
                          borderColor:
                            isTimeValidCleaner != null &&
                            isTimeValidCleaner == false
                              ? '#FF3636'
                              : '#F6ECEC',
                          borderRadius: 10,
                          borderWidth: 1,
                          paddingBottom: 9,
                        }}>
                        <Text
                          style={{
                            paddingTop: 4,
                            color: '#9252AA',
                            fontWeight: '500',
                            fontSize: 10,
                          }}>
                          Arrival time
                        </Text>
                        <View style={{flexDirection: 'row', marginTop: 1}}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: 600,
                              color: isTimePressed ? '#383838' : 'grey',
                            }}>
                            {formatTime(selectedTimeCleaner)}
                          </Text>

                          <Image
                            source={require('../../assets/clock.png')}
                            style={{height: 19, width: 19, marginLeft: 17}}
                          />
                          {showTimePickerCleaner && (
                            <DateTimePicker
                              value={selectedTimeCleaner}
                              mode="time"
                              display="default"
                              onChange={handleTimeChangeCleaner}
                            />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                {errorTextCleaner != null && (
                  <View style={{marginStart: 21}}>
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: '400',
                        color: '#FF2F2F',
                        marginTop: 4,
                      }}>
                      {errorTextCleaner}
                    </Text>
                  </View>
                )}
              </View>
			  <View style={styles.view2}>
                <Text style={styles.text2}>{'(Additional hour of service charged at 150.)'}</Text>
              </View>
										 
																								  
					 
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 3,
                  marginBottom: 20,
                  marginLeft: 1,
                  marginRight: 1,
                }}>
                <Image
                  style={styles.verticalSeparator}
                  source={require('../../assets/verticalSeparator.png')}></Image>
              </View>
            </View>
          </View>
        </View>

        <View
        style={{
          flexDirection: 'column',
          width: Dimensions.get('window').width * 0.9,
          padding: 13,
          borderRadius: 6,
          borderColor: '#E6E6E6',
          borderWidth: 1,
          marginTop: 2,
          backgroundColor: '#fff',
        }}>
		 <Text style={{color: '#333', fontSize: 13, fontWeight: '700'}}>
          Serving location
        </Text>
        {currentAddress !== '' ? (
          <View
            style={{
              marginTop: 5,
              paddingStart: 11,
              paddingVertical: 6,
              backgroundColor: 'rgba(211, 75, 233, 0.10)',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#FFE1E6',
              paddingEnd: 20,
            }}>
            <Text
              style={{
                color: '#9252AA',
                fontWeight: '500',
                lineHeight: 18,
                fontSize: 13,
              }}>
              {currentAddress}
            </Text>
          </View>
        ) : (
          ''
        )}
		 <TouchableOpacity onPress={changeLocation} activeOpacity={1}>
          {currentAddress === '' ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 6,
              }}>
              <Text
                style={{
                  color: '#9252AA',
                  fontSize: 13,
                  fontWeight: '500',
                  lineHeight: 18,
                }}>
                Click here to add Location
              </Text>
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 6,
              }}>
              <Text
                style={{
                  color: '#9252AA',
                  fontSize: 13,
                  fontWeight: '500',
                  lineHeight: 18,
                }}>
                Change Location
              </Text>
            </View>
          )}
        </TouchableOpacity>
		<OrderWarning
          visible={isWarningVisible}
          title={'Please select address.'}
          buttonText={'OK!'}
          onClose={handleWarningClose}
        />
        <OrderWarning
          visible={isWarningVisibleService}
          title={'Please select atleast one service.'}
          buttonText={'OK!'}
          onClose={handleWarningClose}
        />
        <RBSheet
          ref={bottomSheetRef}
          closeOnDragDown={true}
          height={500}
          customStyles={{
            container: styles.bottomSheetContainer,
            wrapper: styles.bottomSheetWrapper,
            draggableIcon: styles.draggableIcon,
          }}>
          <View style={{flexDirection: 'column', marginBottom: 39, flex: 1}}>
            <BottomSheetContent
              data={addresses}
              onSelectAddress={handleSelectAddress}
            />
          </View>

          <View
            style={{
              justifyContent: 'center',
              marginTop: 29,
              marginBottom: 26,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => addAddress()}
              style={styles.customButton}
              activeOpacity={1}>
              <Text style={styles.buttonText}> + Add Address</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </View>
      <View style={{backgroundColor:"#fff",borderWidth:1, paddingHorizontal:10,paddingVertical:10 , marginTop:10 ,  borderColor: '#ddd',}}>
       <View style={{justifyContent:"space-between" , alignItems:"center" , flexDirection:"row"}}>
       <Text style={{color:"#9252AA" , fontWeight:"500"}}>Total Payment:</Text>
       <Text style={{color:"#9252AA" , fontWeight:"500"}}>{getTotalAmount()} </Text>
       </View>
      <View style={{justifyContent:"space-between" , alignItems:"center" , flexDirection:"row"}}>
      <Text style={{color:"#9252AA" , fontWeight:"500"}}>Advance Amount: </Text>
        <Text style={{color:"#9252AA" , fontWeight:"500" }}>{getAdvanceAmount()}</Text>
      </View>
      
      </View>
        <View
         >
		<TouchableHighlight
            onPress={onContinueClick}
            style={[
              styles.continueButton,
              {
                backgroundColor: Object.values(categoryCounts).some(
                  count => count > 0,
                )
                  ? '#9252AA'
                  : '#F9E9FF',
                borderColor: Object.values(categoryCounts).some(
                  count => count > 0,
                )
                  ? '#9252AA'
                  : '#F9E9FF',
              },
            ]}
            underlayColor="#9252AA"
            activeOpacity={1}
            disabled={
              Object.values(categoryCounts).reduce(
                (totalCount, count) => totalCount + count,
                0,
              ) === 0
            }>
            
            <View style={styles.buttonContent}>
              <Text
                onPress={onContinueClick}
                style={[
                  styles.continueButtonLeftText,
                  {
                    color: Object.values(categoryCounts).some(
                      count => count > 0,
                    )
                      ? 'white'
                      : '#343333',
                  },
                ]}>
                Continue
              </Text>
              <Text
                onPress={onContinueClick}
                style={[
                  styles.continueButtonRightText,
                  {
                    color: Object.values(categoryCounts).some(
                      count => count > 0,
                    )
                      ? 'white'
                      : '#343333',
                  },
                ]}>
                {Object.values(categoryCounts).reduce(
                  (totalCount, count) => totalCount + count,
                  0,
                )}{' '}
                Items | ₹ {getAdvanceAmount()}
              </Text>
            </View>
          </TouchableHighlight>
        </View>
		</View>
        
      
	  
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft:20,
    paddingTop: 20,
    paddingRight:20,
  },
  image1: { width: 16, height: 16, marginLeft: 16, marginTop: 5, marginBottom: 5 },
																				   

  addresscontainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F3F2F2',
    borderRadius: 8,
    elevation: 1,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    paddingBottom:17,
    paddingTop:12,
    marginBottom: 3
  },
  view1: { flexDirection: 'row', backgroundColor: '#EFF0F3', elevation: 2, width: Dimensions.get('window').width  , marginBottom:1 , alignItems:"center" , justifyContent:"center"},
  text1: { color: '#676767', fontSize: 14, fontWeight: '400', paddingVertical: 5, marginStart: 8 },
  view2: { flexDirection: 'row', backgroundColor: '#EFF0F3' , alignItems:"center" , justifyContent:"center" , marginTop:5},
  text2: { color: '#676767', fontSize: 12, fontWeight: '400', paddingVertical: 5, marginStart: 8 },
																																													 
																								   
																														   
																								   

  separator1: {height: 1, width: 70, marginTop: 1, marginLeft: 5 , marginBottom:20},
  decContainer: {
    flexDirection: 'row',
    padding: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',

     marginBottom: 20,
  },
  itemName: {
    color: '#000',
    marginHorizontal: 'auto',
    marginVertical: 0,

    fontSize: 15,
    fontWeight: '600',
  },
  decCatimage: {
    width: Dimensions.get("window").width*0.22,
    height: Dimensions.get("window").height*0.1,
    borderRadius: 10,
    marginBottom: 3,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  continueButton: {
				  
    backgroundColor: 'gray',
    marginBottom: 30,
						 
									
						 
					
				   
						
    borderRadius: 20,
    marginTop:10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal:16,
    paddingVertical: 17,
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
  },
  verticalSeparator: {
    height: 1,
    width: 295,
  },
  textArea: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingLeft: 8,
    marginTop: 10, // Adjust the margin if needed
    marginBottom: 20,
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
 
  buttonText1: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
  },

  separator1: {height: 1, width: 70, marginTop: 10, marginLeft: 5},
  separator2: {height: 1, width: 70, marginTop: 10, marginStart: -15},
  
  headingText: {
    flex: 1,
    color: '#414141',
    fontSize: 12,
    fontWeight: '400',
    justifyContent: 'space-between',
    opacity: 0.8,
    marginLeft: 10,
  },
  homeIcon: {
    marginLeft: 25,
    width: 24,
    height: 24,
  },

  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
  },
  selectedContainer: {
    backgroundColor: '#9252AA', // Selected background color
    borderColor: '#9252AA', // Selected border color
  },
  selectedText: {
    color: 'white', // Selected text color
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 12,
    paddingTop: 12,
  },
  bottomSheetWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  draggableIcon: {
    backgroundColor: '#000',
  },
  editText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 10,
  },
  bottomText: {
    marginTop: 8,
    marginLeft: 38,
    color: '#414141',
    fontWeight: '400',
    fontSize: 10,
    opacity: 0.8


  },
  parallelText: {
    marginLeft: 16,
    fontSize: 12,
    fontWeight: '600',
    color: '#000'
  },
  multiLineText: {
    marginTop: 6,
    paddingHorizontal: 16,
    color: '#414141',
    fontWeight: '400',
    fontSize: 11,
    opacity: 0.8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
  },
  headingText: {
    flex: 1,
    color: '#414141',
    fontSize: 12,
    fontWeight: '400',
    justifyContent: 'space-between',
    opacity: 0.8,
    marginLeft: 10,
  },
  homeIcon: {
    marginLeft: 42,
    width: 18,
    height: 16,

  },
  customButton: {
    height: 57,
    width: Dimensions.get('window').width * 0.8,
    backgroundColor: '#9252AA',
    marginHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  selectedContainer: {
    backgroundColor: '#9252AA', // Selected background color
    borderColor: '#9252AA', // Selected border color
  },
  selectedText: {
    color: 'white', // Selected text color
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 12,
    paddingTop:52

  },
  bottomSheetWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  draggableIcon: {
    backgroundColor: '#000',
  },
});

export default HospitalityService;
