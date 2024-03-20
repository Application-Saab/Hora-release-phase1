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

const SelectDateFoodDelivery = ({ navigation, route }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [peopleCount, setPeopleCount] = useState(0);
    const [activeTab, setActiveTab] = useState('left');
    const data = route.params.selectedDishDictionary;
    const [dishPrice, setDishPrice] = useState(route.params.selectedDishPrice);
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

    useEffect(() =>{
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
    },[])

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

    const RenderIngredients = ({ item }) => {

        let quantity = item.qty * peopleCount;
        let unit = item.unit;
        if (quantity >= 1000) {
            quantity = quantity / 1000;
            if (unit === 'g')
                unit = 'kg'
            else if (unit === 'ml')
                unit = 'L'
        }
        return (
            <View style={{ width:"46%",height: 55, paddingEnd: 2, alignItems: 'center', borderRadius: 5, borderColor: '#DADADA', borderWidth: 0.5, flexDirection: 'row', marginRight: 15, marginBottom: 8 }}>
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

    const renderPreparationText = ({ items
    }) => {
        if (showAll) {
            return items.map((item, index) => (
                <Text key={index} style={styles.item}>{`${index + 1}. ${item}`}</Text>
            ));
        } else {
            return items
                .filter(item => item.length >= 2)
                .slice(0, 2)
                .map((item, index) => (
                    <Text key={index} style={styles.item}>{`${index + 1}. ${item}`}</Text>
                ));
        }
    };



    const toggleShowAll = () => {
        setShowAll(!showAll);
    };

    const LeftTabContent = ({ burnerCount, ApplianceList }) => {
        return (
            <View style={{ paddingHorizontal: 15, flexDirection: 'column', marginLeft: 16, marginEnd: 20, borderWidth: 1, elevation: 1, backgroundColor: 'white', borderBottomRightRadius: 15, borderBottomLeftRadius: 15, borderColor: 'white' }}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: '#000000', fontSize: 13, fontWeight: '600', marginTop: 20 }}>Required Burners</Text>
                    <Text style={{ color: '#969696', fontSize: 11, fontWeight: '500', marginTop: 6 }}>Number of burners depend upon the number of dishes chosen</Text>
                    <Text style={{ color: '#969696', fontSize: 11, fontWeight: '500', marginTop: 6 }}>(Burners would be used at your location)</Text>

                </View>

                <View style={{ width: 90, height: 54, flexDirection: 'column', borderColor: "#DADADA", borderWidth: 0.5, borderRadius: 5, marginTop: 19 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image style={styles.burner} source={require('../../assets/burner.png')} />
                        <Text style={{ marginStart: 12, marginVertical: 6, fontSize: 26, color: "#9252AA" }}>{burnerCount}</Text>

                    </View>

                </View>
                {ApplianceList.length > 0 && (

                    <View style={{ flexDirection: 'column', marginTop: 11 }}>

                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ color: '#000000', fontSize: 13, fontWeight: '600' }}>Requires Special Appliances</Text>
                            <Text style={{ color: '#969696', fontSize: 11, fontWeight: '500', marginTop: 7 }}>(Keep these appliances ready at your location)</Text>

                        </View>

                    </View>
                )}

                {ApplianceList.length > 0 && (
                    <View style={{ flexDirection: 'row', marginTop: 11 }}>
                        <Image style={styles.verticalSeparator} source={require('../../assets/verticalSeparator.png')}></Image>
                    </View>
                )}


                <View style={{ flexDirection: 'column', marginTop: 8 }}>
                    <FlatList
                        data={ApplianceList}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <RenderAppliances item={item} />}
                        numColumns={3}

                    />

                </View>


                {preparationTextList.length > 0 && (
                    <View style={{ flexDirection: 'column', backgroundColor: '#F9E9FF', borderRadius: 15, paddingHorizontal: 10 }}>
                        <View style={styles.header}>
                            <Text style={{ color: '#9252AA', fontWeight: '500', fontSize: 10 }}>Readiness Required*</Text>
                            <TouchableOpacity onPress={toggleShowAll} activeOpacity={1}>
                                <Text style={styles.showAllText}>{showAll ? 'Show Less' : 'Show All'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            {renderPreparationText(preparationTextList)}
                        </View>
                    </View>
                )}

            </View>
        );
    };

    const RightTabContent = ({ ingredientList }) => {
        return (
            <ScrollView>
                 <View style={{ paddingHorizontal: 15, flexDirection: 'column', marginLeft: 16, marginEnd: 20, borderWidth: 1, elevation: 1, backgroundColor: 'white', borderBottomRightRadius: 15, borderBottomLeftRadius: 15, borderColor: 'white', paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ color: '#000000', fontSize: 13, fontWeight: '600', marginTop: 20 }}>Required Ingredient</Text>
                        <Text style={{ color: '#969696', fontSize: 11, fontWeight: '500', marginTop: 6 }}>(Keep these ingredient ready at your location)</Text>

                    </View>

                   <ScrollView style={{ flexDirection: 'column', marginTop: 15 }}>
                        <FlatList
                            data={ingredientList}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <RenderIngredients item={item} />}
                            numColumns={2}

                        />

                    </ScrollView>

                    {preparationTextList.length > 0 && (
                        <View style={{ flexDirection: 'column', backgroundColor: '#F9E9FF', borderRadius: 15, paddingHorizontal: 10 }}>
                            <View style={styles.header}>
                                <Text style={{ color: '#9252AA', fontWeight: '500', fontSize: 10 }}>Readiness Required*</Text>
                                <TouchableOpacity onPress={toggleShowAll} activeOpacity={1}>
                                    <Text style={styles.showAllText}>{showAll ? 'Show Less' : 'Show All'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'column' }}>
                                {renderPreparationText(preparationTextList)}
                            </View>
                        </View>
                    )}


                </View>
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
        if (dishPrice < 400) {
            setWarningVisible(true);
        }
        else {

            navigation.navigate("ConfirmFoodDeliveryOrder", {
                "selectedDate": selectedDate, "selectedTime": selectedTime, "peopleCount": peopleCount,
                "burnerCount": burnerCount,
                "selectedDishes": data, "items":route.params.selectedDishes, subCategory

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
        setDishPrice(dishPrice + 49)
    }

    const decreasePeopleCount = () => {
        if (peopleCount != 0) {
            setPeopleCount(peopleCount - 1)
            setDishPrice(dishPrice - 49)
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

                <View style={{ justifyContent: 'space-between', marginTop: 17, paddingTop: 7, paddingBottom: 9, backgroundColor: '#FFFFFF', marginLeft: 15, marginEnd: 16, borderRadius: 10, height: 195, elevation: 2 }}>
                    <View style={{ justifyContent: 'flex-end', flex: 1, flexDirection: 'row', marginEnd: 9 }}>
                        <TouchableOpacity onPress={toggleModal}>

                            <Image source={require('../../assets/info.png')} style={{ height: 16, width: 16 }} />

                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row'  , justifyContent:"space-between" , paddingHorizontal:"2%"  }}>
					<View style={{flexDirection:"row"}}>
															
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={1}>

                            <View style={{ marginStart: 10, marginEnd: 8, flexDirection: 'column', paddingHorizontal: 17, backgroundColor: 'white', borderColor: isDateValid != null && isDateValid == false ? '#FF3636' : "#F6ECEC", borderRadius: 10, borderWidth: 1, paddingBottom: 9 }}>
                                <Text style={{ paddingTop: 4, color: '#9252AA', fontWeight: '500', fontSize: 10 }}>Booking Date</Text>
                               <View style={{ flexDirection: 'row', marginTop: 1 , width:Dimensions.get('window').width*0.3}}>

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
                                     <View style={{ flexDirection: 'row', marginTop: 1 , width:Dimensions.get('window').width*0.3}}>

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

                   <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 13, alignItems: 'center', marginLeft: 16 }}>
                       <View style={{justifyContent:"center", alignItems:"center" , flexDirection:"row"}}>
                       <Image source={require('../../assets/people.png')} style={{ height: 25, width: 25 }} />
                        <Text style={{ marginLeft: 9, fontSize: 12, color: '#3C3C3E', fontWeight: '500', }}>How many people you are hosting?</Text>
                       </View>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 9 }}>
                            <TouchableOpacity onPress={decreasePeopleCount} activeOpacity={1}>
                                <Image source={require('../../assets/ic_minus.png')} style={{ height: 25, width: 25, marginLeft: 5 }} />
                            </TouchableOpacity>
                            <Text style={{ marginLeft: 5, lineHeight: 23, fontSize: 18, marginTop: 2, width: 22, textAlign: 'center', color: 'black' }}>{peopleCount}</Text>
                            <TouchableOpacity onPress={increasePeopleCount} activeOpacity={1}>
                                <Image source={require('../../assets/plus.png')} style={{ height: 25, width: 25, marginLeft: 5 }} />
                            </TouchableOpacity>


                        </View>
                    </View>

                    <View style={{ alignItems: 'center', flexDirection: 'row', paddingVertical: 5, borderRadius: 10, marginLeft: 13, marginRight: 6, paddingLeft: 9, marginTop: 15, borderRadius: 10, backgroundColor: '#F9E9FF' }}>
                        <Image source={require('../../assets/info.png')} style={{ height: 16, width: 16 }} />
                        <Text style={{ color: '#9252AA', fontWeight: '700', marginLeft: 5, fontSize: 9 }}>₹ 49/person would be added to bill value in addition to dish price</Text>

                    </View>


                </View>
               
            </ScrollView>
            <View>
                <Text style={{ color: '#9252AA', fontWeight: '700', marginLeft: 5, fontSize: 9 }}>
                    {subCategory === "SinglePlateMeal" && (
                    <>
                        {"\n"}
                        Inclusions:
                        {"\n"}
                        ✔️ Food Delivery at Door-step
                        {"\n"}
                        ✔️ Free Delivery
                        {"\n"}
                        ✔️ Hygienically Packed boxes
                        {"\n"}
                        ✔️ Freshly Cooked Food
                        {"\n"}
                    </>
                    )}
                </Text>
            </View>
            <View>
                <Text style={{ color: '#9252AA', fontWeight: '700', marginLeft: 5, fontSize: 9 }}>
                    {subCategory === "LiveBuffet" && (
                    <>
                        Inclusion:
                        {"\n"}
                        - Well Groomed Waiters (2 Nos)
                        {"\n"}
                        - Bone-china Crockery & Quality disposal for loose items.
                        {"\n"}
                        - Transport (to & fro)
                        {"\n"}
                        - Dustbin with Garbage bag
                        {"\n"}
                        - Head Mask for waiters & chefs
                        {"\n"}
                        - Tandoor/Other cooking Utensiles
                        {"\n"}
                        - Chafing Dish
                        {"\n"}
                        - Cocktail Napkins
                        {"\n"}
                        - 2 Chef
                        {"\n"}
                        - Water Can (Bisleri)(20 litres)
                        {"\n"}
                        - Hand gloves
                        {"\n"}
                        Exclusion:
                        {"\n"}
                        - Buffet table/kitchen table is in client scope (can be provided at additional cost)
                    
                    </>
                    )}
                </Text>
            </View>
            <View>
                <Text style={{ color: '#9252AA', fontWeight: '700', marginLeft: 5, fontSize: 9 }}>
                    {subCategory === "BulkFoodDelivery" && (
                    <>
                        Inclusions:
                        {"\n"}
                        ✔️ Food Delivery at Door -Step
                        {"\n"}
                        ✔️ Free Delivery
                        {"\n"}
                        ✔️ Hygienically Packed boxes
                        {"\n"}
                        ✔️ Freshly Cooked Food
                        {"\n"}
                        ✔️ Quality Disposable set of Plates & Spoons & forks
                        {"\n"}
                        ✔️ Water bottles (small bottles equal to number of people)
                        {"\n"}
                    </>
                    )}
                </Text>
            </View>
            

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
                            {Object.values(data).length} Items | ₹ {dishPrice}
                        </Text>

                    </View>
                </TouchableHighlight>

                <OrderWarning visible={isWarningVisible} title={"Total Order Amount is less than"} buttonText={"+ Add More"}
                    message={"Total Order amount can not be less than ₹400, Add more to continue"}
                    amount={" ₹400"}
                    onClose={handleWarningClose} />

                <InfoModal isVisible={isModalVisible} onClose={toggleModal}>
                    <View >

                        <Text style={{ marginTop: 15, marginStart: 22, color: "#9252AA", fontWeight: '500', fontSize: 10 }}>Important</Text>
                        <Text style={{ marginTop: 7, marginStart: 17, fontWeight: '400', color: "rgba(11, 11, 11, 0.74);", fontSize: 10, lineHeight: 15 }}>1. Order can be placed at least 24 hours in advance.</Text>
                        <Text style={{ marginTop: 7, marginStart: 17, fontWeight: '400', color: "rgba(11, 11, 11, 0.74);", fontSize: 10, lineHeight: 15 }}>2. Chef arrival team is between 7 AM to 10 PM</Text>
                        <Text style={{ marginTop: 7, marginStart: 17, fontWeight: '400', color: "rgba(11, 11, 11, 0.74);", fontSize: 10, lineHeight: 15 }}>3. If the count of host is more than 50, contact support</Text>
                    </View>
                </InfoModal>

            </View>

        </View>
    )
}


export default SelectDateFoodDelivery;