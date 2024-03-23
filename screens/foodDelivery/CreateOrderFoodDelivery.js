import React, {useState, useRef, useEffect} from 'react';
import {
  Switch,
  Dimensions,
  ImageBackground,
  FlatList,
  ScrollView,
  StatusBar,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  BackHandler,
} from 'react-native';

import styles from './styles';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomStatusBar from '../../components/CustomStatusBar';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  BASE_URL,
  GET_CUISINE_ENDPOINT,
  API_SUCCESS_CODE,
  GET_MEAL_DISH_ENDPOINT,
} from '../../utils/ApiConstants';

import OrderWarning from '../dialog/OrderWarning';
import CustomHeader from '../../components/CustomeHeader';
import {Directions} from 'react-native-gesture-handler';
import Loader from '../../components/Loader';
const CreateOrderFoodDelivery = ({navigation}) => {

  const route = useRoute();

  const [selected, setSelected] = useState('veg');
  const [cuisines, setCuisines] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [mealList, setMealList] = useState([]);
  const [isSelectedDish, setIsSelectedDish] = useState(false);
  const [dishDetail, setDishDetail] = useState(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const bottomSheetRef = useRef(null);
  const [selectedDishPrice, setSelectedDishPrice] = useState(0);
  const [selectedDishDictionary, setSelectedDishDictionary] = useState({});
  const windowWidth = Dimensions.get('window').width;
  const [isNonVegSelected, setIsNonVegSelected] = useState(false);
  const [isVegSelected, setIsVegSelected] = useState(true);
  const [isDishSelected, setIsDishSelected] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isWarningVisibleForDishCount, setWarningVisibleForDishCount] =
    useState(false);

  const [isWarningVisibleForCuisineCount, setWarningVisibleForCuisineCount] =
    useState(false);

	const [isViewAllExpanded, setIsViewAllExpanded] = useState(false);
  const subCategory = route.params.subCategory;
																	

  const handleWarningClose = () => {
    setWarningVisibleForDishCount(false);
    setWarningVisibleForCuisineCount(false);
  };

  // get category of cuisines

  useEffect(() => {
    
    const fetchCuisineData = async () => {
      try {
        const url = BASE_URL + GET_CUISINE_ENDPOINT;
        const requestData = {
          type: 'cuisine',
        };
        const response = await axios.post(url, requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status == API_SUCCESS_CODE) {
          const names = response.data.data.configuration.map(({_id, name}) => [
            _id,
            name,
          ]);
          setCuisines(names);
        }
      } catch (error) {
        console.log('Error Fetching Data:', error.message);
      }
    };
    fetchCuisineData();
  }, []);

  useEffect(() => {
    if (cuisines.length > 0 && selectedCuisines.length === 0) {
      handleCuisinePress(cuisines[0][0]);
    }
  }, [cuisines, selectedCuisines]);

  //render item used to iterate over cuisine list
  const renderItem = ({item}) => {
    const isSelected = selectedCuisines.includes(item[0]);

    return (
      <View
        style={{
          marginBottom: 4,
          flexDirection: 'row',
          paddingEnd: 5,
          paddingBottom: 4,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
	   
        {item[1] !== 'Decoration' ? (
          <TouchableOpacity
            style={[styles.button, isSelected && styles.selectedButton]}
            onPress={() => handleCuisinePress(item[0])}
            underlayColor={isSelected ? '#9252AA' : '#000'}
            activeOpacity={1}>
		   
            <Text
              style={[
                styles.buttonText,
                isSelected && styles.selectedButtonText,
              ]}>
			 
              {item[1]}
            </Text>
          </TouchableOpacity>
        ) : null}
        {expandedCategories.includes(item[0]) && ( // Conditionally render the cuisines list
          <FlatList
            data={cuisines}
            renderItem={renderItem}
            keyExtractor={item => item}
            numColumns={4}
            contentContainerStyle={styles.cuisineContainer}
          />
        )}
      </View>
    );
  };

  const handleIncreaseQuantity = (dish, isSelected) => {
    if (selectedDishes.length > 11 && !isSelected) {
      setWarningVisibleForDishCount(true);
    } else {
      const updatedSelectedDishes = [...selectedDishes];
      const updatedSelectedDishDictionary = {...selectedDishDictionary};
      if (updatedSelectedDishes.includes(dish._id)) {
        const index = updatedSelectedDishes.indexOf(dish._id);
        updatedSelectedDishes.splice(index, 1);
      } else {
        updatedSelectedDishes.push(dish._id);
      }
      setSelectedDishes(updatedSelectedDishes);
      setSelectedCount(updatedSelectedDishes.length);
      if (isSelected) {
        const updatedPrice = selectedDishPrice - parseInt(dish.mealArray[0], 10);
        setSelectedDishPrice(updatedPrice);
      } else {
        const updatedPrice = selectedDishPrice + parseInt(dish.mealArray[0], 10);
        setSelectedDishPrice(updatedPrice);
      }
      if (updatedSelectedDishDictionary[dish._id]) {
        delete updatedSelectedDishDictionary[dish._id];
      } else {
        updatedSelectedDishDictionary[dish._id] = dish;
      }
      setSelectedDishDictionary(updatedSelectedDishDictionary);
      setIsDishSelected(updatedSelectedDishes.length > 0);
    }
  };

  //handleCuisinePress is used to handle cuisine clicks and called from above function
  const handleCuisinePress = cuisineId => {
    if (selectedCuisines.length < 3 || selectedCuisines.includes(cuisineId)) {
      setSelectedCuisines(prevSelected => {
        if (prevSelected.includes(cuisineId)) {
          return prevSelected.filter(item => item !== cuisineId);
        } else {
          return [...prevSelected, cuisineId];
        }
      });
    } else {
      // Display a popup or handle the case where the user tries to select more than 3 cuisines
      setWarningVisibleForCuisineCount(true);
    }
  };
  const fetchMealBasedOnCuisine = async () => {
    try {
      setLoading(true);
      const url = BASE_URL + GET_MEAL_DISH_ENDPOINT;
      const is_dish = isNonVegSelected ? 0 : 1;
      const requestData = {
        cuisineId: selectedCuisines,
        is_dish: is_dish,
      };
      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status == API_SUCCESS_CODE) {
       // Assuming response is your API response
        const filteredMealList = response.data.data.map(item => ({
          ...item,
          dish: item.dish.filter(x => x.cuisineArray.includes(subCategory))
        }));

        setMealList(filteredMealList);

      }
    } catch (error) {
      console.log('Error Fetching Data:', error.message);
    } finally {
      setLoading(false); // Set loading to false when the API request is completed
    }
  };
  //get call to fetch meal based on cuisine.
  useEffect(() => {
    if (selectedCuisines.length > 0 && selectedCuisines.length <= 3) {
      fetchMealBasedOnCuisine();
    } else {
      setMealList([]);
      setSelectedDishDictionary({});
      setIsDishSelected(false);
      setSelectedDishes([]);
      setSelectedCount(0);
      setSelectedDishPrice(0);
    }
  }, [selectedCuisines, isNonVegSelected]);

  const renderDishItem = ({item}) => (
    <TouchableOpacity
      onPress={() => openBottomSheet(item, bottomSheetRef)}
      activeOpacity={1}>
	 
      <View
        style={{
          width: windowWidth * 0.3,
          padding: 0,
          justifyContent: 'flex-start',
          marginTop: 7,
		  position: "relative",
        }}>
	   
	   
        <View style={{flexDirection: 'column'}}>
          <ImageBackground
            source={
              selectedDishes.includes(item._id)
                ? require('../../assets/Rectanglepurple.png')
                : require('../../assets/rectanglewhite.png')
            }
           style={{
              width: "100%",
              height: Dimensions.get("window").height * 0.182,
              marginTop: 33,
            }}
							
															  
							
			  
            imageStyle={{borderRadius: 16}}>
		   
            <View style={{flexDirection: 'column', paddingHorizontal: 5}}>
              <TouchableOpacity
                onPress={() => openBottomSheet(item, bottomSheetRef)}
                activeOpacity={1}>
			   
					 
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
				 
				 
                  <Image
                    source={
                      selectedDishes.includes(item._id) &&
                      item.special_appliance_id.length > 0
                        ? {
                            uri: `https://horaservices.com/api/uploads/${item.special_appliance_id[0].image}`,
                          }
                        : {
                            uri: `https://horaservices.com/api/uploads/${item.image}`,
                          }
                    }
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      marginTop: -30,
                      marginBottom: 1,
                    }}
                  />
                </View>
              </TouchableOpacity>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color:
                      item.special_appliance_id.length > 0 &&
                      selectedDishes.includes(item._id)
                        ? 'white'
                        : 'transparent',
                  }}>
				 
                  Appliance required
                </Text>
              </View>

              <Text
                style={{
                  marginHorizontal: 3,
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: 11,
                  color: 'transparent',
                  opacity: 0.9,
                  height: 28,
                  marginBottom: 8,
                  color: selectedDishes.includes(item._id)
                    ? 'white'
                    : '#9252AA',
                }}>
			   
                {isDishSelected &&
                item.special_appliance_id.length > 0 &&
                selectedDishes.includes(item._id)
                  ? item.special_appliance_id[0].name
                  : item.name}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingStart: 6,
                  paddingEnd: 6,
                }}>
			   
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#9252AA',
                    fontWeight: '700',
                    fontSize: 17,
                    opacity: 0.9,
                    color: selectedDishes.includes(item._id)
                      ? 'white'
                      : '#9252AA',
                  }}>
				 
                  ₹ {item.mealArray[0]}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    handleIncreaseQuantity(
                      item,
                      selectedDishes.includes(item._id),
                    )
                  }>
				 
                  <Image
                    source={
                      selectedDishes.includes(item._id)
                        ? require('../../assets/minus.png')
                        : require('../../assets/plus.png')
                    }
                    style={{width: 21, height: 21}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                alignItems: "center",
              }}
            >
					  
									 
						  
						
						 
									 
				
			 
              <Image
                source={
                  item.is_dish === 1
                    ? require('../../assets/Rectanglegreen.png')
                    : require('../../assets/Rectanglered.png')
                }
                style={{ width: windowWidth * 0.2, height: 3, marginTop: 0 }}
              />
            </View>
          </ImageBackground>
        </View>
      </View>
      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={[true, closeBottomSheet]}
        height={700}
        customStyles={{
          container: styles.bottomSheetContainer,
          wrapper: styles.bottomSheetWrapper,
          draggableIcon: styles.draggableIcon,
        }}>
	   
        <RenderBottomSheetContent />
      </RBSheet>
    </TouchableOpacity>
  );

  const closeBottomSheet = () => {
    setDishDetail(null);
    bottomSheetRef.current.close();
  };

  const addDishAndCloseBottomSheet = () => {
    closeBottomSheet();
  };

  const RenderBottomSheetContent = () => (
    <View style={{flex: 1}}>
      <View contentContainerStyle={{flexGrow: 1}}>
        <Image
          source={{
            uri: `https://horaservices.com/api/uploads/${dishDetail.image}`,
          }}
          style={{
            width: "100%",
            height: Dimensions.get("window").height * 0.3,
						
            borderTopLeftRadius: 45,
            borderTopRightRadius: 45,
          }}
        />
        <Text
          style={{
            color: '#1C1C1C',
            fontSize: 23,
            fontWeight: '800',
            paddingVertical: 8,
          }}>
		 
          {dishDetail.name}
        </Text>

        <Image
          source={require("../../assets/Vector4.png")}
          style={{ width: Dimensions.get("window").width - 24, height: 1 }}
        />

        <View>
          <Text
            style={{
              color: '#736F6F',
              fontSize: 16,
              fontWeight: '400',
              opacity: 0.9,
              marginVertical: 10,
            }}>
		   
            {dishDetail.description}
          </Text>
        </View>

        <Image
          source={require("../../assets/Vector4.png")}
          style={{ width: Dimensions.get("window").width - 24, height: 1 }}
        />

        <View>
          <View
             style={{
              marginTop: 7,
              backgroundColor: "#F7F2F9",
              width: Dimensions.get("window").width - 24,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#9252AA",
              justifyContent: "center",
              alignItems: "start",
              padding: 10,
            }}>
		   
            <Text style={{color: '#4F4F4F', fontSize: 13, fontWeight: '400'}}>
              {dishDetail.per_plate_qty.qty
                ? `${dishDetail.per_plate_qty.qty} ${dishDetail.per_plate_qty.unit}/ Person`
                : 'NA'}
            </Text>
          </View>
          <View
            style={{
              padding: 10,
              marginTop: 4,
              flexDirection: "column",
              backgroundColor: "#F7F2F9",
              width: Dimensions.get("window").width - 24,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: "#9252AA",
            }}>
		   
            <Text style={{color: '#9C9B9B', fontSize: 11, fontWeight: '700'}}>
              Special Appliance Required
            </Text>

            <View style={{flexDirection: 'row', marginTop: 3}}>
             
              <Text
                style={{
                  color: '#4B4B4B',
                  fontSize: 12,
                  fontWeight: '400',
                  marginLeft: 6,
                  marginTop: 4,
                }}>
			   
                {dishDetail.special_appliance_id &&
                dishDetail.special_appliance_id.length > 0 ? (
                  <View>
                    {dishDetail.special_appliance_id.map((appliance, index) => (
                      <View
                        key={index}
                        style={{flexDirection: 'row', alignItems: 'center'}}>
					   
                        <Text
                          style={{
                            color: '#4B4B4B',
                            fontSize: 12,
                            fontWeight: '400',
                          }}>
						 
                          {appliance.name}
                        </Text>

                        {index < dishDetail.special_appliance_id.length - 1 && (
                          <Text>, </Text>
                        )}
                      </View>
                    ))}
                  </View>
                ) : (
                  'NA'
                )}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 4,
              flexDirection: "column",
              backgroundColor: "#F7F2F9",
              padding: 10,
              width: Dimensions.get("window").width - 24,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: "#9252AA",
            }}>
		   
            <Text style={{color: '#9C9B9B', fontSize: 11, fontWeight: '700'}}>
              Advance Preparations required
            </Text>
            <Text style={{color: '#4B4B4B', fontSize: 12, fontWeight: '400'}}>
              {dishDetail.preperationtext ? dishDetail.preperationtext : 'NA'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const openBottomSheet = (dishDetail, bottomSheetRef) => {
    setDishDetail(dishDetail);
    bottomSheetRef.current.open();
  };
  const handleViewAll = categoryId => {
  setIsViewAllExpanded(!isViewAllExpanded);
											 
    setExpandedCategories(prevExpanded =>
      prevExpanded.includes(categoryId)
        ? prevExpanded.filter(id => id !== categoryId)
        : [...prevExpanded, categoryId],
    );
  };
  const renderServedItem = ({item}) => (
    <View style={styles.textContainer}>
      <Text style={styles.text}>{item}</Text>
    </View>
  );

  const addDish = selectedDishPrice => {
    console.log(1);
    navigation.navigate('SelectDateFoodDelivery', {
      selectedDishDictionary,
      selectedDishPrice,
      selectedDishes,
      subCategory
    });
  };
  const handleToggleNonVeg = () => {
    setIsNonVegSelected(!isNonVegSelected);
  };

  const handleToggleVeg = () => {};

  const isCategoryExpanded = categoryId =>
    expandedCategories.includes(categoryId);

  return (
    <View style={styles.screenContainer}>
      <CustomHeader title={'Create Order'} navigation={navigation} />
      <View style={styles.view1}>
        <Image
          style={styles.image1}
          source={require('../../assets/info.png')}
        />
        <Text style={styles.text1}>
          Bill value depends upon Dish selected + Number of people
        </Text>
      </View>

      <View style={styles.view2}>
        <Image
          style={styles.image2}
          source={require('../../assets/selectDish.png')}
        />
        <Image
          style={styles.image3}
          source={require('../../assets/separator.png')}
        />
        <Image
          style={styles.image5}
          source={require('../../assets/SelectDateAndTime.png')}
        />
        <Image
          style={styles.image3}
          source={require('../../assets/separator.png')}
        />
        <View>
          <Image
            style={styles.image4}
            source={require('../../assets/ConfirmOrderUnselected.png')}
          />
          <Text style={{fontSize: 10, fontFamily: '600', color: '#827F84'}}>
            Confirm Order
          </Text>
        </View>
      </View>

      <ScrollView>
        <View style={styles.vegNonVegContainer}>
          <View style={styles.boxvegContainer}>
            <View style={{}}>
              <Switch
                value={isVegSelected}
                onValueChange={handleToggleVeg}
                trackColor={{true: '#8DE080', false: '#D4DBDE'}}
                thumbColor={'white'}
                style={{
                  transform: [{scaleX: 1}, {scaleY: 1}],
                  width: 32,
                  height: 18,
                  marginStart: 10,
                  marginVertical: 3,
                }}
              />
            </View>

            <View style={{marginLeft: 7, marginRight: 12}}>
              <Text style={{fontWeight: '500', fontSize: 9, color: '#000'}}>
                Veg only
              </Text>
            </View>
          </View>
          <View style={styles.boxnonvegContainer}>
            <View>
              <Switch
                value={isNonVegSelected}
                onValueChange={handleToggleNonVeg}
                trackColor={{true: '#D33030', false: '#D4DBDE'}}
                thumbColor={isNonVegSelected ? 'white' : 'white'}
                style={{
                  transform: [{scaleX: 1}, {scaleY: 1}],
                  width: 40,
                  height: 10,
                  marginStart: 10,
                  marginVertical: 3,
                }}
              />
            </View>
            <View style={{marginRight: 8, width: 40}}>
				   
              <Text style={{fontWeight: '500', fontSize: 9, color: '#9252AA'}}>
			   
			   
                Non-Veg
              </Text>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 4}}>
          <Image
            style={styles.verticalSeparator}
            source={require('../../assets/verticalSeparator.png')}></Image>
				   
        </View>
        {loading ? (
          <View style={styles.loaderContainer}>
            <Loader loading={loading} />
          </View>
        ) : (
          <View>
            <View
              style={{
                marginLeft: 20,
                marginRight: 20,
                justifyContent: 'flex-start',
                flexGrow: 1,
              }}>
			 
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '900',
                  color: 'black',
                  marginTop: 5,
                }}>
			   
                Select Cuisines
              </Text>
              <FlatList
                data={cuisines}
                renderItem={renderItem}
                keyExtractor={item => item}
                numColumns={4}
                contentContainerStyle={styles.cuisineContainer}
              />
            </View>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={styles.verticalSeparator}
                source={require('../../assets/verticalSeparator.png')}></Image>
					   
            </View>

            <View style={{paddingHorizontal: 12}}>
              <FlatList
                data={mealList}
                keyExtractor={item => item.mealObject._id}
                renderItem={({item}) => (
                  <View style={{marginVertical: 5}}>
                    {item.dish.length > 0 && (
                      <View
                        style={{
                          marginRight: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
					   
                        <Text
                          style={{
                            color: '#000',
                            fontSize: 15,
                            fontWeight: '800',
                            lineHeight: 15,
                            paddingTop: 15,
                          }}>
						 
                          {item.mealObject.name} ({item.dish.length})
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                          }}>
						 
                          <TouchableOpacity
                            onPress={() => handleViewAll(item.mealObject._id)}
                            activeOpacity={1}>
						   
                            <Text
                              style={{
                                color: '#9252AA',
                                fontWeight: '400',
                                textDecorationLine: 'underline',
                                fontSize: 12,
                                marginLeft: 10,
                              }}>
							 
                              View All
                            </Text>
                          </TouchableOpacity>
																																																																			  

                          {/* <Image style={{ width: 12, height: 12, marginLeft: 8 }} source={require('../../assets/viewAll.png')} activeOpacity={1}></Image> */}

						<Image
                            style={{
                              width: 15,
                              height: 15,
                              marginLeft: 8,
                              transform: [
                                {
                                  rotate: expandedCategories.includes(
                                    item.mealObject._id
                                  )
                                    ? "90deg"
                                    : "0deg",
                                },
                              ],
                            }}
                            source={require("../../assets/viewAll.png")}
                            activeOpacity={1}
                          />
							
                        </View>
                      </View>
                    )}

                    {expandedCategories.includes(item.mealObject._id) ? (
                      // Show all dishes if this category is expanded
                      
                      <FlatList
                        data={item.dish}
                        keyExtractor={dish => dish._id}
                        renderItem={renderDishItem}
                        numColumns={3} // Set numColumns to 3 for the grid layout
                        contentContainerStyle={styles.dishContainer}
                        columnWrapperStyle={styles.dishColumnWrapper}
                      />
                    ) : (
                      // Show only the first 3 dishes if this category is collapsed
                      <FlatList
                        data={item.dish.slice(0, 3)}
                        keyExtractor={dish => dish._id}
                        renderItem={renderDishItem}
                        numColumns={3}
                        contentContainerStyle={styles.dishContainer}
                        columnWrapperStyle={styles.dishColumnWrapper}
                      />
                    )}
                  </View>
                )}
              />
            </View>
          </View>
        )}
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 5,
          justifyContent: 'space-between',
        }}>
	   
        <TouchableHighlight
          onPress={() => addDish(selectedDishPrice)}
          style={[
            styles.continueButton,
            {
              backgroundColor: isDishSelected ? '#9252AA' : '#F9E9FF',
              borderColor: isDishSelected ? '#9252AA' : '#F9E9FF',
            },
          ]}
          underlayColor="#9252AA"
          activeOpacity={1}
          disabled={!isDishSelected}>
		 
          <View style={styles.buttonContent}>
            <Text
              style={[
                styles.continueButtonLeftText,
                {color: isDishSelected ? 'white' : '#343333'},
              ]}>
			 
              Continue
            </Text>
            <Text
              style={[
                styles.continueButtonRightText,
                {color: isDishSelected ? 'white' : '#343333'},
              ]}>
			 
              {selectedCount} Items | ₹ {selectedDishPrice}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
      <View>
        <OrderWarning
          visible={isWarningVisibleForDishCount}
          title={'Maximum 12 dishes can be prepared at home!!!'}
          buttonText={'OK'}
          onClose={handleWarningClose}
        />

        <OrderWarning
          visible={isWarningVisibleForCuisineCount}
          title={'Maximum 3 Cuisines can be selected!'}
          buttonText={'OK'}
          onClose={handleWarningClose}
        />
      </View>
    </View>
  );
};

export default CreateOrderFoodDelivery;
