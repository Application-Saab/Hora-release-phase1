import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Dimensions, ImageBackground, FlatList, ScrollView, StatusBar, View, Linking, Text, TextInput, Image, TouchableOpacity, TouchableHighlight, BackHandler } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomStatusBar from '../../components/CustomStatusBar';
import RBSheet from 'react-native-raw-bottom-sheet';
import { BASE_URL, GET_CUISINE_ENDPOINT, GET_ADDRESS_LIST, API_SUCCESS_CODE, GET_MEAL_DISH_ENDPOINT, CONFIRM_ORDER_ENDPOINT, GET_ORDER_CITY_CHECK } from '../../utils/ApiConstants';
import Geocoder from 'react-native-geocoding';
import CustomHeader from '../../components/CustomeHeader';
import { PAYMENT, PAYMENT_STATUS } from '../../utils/ApiConstants';
import Geolocation from '@react-native-community/geolocation';
import { getCurrentPosition } from 'react-native-geolocation-service';
import OrderWarning from '../dialog/OrderWarning';
import Loader from '../../components/Loader';

const ConfirmFoodDeliveryOrder = ({ navigation, route }) => {

    const peopleCount = route.params.peopleCount
    const selectedDate = route.params.selectedDate
    const selectedTime = route.params.selectedTime
    const subCategory = route.params.subCategory
    const selectedDeliveryOption= route.params.selectedDeliveryOption
    const selectedDishQuantities = route.params.selectedDishQuantities
    const selectedDishData = route.params.selectedDishes
    const [addresses, setAddresses] = useState([]);
    const [completeAddress, setCompleteAddress] = useState([]);
    const bottomSheetRef = useRef(null);
    const [deliveryCharges, setDeliveryCharges] = useState(300);
    const [packingCost, setpackingCost] = useState(200);
    const [includeDisposable, setIncludeDisposable] = useState(true); // State for checkbox
    const [currentAddress, setCurrentAddress] = useState('');
    const [showAllItems, setShowAllItems] = useState(false);
    const [count, setCount] = useState(0);
    const [add, setAdd] = useState('');
    let [addId, setAddId] = useState('')
    const [i, setI] = useState(0);
    let addressID;
    let cat = []
    const [cityStatus, setCityStatus] = useState(0);
    const [isWarningVisible, setWarningVisible] = useState(false);
    const [isWarningVisibleForCity, setWarningVisibleForCity] = useState(false);
    const [type, setType] = useState(0)


    const handleWarningClose = () => {
        setWarningVisible(false);
        // setWarningVisibleForCity(false);
    };

    const selectedMealList = Object.values(selectedDishData).map(dish => {
        return {
            name: dish.name,
            image: dish.image,
            price: Number(dish.cuisineArray[0]),
            id: dish._id,
            mealId: dish.mealId
        };
    });

    // const onViewAllClick = () => {
    //     setShowAllItems(!showAllItems);
    // }


    const editAddress = (address) => {
        bottomSheetRef.current.close();
        navigation.navigate('ConfirmLocation', { 'data': address })
    }

    const dishCount = selectedMealList.filter(x => x.mealId =="63f1b6b7ed240f7a09f7e2de" || x.mealId=="63f1b39a4082ee76673a0a9f" || x.mealId=="63edc4757e1b370928b149b3").length;

    
    

    function calculateDiscountPercentage(peopleCount, dishCount) {
        if (dishCount <= 5) {
            if (peopleCount >= 0 && peopleCount <= 10) {
                return 0;
            } else if (peopleCount >= 11 && peopleCount <= 19) {
                return 3.5;
            } else if (peopleCount >= 20 && peopleCount <= 29) {
                return 7.0;
            } else if (peopleCount >= 30 && peopleCount <= 39) {
                return 10.5;
            } else if (peopleCount >= 40 && peopleCount <= 49) {
                return 14.0;
            } else if (peopleCount >= 50 && peopleCount <= 59) {
                return 17.5;
            } else {
                return 17.5; // For 60-150 people, use the same discount percentage as 50-59 people
            }
        } else if (dishCount == 6) {
            if (peopleCount >= 0 && peopleCount <= 10) {
                return 15;
            } else if (peopleCount >= 11 && peopleCount <= 19) {
                return 18.5;
            } else if (peopleCount >= 20 && peopleCount <= 29) {
                return 22.0;
            } else if (peopleCount >= 30 && peopleCount <= 39) {
                return 25.5;
            } else if (peopleCount >= 40 && peopleCount <= 49) {
                return 29.0;
            } else if (peopleCount >= 50 && peopleCount <= 59) {
                return 32.5;
            } else if (peopleCount >= 60 && peopleCount <= 69) {
                return 32.5;
            } else if (peopleCount >= 70 && peopleCount <= 99) {
                return 32.5;
            } else {
                return 32.5; // For 100-150 people, use the same discount percentage as 70-99 people
            }
        }
        else if (dishCount == 7) {
            if (peopleCount >= 0 && peopleCount <= 10) {
                return 15;
            } else if (peopleCount >= 11 && peopleCount <= 19) {
                return 18.5;
            } else if (peopleCount >= 20 && peopleCount <= 29) {
                return 22.0;
            } else if (peopleCount >= 30 && peopleCount <= 39) {
                return 25.5;
            } else if (peopleCount >= 40 && peopleCount <= 49) {
                return 29.0;
            } else if (peopleCount >= 50 && peopleCount <= 59) {
                return 32.5;
            } else if (peopleCount >= 60 && peopleCount <= 69) {
                return 32.5;
            } else if (peopleCount >= 70 && peopleCount <= 99) {
                return 32.5;
            } else {
                return 32.5; // For 100-150 people, use the same discount percentage as 70-99 people
            }
        }
        else if (dishCount == 8) {
            if (peopleCount >= 0 && peopleCount <= 10) {
                return 25;
            } else if (peopleCount >= 11 && peopleCount <= 19) {
                return 28.5;
            } else if (peopleCount >= 20 && peopleCount <= 29) {
                return 32.0;
            } else if (peopleCount >= 30 && peopleCount <= 39) {
                return 35.5;
            } else if (peopleCount >= 40 && peopleCount <= 49) {
                return 39.0;
            } else if (peopleCount >= 50 && peopleCount <= 59) {
                return 42.5;
            } else if (peopleCount >= 60 && peopleCount <= 69) {
                return 42.5;
            } else if (peopleCount >= 70 && peopleCount <= 99) {
                return 42.5;
            } else {
                return 42.5; // For 100-150 people, use the same discount percentage as 70-99 people
            }
        }
        else if (dishCount == 9) {
            if (peopleCount >= 0 && peopleCount <= 10) {
                return 30;
            } else if (peopleCount >= 11 && peopleCount <= 19) {
                return 33.5;
            } else if (peopleCount >= 20 && peopleCount <= 29) {
                return 37.0;
            } else if (peopleCount >= 30 && peopleCount <= 39) {
                return 40.5;
            } else if (peopleCount >= 40 && peopleCount <= 49) {
                return 44.0;
            } else if (peopleCount >= 50 && peopleCount <= 59) {
                return 47.5;
            } else if (peopleCount >= 60 && peopleCount <= 69) {
                return 47.5;
            } else if (peopleCount >= 70 && peopleCount <= 99) {
                return 47.5;
            } else {
                return 47.5; // For 100-150 people, use the same discount percentage as 70-99 people
            }
        }
        else if (dishCount == 10) {
            if (peopleCount >= 0 && peopleCount <= 10) {
                return 35;
            } else if (peopleCount >= 11 && peopleCount <= 19) {
                return 38.5;
            } else if (peopleCount >= 20 && peopleCount <= 29) {
                return 42.0;
            } else if (peopleCount >= 30 && peopleCount <= 39) {
                return 45.5;
            } else if (peopleCount >= 40 && peopleCount <= 49) {
                return 49.0;
            } else if (peopleCount >= 50 && peopleCount <= 59) {
                return 52.5;
            } else if (peopleCount >= 60 && peopleCount <= 69) {
                return 52.5;
            } else if (peopleCount >= 70 && peopleCount <= 99) {
                return 52.5;
            } else {
                return 52.5; // For 100-150 people, use the same discount percentage as 70-99 people
            }
        }
        else if (dishCount == 11) {
            if (peopleCount >= 0 && peopleCount <= 10) {
                return 40;
            } else if (peopleCount >= 11 && peopleCount <= 19) {
                return 43.5;
            } else if (peopleCount >= 20 && peopleCount <= 29) {
                return 47.0;
            } else if (peopleCount >= 30 && peopleCount <= 39) {
                return 50.5;
            } else if (peopleCount >= 40 && peopleCount <= 49) {
                return 54.0;
            } else if (peopleCount >= 50 && peopleCount <= 59) {
                return 57.5;
            } else if (peopleCount >= 60 && peopleCount <= 69) {
                return 57.5;
            } else if (peopleCount >= 70 && peopleCount <= 99) {
                return 57.5;
            } else {
                return 57.5; // For 100-150 people, use the same discount percentage as 70-99 people
            }
        }
        else if (dishCount == 12) {
            if (peopleCount >= 0 && peopleCount <= 10) {
                return 50;
            } else if (peopleCount >= 11 && peopleCount <= 19) {
                return 53.5;
            } else if (peopleCount >= 20 && peopleCount <= 29) {
                return 57.0;
            } else if (peopleCount >= 30 && peopleCount <= 39) {
                return 60.5;
            } else if (peopleCount >= 40 && peopleCount <= 49) {
                return 64.0;
            } else if (peopleCount >= 50 && peopleCount <= 59) {
                return 67.5;
            } else if (peopleCount >= 60 && peopleCount <= 69) {
                return 67.5;
            } else if (peopleCount >= 70 && peopleCount <= 99) {
                return 67.5;
            } else {
                return 67.5; // For 100-150 people, use the same discount percentage as 70-99 people
            }
        }
        else if (dishCount == 13) {
            console.log("dishCount is 13" + dishCount)
        }
        else if (dishCount == 14) {
            console.log("dishCount is 14" + dishCount)
        }
        else if (dishCount == 15) {
            console.log("dishCount is 15" + dishCount)
        }
        else {

        }
    }

    // Assuming selectedMealList, peopleCount, and dishCount are defined earlier

    const dishPrice = selectedMealList.reduce((total, dish) => total + dish.price, 0);
    const totalPrice = selectedDeliveryOption === 'liveCatering' ? dishPrice * peopleCount + 6500 : dishPrice * peopleCount;

    
    const discountPercentage = calculateDiscountPercentage(peopleCount, dishCount);
    const discountedPrice = (totalPrice * (1 - discountPercentage / 100)).toFixed(0);


    const calculateFinalTotal = () => {
        let finalTotal = parseFloat(discountedPrice) + parseFloat(deliveryCharges);
        if (includeDisposable) {
            finalTotal += parseFloat((20 * peopleCount).toFixed(0)); // Add disposable cost
        }
        // Convert to number and then format to two decimal places
        return finalTotal.toFixed(0);
    };


    // Function to calculate the advance payment
    const calculateAdvancePayment = () => {
        return Math.round(calculateFinalTotal() * 0.65);
    };


    const AddressItem = ({ address, selected, onSelect }) => (
        <TouchableOpacity onPress={onSelect}>
            <View style={[styles.container, selected && styles.selectedContainer]}>
                <View style={{ flexDirection: 'row', marginTop: 25, alignItems: 'center', marginBottom: 2 }}>
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
        Object.values(selectedDishData).map((item) => cat.push(item.cuisineId[0]));
    }, []);

    useEffect(() => {
        if (subCategory === "foodDelivery") {
            setType(6)
        }
        else if (subCategory === "liveCatering") {
            setType(7)
        }
        console.log("Type " + type);
    })

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


            if (response.status === API_SUCCESS_CODE) {
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
            if (element.address1 === address.address2 || element.address2 === address.address2) {
                addressID = element._id;
                setAddId(addressID);


            }
        });


        setCurrentAddress(address.address2);
        bottomSheetRef.current.close();
    };


    const renderDishItem = ({ item }) => {
        return (
            <View style={{ flexDirection: 'row', marginRight: 5, width: 140, borderRadius: 8, borderColor: '#B8B8B8', borderWidth: 1, backgroundColor: '#FFF', paddingBottom: 5 }}>
                <Image source={{ uri: `https://horaservices.com/api/uploads/${item.image}` }}
                    style={{ width: 41, height: 42, borderRadius: 20, marginBottom: 9, marginTop: 9, marginStart: 9 }} />
                <View style={{ flexDirection: 'column', alignContent: 'flex-end', paddingRight: 7 }}>
                    <Text style={{ alignItems: 'flex-end', width: "90%", marginLeft: 7, color: '#414141', fontSize: 11, fontWeight: '500', opacity: 0.9, marginTop: 10 }}>{item.name}</Text>
                </View>
                <View>{item.qunatity}</View>

            </View>
        )

    }


    const handleConfirmOrder = async (merchantTransactionId) => {
        Object.values(selectedDishData).map((item) => cat.push(item.cuisineId[0]));
        if (addId === "") {
            addId = addressID;
        }

        try {

            const message = await checkPaymentStatus(merchantTransactionId);
            const storedUserID = await AsyncStorage.getItem("userID");
            const locality = await AsyncStorage.getItem("Locality");
            const items = route.params.items.map(value => value)
            //6 Single, 7 Live, 8 Buffet

            if (message === 'PAYMENT_SUCCESS') {
                const url = BASE_URL + CONFIRM_ORDER_ENDPOINT;
                const totalPrice = calculateFinalTotal();
                const requestData = {
                    "toId": "",
                    "order_time": selectedTime.toLocaleTimeString(),
                    "no_of_people": peopleCount,
                    "type": type,
                    "fromId": storedUserID,
                    "is_discount": "0",
                    "addressId": addId,
                    "order_date": selectedDate.toDateString(),
                    "no_of_burner": "",
                    "categoryIds": cat,
                    "order_locality": locality,
                    "total_amount": totalPrice,
                    "orderApplianceIds": [],
                    "payable_amount": totalPrice,
                    "is_gst": "0",
                    "order_type": true,
                    "items": items
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
            alert('Error Confirming Order:', error.message);
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


                            if (message === 'PAYMENT_PENDING') {

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
        }
        // else if(cityStatus === 0){
        //     setWarningVisibleForCity(true);
        // }
        else {
            const apiUrl = BASE_URL + PAYMENT;

            const storedUserID = await AsyncStorage.getItem("userID");
            const phoneNumber = await AsyncStorage.getItem('mobileNumber')

            const randomInteger = Math.floor(getRandomNumber(1, 1000000000000)) + Math.floor(getRandomNumber(1, 1000000000000)) + Math.floor(getRandomNumber(1, 1000000000000));

            const advance = calculateAdvancePayment();

            let merchantTransactionId = randomInteger
            const requestData = {
                user_id: storedUserID,
                price: advance,
                phone: phoneNumber,
                name: '',
                merchantTransactionId: merchantTransactionId
            };


            try {
                const response = await axios.post(apiUrl, requestData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                let url = response.request.responseURL;

                console.log(calculateFinalTotal())
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



    const addMore = () => {
        navigation.navigate('CreateOrderFoodDelivery')
    }
    const navigateToSelectDish = () => {
        navigation.navigate("CreateOrderFoodDelivery")
    }
    const navigateToSelectDate = () => {
        navigation.navigate("SelectDateFoodDelivery", { "selectedDishDictionary": selectedDishData })
    }

    const contactUsRedirection = () => {
        Linking.openURL('whatsapp://send?phone=+917338584828&text=Hello%20I%20have%20some%20queries%20for%20chef%20for%20party%20service');
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
        }
    };

    const addAddress = () => {
        bottomSheetRef.current.close();
        navigation.navigate('ConfirmLocation', { 'data': addresses })
    }

    return (
        <View style={styles.screenContainer}>
            <CustomHeader title={"Create Order"} navigation={navigation} />
            <View style={styles.view1}>
                <Image style={styles.image1} source={require('../../assets/info.png')} />
                <Text style={styles.text1}>Bill value depends upon Dish selected + Number of people</Text>
            </View>
            <View style={styles.view2}>
                <View>

                    <TouchableOpacity activeOpacity={1} onPress={navigateToSelectDish}>
                        <Image style={styles.dish} source={require('../../assets/SelectDishUnselected.png')} />
                        <Text style={{ fontSize: 10, fontFamily: '600', color: '#F46C5B' }}>Select Dishes</Text>
                    </TouchableOpacity>
                </View>
                <Image style={styles.separator1} source={require('../../assets/horizontalSeparator.png')} />
                <View>
                    <TouchableOpacity activeOpacity={1} onPress={navigateToSelectDate}>
                        <Image style={styles.dish} source={require('../../assets/SelectDateAndTimeSelected.png')} />
                        <Text style={{ fontSize: 10, fontFamily: '600', color: '#F46C5B' }}>Select Date & Time</Text>

                    </TouchableOpacity>
                </View>
                <Image style={styles.separator2} source={require('../../assets/horizontalSeparator.png')} />
                <View>
                    <Image style={styles.order} source={require('../../assets/ConfirmOrderSelected.png')} />
                    <Text style={{ fontSize: 10, fontFamily: '600', color: '#F46C5B' }}>Confirm Order</Text>
                </View>

            </View>
            <ScrollView style={{}}>
                <View style={{ marginHorizontal: 16, flexDirection: 'column', width: Dimensions.get('window').width * 0.9, padding: 13, borderRadius: 6, borderColor: '#E6E6E6', borderWidth: 1, marginTop: 6, backgroundColor: "#fff" }}>
                    <Text style={{ color: '#333', fontSize: 13, fontWeight: '700', }}>
                        Cooking location
                    </Text>
                    {currentAddress !== "" ? <View style={{ marginTop: 5, paddingStart: 11, paddingVertical: 6, backgroundColor: 'rgba(211, 75, 233, 0.10)', borderRadius: 4, borderWidth: 1, borderColor: '#FFE1E6', paddingEnd: 20 }}>
                        <Text style={{ color: '#9252AA', fontWeight: '500', lineHeight: 18, fontSize: 13 }}>{currentAddress}</Text>

                    </View> : ""}
                    <TouchableOpacity onPress={changeLocation} activeOpacity={1}>
                        {currentAddress === "" ? <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
                            <Text style={{ color: '#9252AA', fontSize: 13, fontWeight: '500', lineHeight: 18 }} >Click here to add Location</Text>
                        </View> : <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
                            <Text style={{ color: '#9252AA', fontSize: 13, fontWeight: '500', lineHeight: 18 }} >Change Location</Text>
                        </View>}
                    </TouchableOpacity>
                </View>


                <View style={{ marginHorizontal: 16, flexDirection: 'column', width: Dimensions.get('window').width * 0.9, padding: 13, borderRadius: 6, borderColor: '#E6E6E6', borderWidth: 1, marginTop: 6, paddingEnd: 12, backgroundColor: "#fff", paddingBottom: 16 }}>
                    <Text style={{ color: '#333', fontSize: 13, fontWeight: '700', lineHeight: 26 }}>Order summary</Text>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ marginHorizontal: 16, flexDirection: 'column', width: 120, paddingTop: 7, paddingLeft: 13, borderRadius: 6, borderColor: '#E6E6E6', borderWidth: 1, marginTop: 6, paddingBottom: 3 }}>
                                <Text style={{ color: '#A3A3A3', fontSize: 9, fontWeight: '400' }}>Booking Date</Text>
                                <Text style={{ color: '#9252AA', fontSize: 13, fontWeight: '600' }}>{selectedDate.toDateString()}</Text>
                            </View>
                            <View style={{ marginHorizontal: 16, flexDirection: 'column', width: 120, paddingBottom: 3, paddingTop: 7, paddingLeft: 13, borderRadius: 6, borderColor: '#E6E6E6', borderWidth: 1, marginTop: 6 }}>
                                <Text style={{ color: '#A3A3A3', fontSize: 9, fontWeight: '400' }}>Food Delivery Time</Text>
                                <Text style={{ color: '#9252AA', fontSize: 13, fontWeight: '600' }}>{selectedTime.toLocaleTimeString()}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ marginHorizontal: 16, flexDirection: 'column', width: 120, paddingBottom: 3, paddingTop: 7, paddingLeft: 13, borderRadius: 6, borderColor: '#E6E6E6', borderWidth: 1, marginTop: 6 }}>
                                <Text style={{ color: '#A3A3A3', fontSize: 9, fontWeight: '400' }}>Total Dishes</Text>
                                <Text style={{ color: '#9252AA', fontSize: 13, fontWeight: '600' }}>{Object.keys(selectedDishData).length}</Text>
                            </View>
                            <View style={{ marginHorizontal: 16, flexDirection: 'column', width: 120, paddingBottom: 3, paddingTop: 7, paddingLeft: 13, borderRadius: 6, borderColor: '#E6E6E6', borderWidth: 1, marginTop: 6 }}>
                                <Text style={{ color: '#A3A3A3', fontSize: 9, fontWeight: '400' }}>No. of People</Text>
                                <Text style={{ color: '#9252AA', fontSize: 13, fontWeight: '600' }}>{peopleCount}</Text>
                            </View>
                        </View>
                    </View>
                    {/* <Image style={{ width: 290, height: 1, marginTop: 20, marginBottom: 10 }} source={require('../../assets/Rectangleline.png')}></Image> */}
                    <View style={{ paddingHorizontal: 5, marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                            <Text style={{ color: "#9252AA", fontWeight: '600', fontSize: 14, lineHeight: 20 }}>Item Total</Text>
                            <Text style={{ color: "#9252AA", fontWeight: '600', fontSize: 14, lineHeight: 20 }}>₹ {totalPrice}</Text>
                        </View>

                        <Image style={{ width: 290, height: 1, marginTop: 5, marginBottom: 5 }} source={require('../../assets/Rectangleline.png')}></Image>


                        {discountedPrice > 0 ? (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3, alignItems: "center" }}>
                                <View style={{ justifyContent: 'flex-start', alignItems: "center", flexDirection: 'row' }}>
                                    <Text style={{ color: "#9252AA", fontWeight: '600', fontSize: 14, lineHeight: 20 }}>Item Discount:</Text>
                                </View>
                                <Text style={{ color: "#008631", fontWeight: '600', fontSize: 14, lineHeight: 20 }}>
                                    {'-'} ₹ {totalPrice - discountedPrice}
                                </Text>
                            </View>
                        ) : null}

                        <Image style={{ width: 290, height: 1, marginTop: 5, marginBottom: 5 }} source={require('../../assets/Rectangleline.png')}></Image>
                        
                        {selectedDeliveryOption === 'foodDelivery' ? 
                           <View>
                           <View style={{ flexDirection:"row" , justifyContent:"space-between" , alignItems:"center" , backgroundColor: includeDisposable ? '#efefef' : '#fff'  ,paddingHorizontal: 5 ,paddingVertical:4 , marginTop:4 }}>
                               <View style={{ flexDirection:"row" , justifyContent:"space-between" , alignItems:"center" }}>
                                   <TouchableOpacity onPress={() => setIncludeDisposable(!includeDisposable)}>
                                       <View style={{ width: 18, height: 18, borderWidth: 1, borderColor: includeDisposable ? '#008631' : '#008631', borderRadius: 3, alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>
                                           {includeDisposable && <Image source={require('../../assets/check.png')} style={{ width: 12, height: 12 }} />}
                                       </View>
                                   </TouchableOpacity>
                                   <View style={{  }}>
                                       <Text style={{ color: '#9252AA', fontWeight: '600', fontSize: 13, lineHeight: 20 }}>Disposable plates + water bottle:</Text>
                                       <Text style={{ color: '#9252AA', fontWeight: '600', fontSize: 13, lineHeight: 20 }}> ₹ 20/Person</Text>
                                   </View>
                               </View>
                       
                               <View style={{  }}>
                                   <Text style={{ color: '#9252AA', fontWeight: '600', fontSize: 14}}>₹ {includeDisposable ? 20 * peopleCount : 0}</Text>
                               </View>
                           </View>
                           <Image style={{ width: 290, height: 1, marginTop: 10, marginBottom: 5 }} source={require('../../assets/Rectangleline.png')} />
                           </View>
                       
                        : null}
                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                            <Text style={{ color: "#9252AA", fontWeight: '600', fontSize: 14, lineHeight: 20 }}>Packing Cost</Text>
                            <Text style={{ color: "#9252AA", fontWeight: '600', fontSize: 14, lineHeight: 20 }}>₹ {packingCost}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                            <Text style={{ color: "#9252AA", fontWeight: '600', fontSize: 14, lineHeight: 20 }}>Delivery Charges</Text>
                            <View style={{ color: "#9252AA", fontWeight: '600', fontSize: 14, lineHeight: 20 , flexDirection:"row"}}>
                                <Text style={{ color: "#008631", fontWeight: '600' , marginRight:5}}>FREE</Text>
                                <Text style={{ textDecorationLine: "line-through" , color: "#9252AA", fontWeight: '600' }}> ₹ {deliveryCharges}</Text>
                            </View>
                        </View>
                        <Image style={{ width: 290, height: 1, marginTop: 20, marginBottom: 3 }} source={require('../../assets/Rectangleline.png')} />
                            
                        {/* Calculation for final total amount */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                            <Text style={{ color: "#9252AA", fontWeight: '600', fontSize: 14, lineHeight: 20 }}>Final Amount</Text>
                            <Text style={{ color: "#9252AA", fontWeight: '600', fontSize: 14, lineHeight: 20 }}>₹ {calculateFinalTotal()}</Text>
                        </View>

                        {/* Calculation for advance payment */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                            <Text style={{ color: "#9252AA", fontWeight: '600', fontSize: 14, lineHeight: 20 }}>Advance Payment</Text>
                            <Text style={{ color: "#9252AA", fontWeight: '600', fontSize: 14, lineHeight: 20 }}>₹ {calculateAdvancePayment()}</Text>
                        </View>
                    </View>

                </View>
      <View style={{ justifyContent: 'space-between', marginTop: 7, borderRadius: 6, backgroundColor: '#E8E8E8', borderColor: '#D8D8D8', borderWidth: 1, width: Dimensions.get('window').width - 40, paddingBottom: 10 , marginLeft:19 }}>
                    <View style={{ marginHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text style={{ padding: 4, color: '#000', fontSize: 13, fontWeight: '600' }}>Dishes selected</Text>
                    </View>

                    <View style={{ marginTop: 10, marginHorizontal: 15, flexDirection: 'row', flex: 1 }} >
                       
                        <FlatList
                            //data={showAllItems ? selectedMealList : selectedMealList.slice(0, 3)}
                            data={selectedMealList}
                            keyExtractor={(item) => item._id}
                            renderItem={renderDishItem}
                            numColumns={2}
                            columnWrapperStyle={styles.dishColumnWrapper}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 12 }}>
                        <Text style={{ fontSize: 14, fontWeight: 500, color: '#333' }}>Need more info?</Text>
                        <TouchableOpacity onPress={contactUsRedirection} activeOpacity={1}>
                            <View style={{ marginLeft: 5, backgroundColor: '#E8E8E8', borderRadius: 18, borderWidth: 1, borderColor: '#9252AA', justifyContent: 'center', alignItems: 'center', width: 96, height: 28 }}>
                                <Text style={{ color: '#9252AA', fontSize: 13, fontWeight: '500' }}>Contact Us</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ paddingLeft: 15, paddingRight: 12, marginTop: 10 }}>
                    <View style={{ padding: 7, flexDirection: 'column', justifyContent: "space-between", alignItems: "center", borderRadius: 10, paddingRight: 11, marginTop: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(211, 75, 233, 0.10)', borderColor: '#E6E6E6', borderWidth: 1, }}>
                        <View>
                            <Text style={{ fontSize: 11, color: '#9252AA', fontWeight: '400', marginLeft: 4, lineHeight: 15 }}>Cancellation and Order Change Policy:</Text>

                        </View>
                        <View>
                            <Text style={{ fontSize: 11, color: '#9252AA', fontWeight: '400', marginLeft: 4, lineHeight: 15 }}>
                            The order can be cancelled with 95% refund till 24 hours in advance of food delivery time.{'\n'}
                            For any edits, reach out to our customer support team (24 hours in advance of scheduled order delivery time)
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
                <View>
                    <OrderWarning visible={isWarningVisible} title={"Please select address"} buttonText={"OK!"}
                        onClose={handleWarningClose} />
                    {/* <OrderWarning visible={isWarningVisibleForCity} title={"Sorry, we are not in your city!! We will notify you as soon we enter into the city."} buttonText={"OK!"}
                    onClose={handleWarningClose} /> */}
                </View>
            </View>
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



    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    view1: { flexDirection: 'row', backgroundColor: '#EFF0F3', elevation: 2, width: Dimensions.get('window').width },
    text1: { color: '#676767', fontSize: 12, fontWeight: '400', paddingVertical: 5, marginStart: 8 },
    image1: { width: 16, height: 16, marginLeft: 16, marginTop: 5, marginBottom: 5 },
    view2: { flexDirection: 'row', marginEnd: 21, marginStart: 16, marginTop: 15 },
    image2: { height: 36, width: 47 },
    image3: { height: 2, width: 80, marginLeft: 20, marginTop: 15 },
    dishColumnWrapper: {
        marginBottom: 4,
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
    order: { height: 24, width: 24, marginLeft: 16 },
    time: { height: 25, width: 30, marginLeft: 25 },
    dish: { height: 24, width: 24, marginLeft: 15 },
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
        marginLeft: 10,
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
    },
})

export default ConfirmFoodDeliveryOrder