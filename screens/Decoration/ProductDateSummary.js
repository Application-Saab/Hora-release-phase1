import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, ScrollView, Text, TextInput, View, FlatList, Linking , Dimensions, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import axios from 'axios';
import CustomHeader from '../../components/CustomeHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BASE_URL,  GET_ADDRESS_LIST, API_SUCCESS_CODE, CONFIRM_ORDER_ENDPOINT } from '../../utils/ApiConstants';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PAYMENT, PAYMENT_STATUS } from '../../utils/ApiConstants';
import { getCurrentPosition } from 'react-native-geolocation-service';
import OrderWarning from '../dialog/OrderWarning';



const ProductDateSummary = ({ route, navigation }) => {
    const [addresses, setAddresses] = useState([]);
    const { selectedProducts, totalPrice } = route.params;
    
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [isTimeValid, setTimeValid] = useState(null);
    const [isDateValid, setDateValid] = useState(null);
    const [errorText, setErrorText] = useState(null)
    const [isDatePressed, setIsDatePressed] = useState(false)
    const [isTimePressed, setIsTimePressed] = useState(false)
    const today = new Date();
    const bottomSheetRef = useRef(null);
    const [currentAddress, setCurrentAddress] = useState('');

    const minimumDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
    const [selectedDate, setSelectedDate] = useState(minimumDate);
    const [completeAddress, setCompleteAddress] = useState([]);
	const [add, setAdd] = useState('');
    let [addId, setAddId] = useState('')
    const [i, setI] = useState(0);
	 let addressID;
	 const [cityStatus, setCityStatus] = useState(0);
    const [isWarningVisible, setWarningVisible] = useState(false);
																				
    const [comments, setComments] = useState('');

    const handleCommentsChange = (text) => {
        setComments(text);
        
      };
      
    const handleWarningClose = () => {
        setWarningVisible(false);
										

    };
	const editAddress = (address) => {
        bottomSheetRef.current.close();
        navigation.navigate('ConfirmLocation', { 'data': address })
    }

    const twoMinutesLater = new Date();
    twoMinutesLater.setMinutes(twoMinutesLater.getMinutes() + 2);
    const toggleSelectedTab = (tabName) => {
        setSelectedTab(tabName);
    };

    const AddressItem = ({ address, selected, onSelect }) => (
        <TouchableOpacity onPress={onSelect}>
            <View style={[styles.container, selected && styles.selectedContainer]}>
                <View style={{ flexDirection: 'row', marginTop: 25, alignItems: 'center' }}>
                    <Text style={[styles.headingText, selected && styles.selectedText]}>Delivers To</Text>
                    <TouchableOpacity onPress={() => editAddress(address)} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <Image source={selected ? require('../../assets/editSelected.png') : require('../../assets/edit.png')} style={{ height: 14, width: 14 }} />
                        <Text style={[styles.editText, selected && styles.selectedText]}>Edit</Text>
                    </TouchableOpacity>

                </View>
                <View style={{ flexDirection: 'row', flex: 1, marginTop: 10, marginStart: 5, marginEnd: 16, paddingBottom: 25, alignItems: 'center' }}>
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
                        <Text style={[styles.parallelText, selected && styles.selectedText]}>
                            {address.title}
                        </Text>
                        <Text numberOfLines={2} style={[styles.multiLineText, selected && styles.selectedText]}>
                            {address.address2}
                        </Text>
                    </View>
                </View>

            </View>
        </TouchableOpacity>
    );

    const BottomSheetContent = ({ data, onSelectAddress }) => (

        <View style={{ flexDirection: 'column' }}>
            <View style={{ marginHorizontal: 40 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: 'black' }}>
                    Saved Address
                </Text>
            </View>
            <View style={{ marginTop: 19 }}>

                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AddressItem
                            address={item}
                            onSelect={() => onSelectAddress(item)}
                            selected={false}
                        />
                    )}>
                </FlatList>
            </View>

        </View>

    );

    useEffect(() => {

        Geocoder.init('AIzaSyBmHupwMPDVmKEryBTT9LlIeQITS3olFeY');
        getCurrentLocation();

    }, []);

    useEffect(() => {
        const isDateValid = checkIsDateValid();
            const isTimeValid = checkIsTimeValid();

            if (!isTimeValid) {
                setErrorText('*Order can be placed only between 8:00 AM to 10:00 PM');
                return;
            } 
            else if (!isDateValid) {
                setErrorText('Order can be placed at least 24 hours in advance.');
                return;
            } else{
                setErrorText(null);
            }
    }, [selectedTime, selectedDate])

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            Geocoder.from(latitude, longitude)
              .then((response) => {
                const address = response.results[0].formatted_address;
                setCompleteAddress(response.results[0].address_components);
                setAdd(address);
                //setCurrentAddress(address);
              })
              .catch((error) => console.warn('Error fetching location address:', error));
          },
          (error) => console.log('Error getting current location:', error),
          { enableHighAccuracy: true, timeout: 100000000000000000, maximumAge: 1000000000000000000000000 }
        );
      };

    const fetchAddressesFromAPI = async () => {
        try {
            const url = BASE_URL + GET_ADDRESS_LIST;
            const requestData = {
                page: '1'
            };
            const token = await AsyncStorage.getItem('token')

            const response = await axios.post(url, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token
                },
            });
            if (response.status == API_SUCCESS_CODE) {
                setAddresses(response.data.data.address)
            }
        } catch (error) {
            console.log('Error Fetching Data:', error.message);
        }
    };

    const openBottomSheet = () => {
        bottomSheetRef.current.open();
        fetchAddressesFromAPI()
    };

    const handleSelectAddress = (address) => {
        setI(1);
        setAdd(address.address2)

        

        addresses.forEach(element => {
            if (element.address1 ===  address.address2 || element.address2 === address.address2)
            {
                addressID = element._id;
                setAddId(addressID);
            }
        });

        setCurrentAddress(address.address2);
        bottomSheetRef.current.close();
    };
	
	const handleConfirmOrder = async (merchantTransactionId) => {
								
        if (addId === "")
        {
            addId = addressID;
        }
        try {
            
            const message = await checkPaymentStatus(merchantTransactionId);
            const items = selectedProducts.map(value => value._id);
            const storedUserID = await AsyncStorage.getItem("userID");
            const locality = await AsyncStorage.getItem("Locality");
            
            if (message === 'PAYMENT_SUCCESS') {
                const url = BASE_URL + CONFIRM_ORDER_ENDPOINT;
                const requestData = {
                    "toId": "",
                    "order_time": selectedTime.toLocaleTimeString(),
                    "no_of_people": 0,
                    "type": 1,
                    "fromId": storedUserID,
                    "is_discount": "0",
                    "addressId": addId,
                    "order_date": selectedDate.toDateString(),
                    "no_of_burner": 0,
                    "order_locality": locality,
                    "total_amount": totalPrice,
                    "orderApplianceIds": [],
                    "payable_amount": totalPrice,
                    "is_gst": "0",
                    "order_type": true,
                    "items": items,
                    "decoration_comments":comments
                }
                
                const token = await AsyncStorage.getItem('token');
    
                const response = await axios.post(url, requestData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': token
                    },
                });
    
                if (response.status === API_SUCCESS_CODE) {
                    navigation.navigate('ConfirmOrder');
                }
            }
        } catch (error) {
            console.log('Error Confirming Order:', error.message);
        }
        
    };
    
    const checkPaymentStatus = async (merchantTransactionId) => {
        try {
            const storedUserID = await AsyncStorage.getItem('userID');
            const apiUrl = BASE_URL + PAYMENT_STATUS + '/' + merchantTransactionId;
            
    
            const pollInterval = 5000; // 5 seconds (adjust as needed)
            const pollingDuration = 300000; // 5 minutes
    
            const pollPaymentStatus = async () => {
                const startTime = Date.now();
    
                while (Date.now() - startTime < pollingDuration) {
                    try {
                        const response = await axios.post(apiUrl, {}, {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
    
                        
    
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
        if (i === 0)
        {
            setWarningVisible(true);
        }
        else
        {
        const apiUrl = BASE_URL + PAYMENT;
        const storedUserID = await AsyncStorage.getItem("userID");
        
        const phoneNumber = await AsyncStorage.getItem('mobileNumber')
        
        const randomInteger = Math.floor(getRandomNumber(1,1000000000000)) + Math.floor(getRandomNumber(1,1000000000000)) + Math.floor(getRandomNumber(1,1000000000000));
        let merchantTransactionId = randomInteger
        const requestData = {
        user_id: storedUserID,
        price: Math.round(totalPrice*0.3),
        phone: phoneNumber,
        name: storedUserID,
        merchantTransactionId: merchantTransactionId
        };
    try {
        
        const response = await axios.post(apiUrl, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        
        let url = response.request.responseURL;
					  

        
  
        handleConfirmOrder(merchantTransactionId);
        Linking.openURL(url)
        .then((supported) => {
          if (!supported) {
            console.log(`Cannot handle URL: ${url}`);
          } else {
            console.log(`Opened URL: ${url}`);
          }
        })
  
      } catch (error) {
        // Handle errors
        console.error('API error:', error);
      }
        }
       
        
        
    }
	

    const changeLocation = async () => {
        try {
          let address = await AsyncStorage.getItem("Address");
      const locality = completeAddress[4]?.long_name || "";
          const city = completeAddress[5]?.long_name || "";
          const state = completeAddress[7]?.long_name || "";
          const pincode = completeAddress[9]?.long_name || "";
														  
			   

          
          
          
          await Promise.all([
            AsyncStorage.setItem("City", city),
            AsyncStorage.setItem("State", state),
            AsyncStorage.setItem("Pincode", pincode),
            AsyncStorage.setItem("Locality", locality)
          ]);
								 
          openBottomSheet();
        } catch (error) {
          console.error('Error fetching or setting data in AsyncStorage:', error);
        }
      };

    const addAddress = () => {
        bottomSheetRef.current.close();
        navigation.navigate('ConfirmLocation', { 'data': null })
    }

   
    const checkIsDateValid = () => {
        const currentTime = new Date();
        const selectedDateTime = new Date(selectedDate);
        selectedDateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes());
        const timeDifference = selectedDateTime.getTime() - currentTime.getTime();
        const isDateGreaterThan24Hours = timeDifference >= 24 * 60 * 60 * 1000;
        setDateValid(isDateGreaterThan24Hours);
        return isDateGreaterThan24Hours
    }

    const checkIsTimeValid = () => {
        const isTimeBetweenRange = selectedTime.getHours() >= 8 && selectedTime.getHours() <= 22;
        setTimeValid(isTimeBetweenRange);
        return isTimeBetweenRange
    }


    const contactUsRedirection = () => {
        Linking.openURL('whatsapp://send?phone=+917338584828&text=Hello%20wanted%20to%20know%20about%20your%20service%20decoration');
    }


    const isOrderValid = isTimeValid && isDateValid > 0;

    const handleDateChange = (event, date) => {
        if (date !== undefined) {
            setSelectedDate(date);
            setShowDatePicker(false);
	 
        }
    };

    const handleTimeChange = (event, time) => {
        if (time !== undefined) {
            setSelectedTime(time);
            setShowTimePicker(false);	 
        }
    };

    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (12 AM)
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    return (
        <View style={styles.screenContainer}>
            <CustomHeader title={"Order Summary"} navigation={navigation} />

            <ScrollView style={{ paddingLeft: 0, paddingRight: 7 }}>
                <View style={{ marginHorizontal: 16, flexDirection: 'column', width: Dimensions.get('window').width * 0.9 + 4, padding: 7, backgroundColor: 'rgba(255, 164, 164, 0.27)', borderColor: '#F15252', borderWidth: 1, borderRadius: 3, alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                    <Text style={{ color: '#000', fontSize: 10, fontWeight: '500', textAlign: 'center' }}>The decorator requires approximately 40-90 minutes to fulfill the service</Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 10, textAlign: 'center', paddingHorizontal: 15  , justifyContent:"space-between" ,alignItems:"center"}}>

                    <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={1}>

                        <View style={{ flexDirection: 'column', paddingHorizontal: 17, backgroundColor: 'white', borderColor: isDateValid != null && isDateValid == false ? '#FF3636' : "#F6ECEC", borderRadius: 10, borderWidth: 1, paddingBottom: 9 }}>
                            <Text style={{ paddingTop: 4, color: '#9252AA', fontWeight: '500', fontSize: 10 }}>Booking Date</Text>
                            <View style={{ flexDirection: 'row', marginTop: 1 }}>

                                <Text style={{ fontSize: 16, fontWeight: 600, color: isDatePressed ? '#383838' : "grey" }}>{selectedDate.toLocaleDateString()}</Text>

                                <Image source={require('../../assets/ic_calendar.png')} style={{ height: 19, width: 19, marginLeft: 17 }} />
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={selectedDate}
                                        mode="date"
                                        display="default"
                                        minimumDate={minimumDate}
                                        onChange={handleDateChange}
                                    />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => setShowTimePicker(true)} activeOpacity={1}>
                            <View style={{ flexDirection: 'column', paddingHorizontal: 21, backgroundColor: 'white', borderColor: isTimeValid != null && isTimeValid == false ? '#FF3636' : "#F6ECEC", borderRadius: 10, borderWidth: 1, paddingBottom: 9 }}>
                                <Text style={{ paddingTop: 4, color: '#9252AA', fontWeight: '500', fontSize: 10 }}>Decor finish time</Text>
                                <View style={{ flexDirection: 'row', marginTop: 1 }}>

                                    <Text style={{ fontSize: 16, fontWeight: 600, color: isTimePressed ? '#383838' : "grey" }}>
                                    {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                    <Image source={require('../../assets/clock.png')} style={{ height: 19, width: 19, marginLeft: 17 }} />
                                    {showTimePicker && (
                                        <DateTimePicker
                                            value={selectedTime}
                                            mode="time"
                                            display="default"
                                            onChange={handleTimeChange}
                                        />
                                    )}
                                </View>
                                
                            </View>
                        </TouchableOpacity>
                        
                    </View>
                    
                </View>
                {errorText !== null && (
                        <View style={{ marginStart: 21 }}>
                            <Text style={{ fontSize: 9, fontWeight: '400', color: '#FF2F2F', marginTop: 4 }}>{errorText}</Text>
                        </View>
                    )}

                <View style={{ marginHorizontal: 16, flexDirection: 'column', width: Dimensions.get('window').width * 0.9, padding: 13, borderRadius: 6, borderColor: '#E6E6E6', borderWidth: 1, marginTop: 6, backgroundColor: "#fff" }}>
                    <Text style={{ color: '#333', fontSize: 13, fontWeight: '700', }}>
                        Serving location
                    </Text>
                    {currentAddress !== ""?<View style={{ marginTop: 5, paddingStart: 11, paddingVertical: 6, backgroundColor: 'rgba(211, 75, 233, 0.10)', borderRadius: 4, borderWidth: 1, borderColor: '#FFE1E6', paddingEnd: 20 }}>
                        <Text style={{ color: '#9252AA', fontWeight: '500', lineHeight: 18, fontSize: 13 }}>{currentAddress}</Text>

                    </View>:""}
                    <TouchableOpacity onPress={changeLocation} activeOpacity={1}>
                    {currentAddress === ""?<View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
                            <Text style={{ color: '#9252AA', fontSize: 13, fontWeight: '500', lineHeight: 18 }} >Click here to add Location</Text>
                        </View>:<View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
                            <Text style={{ color: '#9252AA', fontSize: 13, fontWeight: '500', lineHeight: 18 }} >Change Location</Text>
                        </View>}

                    </TouchableOpacity>
                    <OrderWarning visible={isWarningVisible} title={"Please select address"} buttonText={"OK!"}
                    onClose={handleWarningClose} />
                    <RBSheet
                ref={bottomSheetRef}
                closeOnDragDown={true}
                height={500}
                customStyles={{
                    container: styles.bottomSheetContainer,
                    wrapper: styles.bottomSheetWrapper,
                    draggableIcon: styles.draggableIcon,
                }}
            >
                <View style={{ flexDirection: 'column', marginBottom: 39, flex: 1 }}>
                    <BottomSheetContent
                        data={addresses}
                        onSelectAddress={handleSelectAddress}

                    />
                </View>

                <View style={{
                    justifyContent: 'center',
                    marginTop: 29,
                    marginBottom: 26,
                    alignItems: 'center',
                }}>
                    <TouchableOpacity onPress={() => addAddress()} style={styles.customButton} activeOpacity={1}>
                        <Text style={styles.buttonText}> + Add Address</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
                </View>


                <View style={{ paddingLeft: 11, paddingRight: 10, marginTop: 10 }}>
                    <View style={{ borderColor: "#F6ECEC", backgroundColor: "#fff", borderWidth: 1, borderRadius: 10 }}>
                        <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                                <Text style={{ color: "#9252AA", fontWeight: '600', fontSize: 16, lineHeight: 20 }}>Total amount</Text>
                                <Text style={{ color: "#9252AA", fontWeight: '600', fontSize: 16, lineHeight: 20 }}>₹ {totalPrice}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                                <Text style={{ color: "#9252AA", fontWeight: '600', fontSize: 16, lineHeight: 20 }}>Advance payment</Text>
                                <Text style={{ color: "#9252AA", fontWeight: '600', fontSize: 16, lineHeight: 20 }}>₹ {Math.round(totalPrice * 0.3)}</Text>
                            </View>
                            <View style={{ padding: 7, flexDirection: 'row', borderRadius: 5,  marginTop: 15,  backgroundColor: 'rgba(211, 75, 233, 0.10)', justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../../assets/info.png')} style={{ height: 12, width: 12 }} />
                                <Text style={{ fontSize: 9, color: '#9252AA', fontWeight: '400', marginLeft: 4, lineHeight: 15 }}>Balance payment is to be paid to executor after order completion.</Text>
                            </View>
                        </View>
                        <View style={styles.selectedProductsContainer}>
                            {selectedProducts.map(product => (
                                <View>
                                    <View key={product.id} style={styles.productContainer}>
                                        <View>
                                            <Image source={{ uri: `https://horaservices.com/api/uploads/${product.featured_image}` }} style={styles.productImage} />

                                        </View>
                                        <View style={{ width: '50%' }}>
                                            <Text style={styles.productName}>{product.name}</Text>
                                            <Text style={styles.productPrice}>₹{product.price}</Text>
                                        </View>

                                    </View>
                                    <ScrollView>
                <Text style={{color:"black"}}>Share your comments(if any):</Text>
                <TextInput
                    editable
                    multiline
                    numberOfLines={5}
                    maxLength={80}
                    style={styles.textArea}
                    placeholder="No extra charges for customizing balloon color or replacing tags (Happy Birthday/Anniversary).
                    Charges will be applied for additional items."
                    placeholderTextColor="#ddd" 
                    onChangeText={handleCommentsChange}
																																		
                />
            </ScrollView>
                                </View>


                            ))}
                        </View>
                    </View>

                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 12 }}>
                    <Text style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>Need more info?</Text>
                    <TouchableOpacity activeOpacity={1} onPress={contactUsRedirection}>
                        <View style={{ marginLeft: 5, backgroundColor: '#E8E8E8', borderRadius: 18, borderWidth: 1, borderColor: '#9252AA', justifyContent: 'center', alignItems: 'center', width: 96, height: 28 }}>
                            <Text style={{ color: '#9252AA', fontSize: 13, fontWeight: '500' }}>Contact Us</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ paddingLeft: 15, paddingRight: 12, marginTop: 10 }}>
                    <View style={{ padding: 7, flexDirection: 'column', justifyContent: "space-between", alignItems: "center", borderRadius: 10, paddingRight: 11, marginTop: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(211, 75, 233, 0.10)', borderColor: '#E6E6E6', borderWidth: 1, }}>
                        <View>
                            <Text style={{ fontSize: 10, color: '#9252AA', fontWeight: '400', marginLeft: 4, lineHeight: 15 }}> Cancellation and Order Change Policy:</Text>

                        </View>
                        <View>
                        <Text style={{ fontSize: 10, color: '#9252AA', fontWeight: '400', marginLeft: 4, lineHeight: 15 }}>
    Till the order is not assigned to the service provider, 100% of the amount will be refunded, otherwise 50% of the advance will be deducted as cancellation charges to compensate the service provider.{'\n'}
    The order cannot be edited after paying the advance. Customers can cancel the order and replace it with a new order with the required changes.
</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>



            <View style={{ marginTop: 11, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={onContinueClick} style={styles.continueButton} activeOpacity={1}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
                        <Text style={styles.buttonText1}>Confirm Order</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    selectedProductsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: 15,
        paddingLeft: 20,
        paddingRight: 30,
    },
    productContainer: {
        width: '100%',
        marginBottom: 10,
        alignItems: 'left',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    productImage: {
        width: 120,
        height: 120,
        borderRadius: 10,
    },
    productName: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 10,
		color: '#555',
					  
    },
    productId: {
        fontSize: 14,
        color: '#555',
    },
    productPrice: {
        fontSize: 12,
        color: '#555',
    },
    textArea: {
        width: '80%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingLeft: 8,
        marginTop: 10, // Adjust the margin if needed
        marginBottom: 20,
		color:"black",
					
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
    continueButton: {
        width: Dimensions.get('window').width * 0.9,
        backgroundColor: '#9252AA',
        justifyContent: 'center',
        paddingVertical: 17,
        borderRadius: 20,
        marginBottom: 15
    },
    buttonText1: {
        color: 'white',
        fontWeight: '500',
        fontSize: 18,
    },
    
    separator1: { height: 1, width: 70, marginTop: 10, marginLeft: 5 },
    separator2: { height: 1, width: 70, marginTop: 10, marginStart: -15 },
    container: {
        flex: 1,
        backgroundColor: '#F3F2F2',
        borderRadius: 8,
        elevation: 1,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        paddingBottom: 1,
        marginBottom: 3
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
        marginLeft: 25,
        width: 24,
        height: 24
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
        paddingTop: 12

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
        marginLeft: 10
    },
    dishItemContainer: {
        flex: 1,
        flexDirection: 'column',
        borderRadius: 8,
        borderColor: '#B8B8B8',
        borderWidth: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 4, // Add vertical margin
    }
});

export default ProductDateSummary;
