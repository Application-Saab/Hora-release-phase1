import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable, Dimensions, ImageBackground, TouchableOpacity, TouchableHighlight } from 'react-native';
import CustomHeader from '../../components/CustomeHeader';
import { Picker } from '@react-native-picker/picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import { BASE_URL, GET_DECORATION_CAT_ID, GET_DECORATION_CAT_ITEM } from '../../utils/ApiConstants';
import axios from 'axios';
import Loader from '../../components/Loader';
import FastImage from 'react-native-fast-image';

const DecorationCatPage = ({ route, navigation }) => {
    const { subCategory } = route.params;
    const bottomSheetRef = useRef(null);
    const filterRef = useRef(null); // Ref for filter container
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedProductPrice, setSelectedProductPrice] = useState(0)
    const [selectedCount, setSelectedCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isProductSelected, setIsProductSelected] = useState(false);
    const [itemDetail, setItemDetail] = useState(null)
    const [catId, setCatId] = useState("")
    const [catalogueData, setCatalogueData] = useState([])
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState("all");
    const [themeFilter, setThemeFilter] = useState("all");
    const themeFilters = [
        { label: 'Select Theme', value: 'all' },
        { label: 'Jungle Theme', value: 'jungle' },
        { label: 'Car Theme', value: 'car' },
        { label: 'Unicorn Theme', value: 'unicorn' }
    ];
    const handleThemeFilter = (value) => {
        setThemeFilter(value);
    };
    const handleIncreaseQuantity = (item) => {
        const isItemAlreadySelected = selectedProducts.some(
            (product) => product._id === item._id
        );

        if (isItemAlreadySelected) {
            // Decrease quantity (remove item)
            const updatedProducts = selectedProducts.filter(
                (product) => product._id !== item._id
            );
            const updatedTotalPrice = totalPrice - parseInt(item.price);
            setSelectedProducts(updatedProducts);
            setTotalPrice(updatedTotalPrice);
            setSelectedCount(updatedProducts.length);
            setIsProductSelected(updatedProducts.length > 0);
        } else {
            // Increase quantity (add item)
            const updatedProducts = [...selectedProducts, item];
            const updatedTotalPrice = totalPrice + parseInt(item.price);
            setSelectedProducts(updatedProducts);
            setTotalPrice(updatedTotalPrice);
            setSelectedCount(updatedProducts.length);
            setIsProductSelected(true);
        }
    };




    const addDish = (selectedProducts, totalPrice) => {
        navigation.navigate('ProductDateSummary', { selectedProducts, totalPrice });
    }

    const openBottomSheet = (item, bottomSheetRef) => {
        setItemDetail(item)
        bottomSheetRef.current.open();

    };

    const closeBottomSheet = () => {
        setDishDetail(null)
        bottomSheetRef.current.close();
    };


    const getSubCatId = async () => {
        setLoading(true);
        try {
            const response = await axios.get(BASE_URL + GET_DECORATION_CAT_ID + subCategory);
            const categoryId = response.data.data._id;
            setCatId(categoryId);
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    const getSubCatItems = async () => {
        setLoading(true); // Show loader
        try {
            const response = await axios.get(BASE_URL + GET_DECORATION_CAT_ITEM + catId);
            setCatalogueData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.log("Error:", error.message);
        } finally {
            setLoading(false); // Hide loader after receiving the API response or in case of error
        }
    };

    useEffect(() => {
        getSubCatId();
    }, []);

    useEffect(() => {
        if (catId) {
            getSubCatItems();
        }
    }, [catId]);



    const getItemInclusion = (inclusion) => {
        const htmlString = inclusion[0];
        const withoutTags = htmlString.replace(/<[^>]*>/g, ''); // Remove HTML tags
        const withoutSpecialChars = withoutTags.replace(/&#[^;]*;/g, ' '); // Replace &# sequences with space
        const statements = withoutSpecialChars.split('<div>');
        const bulletedList = statements
            .filter(statement => statement.trim() !== '')
            .map(statement => `- ${statement.trim()}`);
        const combinedString = bulletedList.join(' ');
        const finalList = combinedString.split(/--|-/);
        const filteredList = finalList.filter(item => item.trim() !== '');
        return filteredList.map((item, index) => `${index + 1}: ${item.trim()}\n`);
    }


    const RenderBottomSheetContent = () => (
        <View>
        <View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <FastImage
                    source={{ uri: `https://horaservices.com/api/uploads/${itemDetail.featured_image}` }}
                    style={{
                        width: Dimensions.get('window').width,
                        height: 360,
                        aspectRatio: 1,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
            <View style={{ paddingLeft: 10, paddingTop: 10 }}>
                <Text style={{ color: '#9252AA', fontSize: 16, fontWeight: '500', textAlign: "left", marginBottom: 4 }}>
                    {itemDetail.name}
                </Text>
                <View style={{ width: 332.5, height: 1, backgroundColor: '#D3D3D3', marginBottom: 7 }} />
                <Text style={{ color: '#333', fontSize: 12, fontWeight: '500', lineHeight: 17, paddingRight: 20 }}>
                    {getItemInclusion(itemDetail.inclusion)}
                </Text>
            </View>
        </View>
    </View>
    );

    const filterCatalogueByTheme = (data, theme) => {
        if (theme === "all") {
            return data; // Return all products if "all" is selected
        }
        return data.filter(item => item.name.toLowerCase().includes(theme.toLowerCase()))
    };


    const filterCatalogueByPriceRange = (data, range) => {
        if (range === "all") {
            return data; // Return all products if "all" is selected
        }
        const [min, max] = range.split('-').map(Number);
        return data.filter(item => {
            const price = parseInt(item.price);
            return price >= min && price < max;
        });
    };



    return (
        <View style={styles.screenContainer}>
            <ScrollView>
                <CustomHeader title={"Select Design"} navigation={navigation} />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >  
                <View>
                <TouchableOpacity onPress={() => setPriceRange("all")} style={[styles.filterOption, priceRange === "all" && styles.selectedFilterOption]}>
                        <Text style={[styles.filterOptionText, priceRange === "all" && { color: 'white' }]}>All</Text>
                    </TouchableOpacity>
                </View>
             
                <View>
                <TouchableOpacity onPress={() => setPriceRange("0-2000")} style={[styles.filterOption, priceRange === "0-2000" && styles.selectedFilterOption]}>
                        <Text style={[styles.filterOptionText, priceRange === "0-2000" && { color: 'white' }]}>Under ₹ 2000</Text>
                    </TouchableOpacity>
                </View>
                  
                  <View>
                  <TouchableOpacity onPress={() => setPriceRange("2000-5000")} style={[styles.filterOption, priceRange === "2000-5000" && styles.selectedFilterOption]}>
                        <Text style={[styles.filterOptionText, priceRange === "2000-5000" && { color: 'white' }]}>₹ 2000 - ₹ 5000</Text>
                    </TouchableOpacity>
                
                  </View>

                  <View>
                  <TouchableOpacity onPress={() => setPriceRange("5000-50000")} style={[styles.filterOption, priceRange === "5000-50000" && styles.selectedFilterOption]}>
                        <Text style={[styles.filterOptionText, priceRange === "5000-50000" && { color: 'white' }]}>Above ₹ 5000</Text>
                    </TouchableOpacity>
                  </View>
                    
                </ScrollView>
                {subCategory === 'KidsBirthday' && (
                <View style={{paddingHorizontal:14 , marginTop:15}}>
                <View  style={{borderWidth:1, borderColor:"#9252AA" , backgroundColor:"#E0E0E0" , borderRadius:10}}>
               
                    <Picker
                    selectedValue={themeFilter}
                    onValueChange={(itemValue) => handleThemeFilter(itemValue)}
                    style={styles.picker}
                    >
                    {themeFilters.map((filter) => (
                    <Picker.Item key={filter.value} label={filter.label} value={filter.value} />
                    ))}
                    </Picker>
                   
                </View>
                </View>
                 )}  
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <Loader loading={loading} />
                    </View>
                ) : (
                    <View style={styles.container}>
                        <View style={styles.decContainer}>
                        {filterCatalogueByPriceRange(filterCatalogueByTheme(catalogueData, themeFilter), priceRange).map((item) => (                                <View style={{ width: Dimensions.get('window').width * 0.46 }}>
                                    <ImageBackground
                                        source={
                                            selectedProducts.some((product) => product._id === item._id)
                                                ? require('../../assets/Rectanglepurple.png')
                                                : require('../../assets/rectanglewhite.png')
                                        }
                                        style={{ width: "100%", height: Dimensions.get('window').height * 0.345, marginTop: 10 }}
                                        imageStyle={{ borderRadius: 16 }}
                                    >

<TouchableOpacity
    onPress={() => openBottomSheet(item, bottomSheetRef)}
    activeOpacity={1}
    key={item._id}
    style={styles.decImageContainer}
>
    <FastImage
        source={{ uri: `https://horaservices.com/api/uploads/${item.featured_image}` }}
        style={styles.decCatimage}
        resizeMode={FastImage.resizeMode.cover} // Adjust resizeMode as needed
    />
</TouchableOpacity>
                                        <Text
                                            style={{
                                                marginHorizontal: 3,
                                                textAlign: 'left',
                                                fontWeight: '600',
                                                fontSize: 11,
                                                color: 'transparent',
                                                opacity: 0.9,
                                                height: 28,
                                                marginTop: 7,
                                                paddingLeft: 5,
                                                marginBottom: 2,
                                                color: selectedProducts.some(product => product._id === item._id)
                                                    ? 'white' : '#9252AA',
                                            }}
                                        >
                                            {item.name}
                                        </Text>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 2, paddingLeft: 4, paddingRight: 10, justifyContent: 'space-between' }}>
                                            <Text style={{
                                                color: selectedProducts.some(product => product._id === item._id)
                                                    ? 'white' : '#9252AA',
                                                fontWeight: '700',
                                                fontSize: 17,
                                                opacity: 0.9,
                                            }}> ₹ {item.price}</Text>


                                            <TouchableOpacity onPress={() => handleIncreaseQuantity(item)}>
                                                <Image
                                                    source={
                                                        selectedProducts.some((product) => product._id === item._id)
                                                            ? require("../../assets/minus.png")
                                                            : require("../../assets/plus.png")
                                                    }
                                                    style={{ width: 21, height: 21 }}
                                                />
                                            </TouchableOpacity>
                                        </View>

                                    </ImageBackground>
                                </View>


                            ))}
                        </View>
                    </View>

                )}


            </ScrollView>

            <View style={{ paddingHorizontal: 16, paddingTop: 5, justifyContent: 'space-between' }}>
                <TouchableHighlight
                    onPress={() => addDish(selectedProducts, totalPrice)}
                    style={[
                        styles.continueButton,
                        {
                            backgroundColor: isProductSelected ? '#9252AA' : '#F9E9FF',
                            borderColor: isProductSelected ? '#9252AA' : '#F9E9FF',
                        },
                    ]}
                    underlayColor="#9252AA"
                    activeOpacity={1}
                    disabled={!isProductSelected}
                >
                    <View style={styles.buttonContent}>
                        <Text
                            style={[
                                styles.continueButtonLeftText,
                                { color: isProductSelected ? 'white' : '#343333' },
                            ]}
                        >
                            Continue
                        </Text>
                        <Text
                            style={[
                                styles.continueButtonRightText,
                                { color: isProductSelected ? 'white' : '#343333' },
                            ]}
                        >
                            {selectedCount} Items | ₹ {totalPrice}
                        </Text>

                    </View>
                </TouchableHighlight>
            </View>

            <RBSheet
                ref={bottomSheetRef}
                closeOnDragDown={[true, closeBottomSheet]}
                height={700}
                customStyles={{
                    container: styles.bottomSheetContainer,
                    wrapper: styles.bottomSheetWrapper,
                    draggableIcon: styles.draggableIcon,
                }}
            >
                <RenderBottomSheetContent />

            </RBSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    container: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 2,
    },
    decContainer: {
        flexDirection: 'row',
        padding: 0,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap', // Allow items to wrap to the next line
    },
    decImageContainer: {
        width: '100%', // Set to 48% width to fit two items in a row
        aspectRatio: 1, // Maintain the aspect ratio of the images
        textAlign: 'center',
        elevation: 2, // Android shadow (adjust as needed)
        shadowColor: '#000',
        shadowOffset: {
        },
        shadowOpacity: 0.14,
        shadowRadius: 16,
        padding: 5
    },
    decCatimage: {
        width: Dimensions.get('window').width * 0.435, // Set to 100% width
        height: Dimensions.get('window').height * 0.21,
        borderRadius: 10, // Optional: Add border-radius for rounded corners
    },
    decImageText: {
        fontSize: 14,
        color: '#444',
        fontWeight: '500',
        textAlign: 'left',
        paddingLeft: 33,
    },
    catalogueTitle: {
        fontWeight: '600',
        fontSize: 16,
        color: '#000',
        textAlign: 'left',
        paddingLeft: 20,
        paddingTop: 10,
        paddingBottom: 0,
    },
    bottomButtonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        padding: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bottomSheetContainer: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 2,
        borderColor: "#9252AA",
    },
    bottomSheetWrapper: {
        backgroundColor: 'transparent',
    },
    draggableIcon: {
        backgroundColor: '#9252AA',
    },
    bottomSheetItem: {
        alignItems: 'center',
        marginVertical: 20,
    },
    bottomSheetItemImage: {
        width: 330,
        height: 400,
        borderRadius: 10,
    },
    bottomSheetItemText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
    },
    continueButton: {
        marginTop: 10,
        backgroundColor: 'gray',
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 21,
        paddingEnd: 20,
        paddingVertical: 17,
        borderRadius: 20,
    },
    buttonContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
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

    pickerContainer: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#9252AA', // Red border color
        paddingHorizontal: 10,
        marginTop: 20,
        width: '98%', // Adjust width according to your design
        backgroundColor: "#E0E0E0",
    },
    picker: {
        width: '100%',
        color: '#9252AA', // Grey text color
    },
    filterContainer: {
        flexDirection: 'row',
       // paddingVertical: 10,
       paddingTop:10,
        paddingHorizontal: 20,
        alignItems: 'center', // Center items vertically
        overflow: 'scroll', // Allow horizontal scrolling if needed
    },
    filterOption: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#E0E0E0',
       // minWidth: 100, // Set minimum width for each filter option
    },
    selectedFilterOption: {
        backgroundColor: '#9252AA',
    },
    filterOptionText: {
        color: '#9252AA',
    },
    picker: {
        width: '98%',
        color: '#9252AA', // Grey text color
        borderWidth: 1,
        borderColor: '#9252AA', // Border color
        borderRadius: 5, // Border radius
    },});

export default DecorationCatPage;
