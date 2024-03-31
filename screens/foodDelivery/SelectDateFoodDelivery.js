import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, ImageBackground, FlatList, ScrollView, StatusBar, View, Text, TextInput, Image, TouchableOpacity, TouchableHighlight, BackHandler } from 'react-native';
import styles from './stylesSelectDate';
import axios from 'axios';
import CustomStatusBar from '../../components/CustomStatusBar';
import { BASE_URL, GET_CUISINE_ENDPOINT, API_SUCCESS_CODE, GET_MEAL_DISH_ENDPOINT } from '../../utils/ApiConstants';
import DateTimePicker from '@react-native-community/datetimepicker';
import OrderWarning from '../dialog/OrderWarning';
import InfoModal from '../dialog/info';
import CustomHeader from '../../components/CustomeHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SelectDateFoodDelivery = ({
    navigation, route }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [peopleCount, setPeopleCount] = useState(10);
    const [activeTab, setActiveTab] = useState('left');
    const data = route.params.selectedDishDictionary;
    const [selectedDishNames, setSelectedDishNames] = useState(route.params.selectedDishNames);
    const [dishPrice, setDishPrice] = useState(route.params.selectedDishPrice);
    const [selectedDishQuantities, setSelectedDishQuantities] = useState(route.params.selectedDishQuantities);
    const [showAll, setShowAll] = useState(false);
    const [burnerCount, setBurnerCount] = useState(0)
    const [isWarningVisible, setWarningVisible] = useState(false);
    const [isTimeValid, setTimeValid] = useState(null);
    const [isDateValid, setDateValid] = useState(null);
    const [errorText, setErrorText] = useState(null)
    const [isDatePressed, setIsDatePressed] = useState(false)
    const [isTimePressed, setIsTimePressed] = useState(false)
    const [showCookingTime, setShowCookingTime] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState('Appliances');
   
    const subCategory = route.params.subCategory;
    const today = new Date();
    const minimumDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const twoMinutesLater = new Date();
    twoMinutesLater.setMinutes(twoMinutesLater.getMinutes() + 2);
    const toggleSelectedTab = (tabName) => {
        setSelectedTab(tabName);
    };
    const isAppliancesSelected = selectedTab === 'Appliances';
    const isIngredientsSelected = selectedTab === 'Ingredients';
    let count = 0;


    const [selectedOption, setSelectedOption] = useState('foodDelivery');

    const handleSelectOption = (option) => {
        setSelectedOption(option);
    };

    const handleAdd = () => {
        if (selectedOption === 'foodDelivery') {
            console.log('Add Food Delivery');
            // Add food delivery logic here
        } else if (selectedOption === 'liveCatering') {
            console.log('Add Live Catering');
            // Add live catering logic here
        }
    };

    useEffect(() => {
        AsyncStorage.getItem("selectedDate").then((sDate) => {
            if (sDate != null) {
                setSelectedDate(new Date(sDate));
            }
        });
        AsyncStorage.getItem("selectedTime").then((sTime) => {
            if (sTime != null) {

                setSelectedTime(new Date(sTime));
            }
        });
    }, [])

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
        } else {
            setErrorText(null);
        }
    }, [selectedTime, selectedDate])


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
        const isTimeBetweenRange = selectedTime.getHours() >= 7 && selectedTime.getHours() <= 22;
        setTimeValid(isTimeBetweenRange);
        return isTimeBetweenRange
    }


    const isOrderValid = isTimeValid && isDateValid && peopleCount > 0;

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    // const handleDateChange = (event, date) => {
    //     if (date !== undefined) {
    //         setSelectedDate(date);
    //         setIsDatePressed(true)
    //         setShowDatePicker(false);
    //         if(checkIsDateValid()==false){
    //             setErrorText('*Order can be placed at least 24 hours in advance.')
    //             return
    //         }
    //         else{
    //             setErrorText(null)
    //         }

    //         if(checkIsTimeValid()==false){
    //             setErrorText('*Order can be placed only between 7:00 AM to 10:00 PM')
    //             return
    //         }
    //         else{
    //             setErrorText(null)
    //         }
    //     }
    // };

    const handleDateChange = (event, date) => {
        if (date !== undefined) {
            AsyncStorage.setItem("selectedDate", date.toString());
            setSelectedDate(date);
            setShowDatePicker(false);
        }
    };

    const handleTimeChange = (event, time) => {
        if (time !== undefined) {
            AsyncStorage.setItem("selectedTime", time.toString());
            setSelectedTime(time);
            setShowTimePicker(false);
        }
    };



    const RenderAppliances = ({ item }) => {
        return (
            <View style={{ height: 51, paddingEnd: 2, alignItems: 'center', borderRadius: 5, borderColor: '#DADADA', borderWidth: 0.5, flexDirection: 'row', marginRight: 6, marginBottom: 8 }}>
                <View style={{ marginLeft: 5, width: 40, height: 40, backgroundColor: '#F0F0F0', borderRadius: 3, alignItems: 'center', justifyContent: 'center', marginRight: 5 }}>
                    <Image source={{ uri: `https://horaservices.com/api/uploads/${item.image}` }} style={{ width: 33, height: 34 }} />
                </View>

                <View style={{ flexDirection: 'column', marginLeft: 1, width: 43 }}>
                    <Text style={{ fontSize: 12, fontWeight: '500', color: '#414141', lineHeight: 15 }} numberOfLines={2}>{item.name}</Text>
                </View>
            </View>
        );
    };




    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    const RenderDishqunatity = ({ item }) => {
        const itemCount = Object.values(data).length
        let quantity = item.quantity * peopleCount;

        if (itemCount <= 5) {
            quantity = quantity
        }
        else if (itemCount == 6) {
            quantity = quantity * (1 - 0.15)
        }
        else if (itemCount == 7) {
            console.log("quantity before" + quantity)
            quantity = quantity * (1 - 0.15)
            console.log("quantity after" + quantity)
        }
        else if (itemCount == 8) {
            quantity = quantity * (1 - 0.25)
        }
        else if (itemCount == 8) {
            quantity = quantity * (1 - 0.30)
        }
        else if (itemCount == 9) {
            quantity = quantity * (1 - 0.35)
        }
        else if (itemCount == 10) {
            quantity = quantity * (1 - 0.35)
        }
        else if (itemCount == 11) {
            quantity = quantity * (1 - 0.40)
        }
        else if (itemCount == 11) {
            quantity = quantity * (1 - 0.40)
        }
        else if (itemCount == 12) {
            quantity = quantity * (1 - 0.50)
        }
        else if (itemCount == 13) {
            quantity = quantity * (1 - 0.53)
        }
        else if (itemCount == 15) {
            quantity = quantity * (1 - 0.55)
        }

        quantity = Math.round(quantity)
        let unit = item.unit;
        if (quantity >= 1000) {
            quantity = quantity / 1000;
            if (unit === 'Gram')
                unit = 'KG'
            else if (unit === 'ml')
                unit = 'L'
        }
        return (
            <View style={{ width: "46%", height: 55, paddingEnd: 2, alignItems: 'center', borderRadius: 5, borderColor: '#DADADA', borderWidth: 0.5, flexDirection: 'row', marginRight: 15, marginBottom: 8 }}>
                <View style={{ marginLeft: 5, width: 40, height: 40, backgroundColor: '#F0F0F0', borderRadius: 3, alignItems: 'center', justifyContent: 'center', marginRight: 5 }}>
                    <Image source={{ uri: `https://horaservices.com/api/uploads/${item.image}` }} style={{ width: 31, height: 24 }} />
                </View>

                <View style={{ flexDirection: 'column', marginLeft: 1, width: 80 }}>
                    <Text style={{ fontSize: 10, fontWeight: '500', color: '#414141' }}>{item.name}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#9252AA' }}>{quantity + ' ' + unit}</Text>
                </View>
            </View>
        );
    };

    const renderTabContent = (selectedDishQuantities) => {
        if (activeTab === 'left') {

            return <LeftTabContent />;
        } else if (activeTab === 'right') {

            return <RightTabContent selectedDishQuantities={selectedDishQuantities} />;
        }
    };

    const LeftTabContent = () => {
        return (
            <View style={{ justifyContent: 'space-between', marginTop: 6, paddingTop: 5, paddingBottom: 9, paddingLeft: 10, backgroundColor: '#FFFFFF', marginLeft: 15, marginRight: 15, borderRadius: 10, fontSize: 14 }}>
            <View>
                <Text style={{ color: '#9252AA', fontWeight: '700', marginLeft: 5 }}>
                    {selectedOption === "foodDelivery" && (
                        <>
                            {"\n"}
                            ✔️  Food Delivery at Door-step
                            {"\n"}
                            ✔️  Free Delivery
                            {"\n"}
                            ✔️  Hygienically Packed boxes
                            {"\n"}
                            ✔️  Freshly Cooked Food
                            {"\n"}
                        </>
                    )}
                </Text>
            </View>
            <View>
                <Text style={{ color: '#9252AA', fontWeight: '600', marginLeft: 5 }}>
                    {selectedOption === "liveCatering" && (
                        <>
                            ✔️  Well Groomed Waiters (2 Nos)
                            {"\n"}
                            ✔️  Bone-china Crockery & Quality disposal for loose items.
                            {"\n"}
                            ✔️  Transport (to & fro)
                            {"\n"}
                            ✔️  Dustbin with Garbage bag
                            {"\n"}
                            ✔️  Head Mask for waiters & chefs
                            {"\n"}
                            ✔️  Tandoor/Other cooking Utensiles
                            {"\n"}
                            ✔️  Chafing Dish
                            {"\n"}
                            ✔️  Cocktail Napkins
                            {"\n"}
                            ✔️  2 Chef
                            {"\n"}
                            ✔️  Water Can (Bisleri)(20 litres)
                            {"\n"}
                            ✔️  Hand gloves
                            {"\n"}
                            ✔️  Exclusion: Buffet table/kitchen table is in client scope (can be provided at additional cost)
                            {"\n"}
                        </>
                    )}
                </Text>
            </View>
        </View>
        );
    };

    const RightTabContent = ({ selectedDishQuantities }) => {
        console.log(">>>>>>>>>>>>>>" + JSON.stringify(selectedDishQuantities))
        return (
            <ScrollView style={{ marginTop: 17, paddingTop: 5, paddingBottom: 9, paddingLeft: 16, backgroundColor: '#FFFFFF', marginLeft: 15, marginEnd: 16, borderRadius: 10, height: 195, elevation: 2, fontSize: 14 }}>
                <FlatList
                    data={selectedDishQuantities}
                    keyExtractor={item => item.name}
                    renderItem={({ item }) => <RenderDishqunatity item={item} />}
                    numColumns={2}
                />
            </ScrollView>
        );
    };


    const getTotalIngredients = () => {
        const totalIngredients = {};
        for (const dishId in data) {
            const dish = data[dishId];
            if (dish.ingredientUsed) {
                dish.ingredientUsed.forEach((ingredient) => {
                    if (!totalIngredients[ingredient._id]) {
                        totalIngredients[ingredient._id] = {
                            _id: ingredient._id,
                            name: ingredient.name,
                            image: ingredient.image,
                            unit: ingredient.unit,
                            qty: 0
                        };


                    }
                    totalIngredients[ingredient._id].qty += parseInt(ingredient.qty);
                    if (ingredient.unit === 'gram' || ingredient.unit === 'Gram')
                        totalIngredients[ingredient._id].unit = 'g';
                    if (ingredient.unit === 'ml' || ingredient.unit === 'ML')
                        totalIngredients[ingredient._id].unit = 'ml';
                });
            }

            // 	if (count === 0){
            // Object.values(totalIngredients).map(item => {

            //         item.qty = item.qty * peopleCount;
            //         count = 1

            // })}
        }


        return Object.values(totalIngredients);
    };


    const onContinueClick = () => {
        if (dishPrice*peopleCount < 2500) {
            setWarningVisible(true);
        }
        else {
            navigation.navigate("ConfirmFoodDeliveryOrder", {
                "selectedDate": selectedDate, "selectedTime": selectedTime, "peopleCount": peopleCount,
                "burnerCount": burnerCount,
                "selectedDishes": data, "items": route.params.selectedDishes, subCategory

            })
        }
    }
    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle midnight (12 AM)
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }


    const handleWarningClose = () => {
        setWarningVisible(false);
    };


    const increasePeopleCount = () => {
        setPeopleCount(peopleCount + 1)
    }

    const decreasePeopleCount = () => {
        if (peopleCount != 10) {
            setPeopleCount(peopleCount - 1)
        }
    }

    const toggleCookingTimeVisibility = () => {
        setShowCookingTime(!showCookingTime);
    };

    const navigateToSelectDish = () => {
        navigation.navigate("CreateOrderFoodDelivery")
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
                    <Image style={styles.time} source={require('../../assets/SelectDateAndTimeSelected.png')} />
                    <Text style={{ fontSize: 10, fontFamily: '600', color: '#F46C5B' }}>Select Date & Time</Text>
                </View>
                <Image style={styles.separator2} source={require('../../assets/horizontalSeparator.png')} />
                <View>
                    <Image style={styles.order} source={require('../../assets/ConfirmOrderUnselected.png')} />
                    <Text style={{ fontSize: 10, fontFamily: '600', color: '#827F84' }}>Confirm Order</Text>
                </View>

            </View>


            <ScrollView>
            <View style={{ justifyContent: 'space-between', marginTop: 1, paddingTop: 2, paddingBottom: 9, backgroundColor: '#FFFFFF', marginLeft: 15, marginEnd: 16, borderRadius: 10, height: 195, elevation: 2  , marginTop:20}}>
                <View style={{ justifyContent: 'flex-end', flex: 1, flexDirection: 'row', marginEnd: 9 , marginTop:7}}>
                    <TouchableOpacity onPress={toggleModal}>
                        <Image source={require('../../assets/info.png')} style={{ height: 16, width: 16 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingLeft: "1%" , marginTop:-50, paddingRight:"4%"}}>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={1}>
                            <View style={{ marginStart: 10, marginEnd: 8, flexDirection: 'column', paddingHorizontal: 17, backgroundColor: 'white', borderColor: isDateValid != null && isDateValid == false ? '#FF3636' : "#F6ECEC", borderRadius: 10, borderWidth: 1, paddingBottom: 9 }}>
                                <Text style={{ paddingTop: 4, color: '#9252AA', fontWeight: '500', fontSize: 10 }}>Booking Date</Text>
                                <View style={{ flexDirection: 'row', marginTop: 1, width: Dimensions.get('window').width * 0.3 }}>

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
                    </View>


                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => setShowTimePicker(true)} activeOpacity={1}>
                            <View style={{ flexDirection: 'column', paddingHorizontal: 21, backgroundColor: 'white', borderColor: isTimeValid != null && isTimeValid == false ? '#FF3636' : "#F6ECEC", borderRadius: 10, borderWidth: 1, paddingBottom: 9 }}>
                                <Text style={{ paddingTop: 4, color: '#9252AA', fontWeight: '500', fontSize: 10 }}>Chef Arrival Time</Text>
                                <View style={{ flexDirection: 'row', marginTop: 1, width: Dimensions.get('window').width * 0.3 }}>

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
                {errorText != null && (
                    <View style={{ marginStart: 21 }}>
                        <Text style={{ fontSize: 9, fontWeight: '400', color: '#FF2F2F', marginTop: 4 }}>{errorText}</Text>
                    </View>
                )}
                <View style={{ flexDirection: 'row', marginTop: 11, marginLeft: 20, marginRight: 1 }}>
                    <Image style={styles.verticalSeparator} source={require('../../assets/verticalSeparator.png')}></Image>
                </View>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', marginTop: 10, alignItems: 'center', marginLeft: 16, paddingBottom: 10 }}>
                    <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                        <Image source={require('../../assets/people.png')} style={{ height: 20, width: 20 }} />
                        <Text style={{ marginLeft: 9, fontSize: 12, color: '#3C3C3E', fontWeight: '500', }}>How many people you are hosting?</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 9, alignItems: "center" }}>
                        <TouchableOpacity onPress={decreasePeopleCount} activeOpacity={1}>
                            <Image source={require('../../assets/ic_minus.png')} style={{ height: 20, width: 20, marginLeft: 5 }} />
                        </TouchableOpacity>
                        <TextInput
                            style={{
                                marginLeft: 5,
                                paddingVertical: 3, // Adjust the padding to your preference
                                paddingHorizontal: 10,
                                fontSize: 16,
                                width: 40,
                                textAlign: 'center',
                                textAlignVertical: 'center', // Center the text vertically
                                color: 'black',
                                borderWidth: 1,
                                borderColor: 'gray',
                                borderRadius: 5
                            }}
                            value={String(peopleCount)}
                            onChangeText={(e) => {
                                const parsedValue = parseInt(e);
                                if (!isNaN(parsedValue)) {
                                    setPeopleCount(parsedValue);
                                    //setDishPrice(dishPrice*peopleCount)
                                } else {
                                    // Handle the case when input is empty
                                    // For example, you can set peopleCount to 0 or maintain its current value
                                    setPeopleCount(0);
                                    //setDishPrice(dishPrice*peopleCount) // Or
                                    // setPeopleCount(peopleCount);
                                }
                            }}
                            keyboardType="numeric"
                        />

                        <TouchableOpacity onPress={increasePeopleCount} activeOpacity={1}>
                            <Image source={require('../../assets/plus.png')} style={{ height: 20, width: 20, marginLeft: 5 }} />
                        </TouchableOpacity>


                    </View>
                </View>
            </View>

            <View style={{ justifyContent: 'space-between', marginTop: 1, paddingVertical: 12, paddingHorizontal: 12, backgroundColor: '#FFFFFF', marginLeft: 15, marginEnd: 16, marginTop:16 , borderRadius: 10, elevation: 2 }}>
            {/* <Text style={{fontWeight:"600",  color: '#3C3C3E' , fontSize:16 , marginBottom:12}}>{'Select Occation'}</Text> */}
            <View style={{ flexDirection: 'row', alignItems: 'center' , justifyContent:"space-between" }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => handleSelectOption('foodDelivery')}>
                    <View style={{
                        width: 16,
                        height: 16,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#9252AA',
                        backgroundColor: selectedOption === 'foodDelivery' ? '#9252AA' : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10,
                    }}>
                        {selectedOption === 'foodDelivery' && <View style={{ width: 8, height: 8, backgroundColor: '#fff', borderRadius: 6 }} />}
                    </View>
                </TouchableOpacity>
                <Text style={{ fontSize: 14 , color:"#9252AA" , fontWeight:"600"}}>Food Delivery</Text>
            </View>
            {/* <TouchableOpacity onPress={handleAdd} style={{ backgroundColor: '#9252AA', paddingVertical: 0 , paddingHorizontal:5}}>
                <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center' }}>Add</Text>
            </TouchableOpacity> */}
            </View>
            
            <View style={{flexDirection:"row" , alignItems:"center" , justifyContent:"space-between" , marginTop:6}}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => handleSelectOption('liveCatering')}>
                    <View style={{
                        width: 16,
                        height: 16,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#9252AA',
                        backgroundColor: selectedOption === 'liveCatering' ? '#9252AA' : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10,
                    }}>
                        {selectedOption === 'liveCatering' && <View style={{ width: 8, height: 8, backgroundColor: '#fff', borderRadius: 6 }} />}
                    </View>
                </TouchableOpacity>
                <Text style={{ fontSize: 14 , color:"#9252AA" , fontWeight:"600"}}>Live Catering</Text>
            </View>
            {/* <TouchableOpacity onPress={handleAdd} style={{ backgroundColor: '#9252AA', paddingVertical: 0 , paddingHorizontal:5}}>
                <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center' }}>Add</Text>
            </TouchableOpacity> */}
            </View>
          
          
        </View>
           
          
            <View style={{ flexDirection: 'row', marginTop: 20, marginHorizontal: 16 }}>
                <TouchableOpacity style={{
                    backgroundColor: activeTab === 'left'
                        ? "#D9D9D9"
                        : 'white', borderTopRightRadius: 10, borderTopLeftRadius: 15, paddingVertical: 8, paddingStart: 48, paddingRight: 48
                }} onPress={() => setActiveTab('left')} activeOpacity={1}>
                    <Text style={activeTab === 'left' ? styles.activeTab : styles.inactiveTab}>Inclusions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    backgroundColor: activeTab === 'right'
                        ? "#D9D9D9"
                        : 'white', borderTopRightRadius: 10, borderTopLeftRadius: 15, paddingVertical: 8, paddingStart: 48, paddingRight: 48
                }} onPress={() => setActiveTab('right')} activeOpacity={1}>
                    <Text style={activeTab === 'right' ? styles.activeTab : styles.inactiveTab}>Dish Quantity</Text>
                </TouchableOpacity>
            </View>
            {renderTabContent(selectedDishQuantities)}

            </ScrollView>

            <View style={{ paddingHorizontal: 16, justifyContent: 'space-between' }}>

                <TouchableHighlight
                    onPress={onContinueClick}
                    style={[
                        styles.continueButton,
                        {
                            backgroundColor: isOrderValid ? '#9252AA' : '#F9E9FF',
                            borderColor: isOrderValid ? '#9252AA' : 'red',
                        },
                    ]}
                    underlayColor="#9252AA"
                    activeOpacity={1}
                    disabled={!isOrderValid}
                >
                    <View style={styles.buttonContent}>
                        <Text
                            style={[
                                styles.continueButtonLeftText,
                                { color: isOrderValid ? 'white' : '#343333' },
                            ]}
                        >
                            Continue
                        </Text>
                        <Text
                            style={[
                                styles.continueButtonRightText,
                                { color: isOrderValid ? 'white' : '#343333' },
                            ]}
                        >
                            {Object.values(data).length} Items | ₹ {dishPrice*peopleCount}
                        </Text>

                    </View>
                </TouchableHighlight>

                <OrderWarning visible={isWarningVisible} title={"Total Order Amount is less than"} buttonText={"+ Add More"}
                    message={"Total Order amount can not be less than ₹2500, Add more to continue"}
                    amount={" ₹2500"}
                    onClose={handleWarningClose} />

                <InfoModal isVisible={isModalVisible} onClose={toggleModal}>
                    <View>
                        <Text style={{ marginTop: 15, marginStart: 22, color: "#9252AA", fontWeight: '500', fontSize: 10 }}>Important</Text>
                        <Text style={{ marginTop: 7, marginStart: 17, fontWeight: '400', color: "rgba(11, 11, 11, 0.74);", fontSize: 10, lineHeight: 15 }}>1. Order can be placed at least 24 hours in advance.</Text>
                        <Text style={{ marginTop: 7, marginStart: 17, fontWeight: '400', color: "rgba(11, 11, 11, 0.74);", fontSize: 10, lineHeight: 15 }}>2. If the count of host is more than 50, contact support</Text>
                        <Text style={{ marginTop: 7, marginStart: 17, fontWeight: '400', color: "rgba(11, 11, 11, 0.74);", fontSize: 10, lineHeight: 15 }}>3. Deliveries may occur within a window of 30 minutes, either before or after the selected time.</Text>

                    </View>
                </InfoModal>

            </View>

        </View>
    )
}


export default SelectDateFoodDelivery;