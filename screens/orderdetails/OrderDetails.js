import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Alert, Linking  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderDetailsSection from '../../components/orderDetailsSection';
import { ScrollView, TextInput, TouchableOpacity, TouchableHighlight, ImageBackground, KeyboardAvoidingView } from 'react-native';
import OrderDetailsMenu from '../../components/OrderDetailsMenu';
import OrderDetailsFoodMenu from '../../components/OrderDetailsFoodMenu';
import OrderDetailsIngre from '../../components/OrderDetailsIngre';
import CustomHeader from '../../components/CustomeHeader';
import OrderDetailsAppli from '../../components/OrderDetailsAppli';
import Orderlist from '../orderlist/Orderlist';
import { BASE_URL, ORDER_DETAILS_ENDPOINT, ORDER_CANCEL, GET_DECORATION_DETAILS } from '../../utils/ApiConstants';
// import Share from 'react-native-share';


/// order.type is 2 for chef
/// order.type is 1 for decoration
/// order.type is 3 for waiter
/// order type 4  bar tender
/// order type 5 cleaner
/// order type 6 Food Delivery
/// order type 7 Live Catering
const OrderDetails = ({ navigation, route }) => {
    const [orderId, setOrderId] = useState('')
    const [orderDetail, setOrderDetail] = useState({})
    const [orderMenu, setOrderMenu] = useState([]);
    const [OrderAppl, setOrderAppl] = useState([]);
    const [orderIngredients, setOrderIngredients] = useState([]);
    const [selectedTab, setSelectedTab] = useState(1);
    const [decorationItems, setDecorationItems] = useState([]);
    const [hospitalityServiceCount, setHospitalityServiceCount] = useState(0);
    const [hospitalityServiceTotalAmount, setHospitalityServiceTotalAmount] = useState(0);
    const [decorationComments, setDecorationComments] = useState('');
    const [peopleCount, setPeopleCount] = useState(0);
    const [water, setWater] = useState(0);
    const [orderCancel, setOrderCancel] =
        useState(false);


    const orderType = route.params.orderType



    const Tabs = ({ onSelectTab }) => (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
                onPress={() => onSelectTab(1)}
                style={[
                    styles.tab,
                    styles.leftTab,
                    selectedTab === 1 ? styles.activeTab : styles.inactiveTab,
                ]}
            >
                <Text style={[styles.tabText, selectedTab === 1 ? styles.activeTabText : styles.inactiveTabText]}>
                    Menu
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onSelectTab(2)}
                style={[
                    styles.tab,
                    styles.centerTab,
                    selectedTab === 2 ? styles.activeTab : styles.inactiveTab,
                ]}
            >
                <Text style={[styles.tabText, selectedTab === 2 ? styles.activeTabText : styles.inactiveTabText]}>
                    Appliances
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onSelectTab(3)}
                style={[
                    styles.tab,
                    styles.rightTab,
                    selectedTab === 3 ? styles.activeTab : styles.inactiveTab,
                ]}
            >
                <Text style={[styles.tabText, selectedTab === 3 ? styles.activeTabText : styles.inactiveTabText]}>
                    Ingredient
                </Text>
            </TouchableOpacity>
        </View>
    );

    const handleTabChange = (tabNumber) => {
        setSelectedTab(tabNumber);
    };


    const contactUsRedirection = () => {
        Linking.openURL(`whatsapp://send?phone=+917338584828&text=I've canceled my order, kindly assist with the refund process. Thanks!`);
    }

    const cancelcontactUsRedirection = () => {
        Linking.openURL('whatsapp://send?phone=+917338584828&text=I%20have%20canceled%20my%20order%20kindly%20assist%20with%20the%20refund%20process%20Thanks!');

    }

    const handleRating = () => {
        alert("rate us")
    }

    if (orderType === 2 || orderType === 6 || orderType === 7) {


        useEffect(() => {

            async function fetchOrderDetails() {
                try {
                    const response = await fetch(BASE_URL + ORDER_DETAILS_ENDPOINT + '/v1/' + route.params?.apiOrderId);
                    const responseData = await response.json();
                    setOrderDetail(responseData.data)

                    setPeopleCount(responseData.data.no_of_people)
                    setWater(responseData.data.no_of_burner)
                    setOrderMenu(responseData.data.selecteditems)
                    setOrderAppl(responseData.data.orderApplianceIds)
                    setOrderIngredients(responseData.data.ingredientUsed)
                }
                catch (error) {
                    console.log(error)
                }
            }
            fetchOrderDetails();

        }, [])
    }
    else if (orderType === 1) {
        useEffect(() => {

            async function fetchDecorationOrderDetails() {
                try {
                    const response = await fetch(BASE_URL + GET_DECORATION_DETAILS + '/' + route.params?.orderId);
                    const responseData = await response.json();
                    setOrderDetail(responseData.data._doc)
                    setDecorationItems(responseData.data.items[0].decoration)
                    setDecorationComments(responseData.data._doc.decoration_comments)
                }
                catch (error) {
                    console.log(error)
                }
            }
            fetchDecorationOrderDetails()
        }, [])
    }
    if (orderType === 3 || orderType === 4 || orderType === 5) {
        useEffect(() => {
            async function fetchOrderDetails() {
                try {
                    const response = await fetch(BASE_URL + ORDER_DETAILS_ENDPOINT + '/v1/' + route.params?.apiOrderId);
                    const responseData = await response.json();
                    setOrderDetail(responseData.data)

                    setHospitalityServiceCount(responseData.data.no_of_people)
                    setHospitalityServiceTotalAmount(responseData.data.total_amount)
                }
                catch (error) {
                    console.log(error)
                }
            }
            fetchOrderDetails()

        }, [])
    }
    else {

    }

    const getItemInclusion = (inclusion) => {
        const htmlString = inclusion[0];
        const withoutDivTags = htmlString.replace(/<\/?div>/g, '');
        const withoutBrTags = withoutDivTags.replace(/<\/?br>/g, '');
        const statements = withoutBrTags.split('<div>');
        const bulletedList = statements
            .filter(statement => statement.trim() !== '')
            .map(statement => `- ${statement.trim()}`);
        const combinedString = bulletedList.join(' ');
        const finalList = combinedString.split(/--|-/);
        const filteredList = finalList.filter(item => item.trim() !== '');
        return filteredList.map((item, index) => `${index + 1}: ${item.trim()}\n`);
    }

    async function cancelOrder() {
        // Show confirmation prompt
        Alert.alert(
            "Confirm",
            "Are you sure you want to cancel this order?",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => performCancelOrder()
                }
            ],
            { cancelable: false }
        );
    }
    
    async function performCancelOrder() {
        try {
            const token = await AsyncStorage.getItem("token");
    
            const response = await fetch(BASE_URL + ORDER_CANCEL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id: route.params.apiOrderId,
                    Authorisation: token
                })
            }); // Replace with your API endpoint for updating user profile
    
            // Handle success response
            navigation.navigate("OrderList");
        } catch (error) {
            // Handle error response
            console.log('Error updating profile:', error);
        }
    }

    return (

        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <CustomHeader title={"Order Details"} navigation={navigation} />


            <View style={styles.container}>

                <OrderDetailsSection OrderDetail={orderDetail} orderId={route.params?.orderId} orderType={orderType} />


                <View>
                    {orderType === 2 ? (
                        <View style={styles.tabSec}>

                            <Tabs onSelectTab={handleTabChange} />
                            {selectedTab === 1 ? <OrderDetailsMenu OrderMenu={orderMenu} /> : selectedTab === 2 ? <OrderDetailsAppli OrderAppl={OrderAppl} /> : <OrderDetailsIngre OrderMenu={orderMenu} OrderDetail={orderDetail} />}
                        </View>
                    )
                        : orderType === 6 ? (

                            <View style={styles.tabSec}>
                                {<OrderDetailsFoodMenu OrderMenu={orderMenu} OrderType={orderType} NoOfPeople={peopleCount} />}
                                <View style={{ backgroundColor: "#fff", marginTop: 7, padding: 10 }}>
                                    <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 6 }}>Inclusions:</Text>
                                    <View style={{ width: '100%' }}>
                                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                            <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                            <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 6 }}> Disposal and Water Bottle: {peopleCount * water} </Text>
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                            <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                            <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 6 }}> Food Delivery at Door-step</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                            <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                            <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 10 }}>Free Delivery</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                            <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                            <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 10 }}>Hygienically Packed boxes</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                            <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                            <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 7 }}> Freshly Cooked Food</Text>
                                        </View>

                                    </View>

                                </View>
                            </View>
                        )
                            : orderType === 7 ? (
                                <View style={styles.tabSec}>
                                    {<OrderDetailsFoodMenu OrderMenu={orderMenu} OrderType={orderType} NoOfPeople={peopleCount} />}
                                    <View style={{ backgroundColor: "#fff", marginTop: 7  , padding:10 , flexWrap:"wrap" }}>
                                        <Text style={{ color: '#9252AA', fontWeight: '700', marginLeft: 5, fontSize: 12 }}>
                                        <View style={{ width: '100%' }}>
                                           <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 1 }}>  Well Groomed Waiters (2 Nos)</Text>
                            </View>
                            <View style={{ flexDirection: "row", alignItems: "center", width: "90%" }}>
                                <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 4, flex: 1, flexWrap: 'wrap' }}> Bone-china Crockery & Quality disposal for loose items.</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 6 }}>Transport (to & fro)</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 8 }}>Dustbin with Garbage bag</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 4 }}> Head Mask for waiters & chefs</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 7 }}>Tandoor/Other cooking Utensiles</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 8 }}>Chafing Dish</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 8 }}>Cocktail Napkins</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 8 }}>2 Chef</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 9 }}>Water Can (Bisleri)(20 litres)</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                                <Image source={require('../../assets/tick.jpg')} style={{ height: 16, width: 16 }} />
                                <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 9 }}>Hand gloves</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "90%" }}>
                                <Image source={require('../../assets/exclusion.jpg')} style={{ height: 16, width: 16 }} />
                                <Text style={{ color: '#9252AA', fontWeight: '700', paddingLeft: 7, flex: 1, flexWrap: 'wrap' }}>Exclusion: Buffet table/kitchen table is in client scope (can be provided at additional cost)</Text>
                            </View>
                                           </View>
                                        </Text>
                                    </View>
                                </View>
                            )
                                :
                                orderType === 3 ? (
                                    <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                                        <Image source={require('../../assets/waiter.jpeg')} style={{ width: 200, height: 200, marginBottom: 10 }} />
                                        <Text style={{ fontWeight: "700" }}>You have booked Waiter for your event.</Text>
                                        <Text>Number of Waiter: {hospitalityServiceCount}</Text>
                                        <Text>Price: {hospitalityServiceTotalAmount}</Text>
                                    </View>
                                ) : orderType === 4 ? (
                                    // Add your rendering logic for orderType 4 here
                                    <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>

                                        <Image source={require('../../assets/bartender.jpg')} style={{ width: 200, height: 200, marginBottom: 10 }} />
                                        <Text style={{ fontWeight: "700" }}>You have Bartender for your event.</Text>
                                        <Text >Number of Bartender: {hospitalityServiceCount}</Text>
                                        <Text>Price: {hospitalityServiceTotalAmount}</Text>
                                    </View>
                                ) : orderType === 5 ? (

                                    <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                                        <Image source={require('../../assets/cleaner.jpg')} style={{ width: 200, height: 200, marginBottom: 10 }} />

                                        <Text style={{ fontWeight: "700" }}>You have booked Cleaner for your event.</Text>
                                        <Text>Number of Cleaner: {hospitalityServiceCount}</Text>
                                        <Text>Price: {hospitalityServiceTotalAmount}</Text>
                                    </View>
                                ) : (
                                    <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
                                        <View style={styles.selectedProductsContainer}>
                                            {decorationItems.map(product => (
                                                <View>
                                                    <View key={product.id} style={styles.productContainer}>
                                                        <View>
                                                            <Image source={{ uri: `https://horaservices.com/api/uploads/${product.featured_image}` }} style={styles.productImage} />
                                                        </View>
                                                        <View style={{ width: '50%' }}>
                                                            <Text style={styles.productName}>{product.name}</Text>
                                                            <Text style={styles.productPrice}>₹{product.price}</Text>
                                                            <Text style={{ color: "black" }}>{getItemInclusion(product.inclusion)}</Text>

                                                        </View>
                                                    </View>
                                                </View>
                                            ))}
                                            {decorationComments ? <Text style={{ color: "black", fontWeight: "bold", paddingBottom: 10 }}>Additional Comments:</Text> : ""}
                                            <Text style={{ color: "black", paddingBottom: 100 }}>{decorationComments}</Text>
                                        </View>
                                    </View>
                                )}

                </View>



                <View>
                    <View>
                        {orderDetail.order_status === 0 || orderDetail.order_status === 1 ||
                            orderDetail.order_status === 2 ? (
                            <TouchableHighlight style={styles.ratingbutton} underlayColor="#E56352" onPress={cancelOrder}>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <View><Text style={styles.ratingbuttonText} onPress={cancelOrder}>Cancel Order</Text></View>
                                </View>
                            </TouchableHighlight>

                        ) : null}

                    </View>
                    <View>
                        {orderDetail.order_status === 4 ?

                            <TouchableHighlight style={styles.ratingbutton} underlayColor="#E56352" onPress={cancelcontactUsRedirection}>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <View><Text style={styles.ratingbuttonText}>Initiate Refund</Text></View>
                                </View>
                            </TouchableHighlight>
                            :
                            ''
                        }
                    </View>


                    <View>
                        {orderDetail.order_status === 3 ?

                            <TouchableHighlight style={styles.ratingbutton} underlayColor="#E56352" onPress={contactUsRedirection}>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                    <View><Text style={styles.ratingbuttonText}>Share Your Feedback With Us</Text></View>
                                </View>
                            </TouchableHighlight>
                            :
                            ''
                        }
                    </View>
                </View>
            </View>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    container: {
        backgroundColor: '#F2F2F2',
    },
    innercontainer: {
        paddingLeft: 15,
        paddingRight: 15
    },
    tabSec: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 15,
        borderRadius: 20,
    },
    ratingbutton: {
        height: 47,
        backgroundColor: '#9252AA',
        marginHorizontal: 31,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 20,
        width: '88%',
        marginTop: 15,
        marginBottom: 10,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    cancelbutton: {
        height: 47,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#9252AA',
        marginHorizontal: 31,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginBottom: 10,
        width: "88%",
        marginTop: 1,
        marginBottom: 20,
        marginLeft: "auto",
        marginRight: "auto"
    },
    cancelbuttonText: {
        textAlign: 'center', // Center the text horizontally
        color: '#9252AA',
        fontSize: 18,
        fontWeight: "500"
    },
    ratingbuttonText: {
        textAlign: 'center', // Center the text horizontally
        color: 'white',
        fontSize: 18,
        fontWeight: "500"
    },

    cancelorderbox: {
        borderWidth: 1,
        borderColor: '#FFA4A4',
        marginBottom: 40,
        marginLeft: 'auto',
        width: "85%",
        marginRight: 'auto',
        padding: 20, // Use 'padding' instead of separate properties
        borderRadius: 5, // Adjust the value based on your preference
        backgroundColor: 'rgba(255, 164, 164, 0.2)', // Adjust the alpha value as needed
    },
    cancelorderboxtext1: {
        fontWeight: "500",
        marginBottom: 0,
        color: 'black'
    },
    cancelorderboxtext2: {
        fontWeight: "500",
        color: "#FF2929",
        textAlign: "center",
        marginTop: 0,
        marginBottom: 11
    },
    tab: {
        flex: 1,
        padding: 10,
    },
    tabText: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 14,
    },
    leftTab: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    rightTab: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    centerTab: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    activeTab: {
        backgroundColor: 'white',
    },
    activeTabText: {
        color: "#B16BCB",
    },
    inactiveTab: {
        backgroundColor: '#D9D9D9',
    },
    inactiveTabText: {
        color: '#969696',
    },
    selectedProductsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: 15
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
        fontWeight: '900',
        marginTop: 10,
        color: "#000",
    },
    productId: {
        fontSize: 14,
        color: '#555',
    },
    productPrice: {
        fontSize: 12,
        color: '#555',
    },
})


export default OrderDetails;