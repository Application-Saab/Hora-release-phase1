import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button , Linking , Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderDetailsSection from '../../components/orderDetailsSection';
import { ScrollView, TextInput, TouchableOpacity ,TouchableHighlight, ImageBackground, KeyboardAvoidingView } from 'react-native';
import OrderDetailsMenu from '../../components/OrderDetailsMenu';
import OrderDetailsIngre from '../../components/OrderDetailsIngre';
import CustomHeader from '../../components/CustomeHeader';
import OrderDetailsAppli from '../../components/OrderDetailsAppli';
import Orderlist from '../orderlist/Orderlist';
import { BASE_URL, ORDER_DETAILS_ENDPOINT, ORDER_CANCEL , GET_DECORATION_DETAILS} from '../../utils/ApiConstants';
// import Share from 'react-native-share';


    /// order.type is 2 for chef
    /// order.type is 1 for decoration
    /// order.type is 3 for hospitality service
	/// order type 4  bar tender
/// order type 5 cleaner
const OrderDetails = ({ navigation, route }) => {
    const [orderId, setOrderId] = useState('')
    const [orderDetail, setOrderDetail] = useState({})
    const [orderMenu, setOrderMenu] = useState([]);
    const [OrderAppl, setOrderAppl] = useState([]);
    const [orderIngredients, setOrderIngredients] = useState([]);
    const [selectedTab, setSelectedTab] = useState(1);
	const [decorationItems, setDecorationItems] = useState([]);
    const [hospitalityServiceCount , setHospitalityServiceCount] = useState(0);
    const [hospitalityServiceTotalAmount , setHospitalityServiceTotalAmount] = useState(0);
    const [decorationComments, setDecorationComments] = useState('');
															   
																			   
																						   
     const orderType = route.params.orderType
    
    const handleShareMenu = () => {
        console.log("ShareMenuWithGuest")
    }

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
        Linking.openURL(`whatsapp://send?phone=+918982321487&text=I've canceled my order, kindly assist with the refund process. Thanks!`);
    }

	const cancelcontactUsRedirection = () =>{
        Linking.openURL('whatsapp://send?phone=+918982321487&text=I%20have%20canceled%20my%20order%20kindly%20assist%20with%20the%20refund%20process%20Thanks!');

    }

    const handleRating = () => {
        alert("rate us")
    }

    // const sendInvite = (dishes) => {
    //     let message = `You are Invited!!!
    //     * * * * * *
    //     Enjoy the gathering with specially cooked by professional chef from hora `;

    //     message = message + dishes.order_date.slice(0, 10);

    //     message = message + ' ' + dishes.order_time;
      
    //     dishes.selecteditems.forEach((dish,index) => {
    //       message += '\n' + (index+1) + '. ' + dish.name;
    //     });

    //     if (dishes.addressId != null)
    //     {message = message + '\n At ' + dishes.addressId.address1 + ' ' + dishes.addressId.address2 +   `\nhttps://play.google.com/store/apps/details?id=com.hora`;}
      
    //     // Add the rest of your message here
    //     // ...
      
    //     const shareOptions = {
    //       message: message,
    //     };
      
    //     try {
    //       const ShareResponse = Share.open(shareOptions);
    //     } catch (error) {
    //       alert("error" + error);
    //     }
    //   };

    if (orderType === 2) {
        
        
        useEffect(() => {
            
            async function fetchOrderDetails() {
                try {
                    const response = await fetch(BASE_URL + ORDER_DETAILS_ENDPOINT + '/v1/' + route.params?.apiOrderId);
                    const responseData = await response.json();
                   

                    console.log(responseData.data.selecteditems);
                    setOrderDetail(responseData.data)
                    
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
            console.log("orderType1 decoration")
            async function fetchDecorationOrderDetails() {
                console.log("orderurl===" + BASE_URL + GET_DECORATION_DETAILS + '/' + route.params?.orderId)
                try {
                    const response = await fetch(BASE_URL + GET_DECORATION_DETAILS + '/' + route.params?.orderId);
                    const responseData = await response.json();
                    console.log("responseData11", responseData.data.items[0].decoration)
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
        console.log("orderType3")
        useEffect(() => {
            async function fetchOrderDetails() {
                try {
                    const response = await fetch(BASE_URL + ORDER_DETAILS_ENDPOINT + '/v1/' + route.params?.apiOrderId);
                    const responseData = await response.json();
                    setOrderDetail(responseData.data)
                    console.log("responseData.data" + JSON.stringify(responseData.data))
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
        console.log("no order type")
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
       
            alert('Order cancelled successfully');
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
                            {console.log("orderType here===" + orderType)}
                            <Tabs onSelectTab={handleTabChange} />
                            {selectedTab === 1 ? <OrderDetailsMenu OrderMenu={orderMenu} /> : selectedTab === 2 ? <OrderDetailsAppli OrderAppl={OrderAppl} /> : <OrderDetailsIngre OrderMenu={orderMenu} OrderDetail={orderDetail} />}
                        </View>
                    ) : orderType === 3 ? (
                        <View style={{ marginTop:10 ,  justifyContent: 'center', alignItems: 'center'  , marginTop:100}}>
                        <Image source={require('../../assets/waiter.jpeg')} style={{ width: 200, height: 200  , marginBottom:10}} />
                        <Text style={{fontWeight:"700"}}>You have booked Waiter for your event.</Text>
                        <Text>Number of Waiter: {hospitalityServiceCount}</Text>
                        <Text>Price: {hospitalityServiceTotalAmount}</Text>
                    </View>
                    ) : orderType === 4 ? (
                        // Add your rendering logic for orderType 4 here
                     <View style={{ marginTop:10 ,  justifyContent: 'center', alignItems: 'center' , marginTop:100 }}>
                        
                            <Image source={require('../../assets/bartender.jpg')} style={{width:200 , height:200  , marginBottom:10}}  />
                            <Text  style={{fontWeight:"700"}}>You have Bartender for your event.</Text>
                            <Text >Number of Bartender: {hospitalityServiceCount}</Text>
                            <Text>Price: {hospitalityServiceTotalAmount}</Text>
                        </View>
                    ) : orderType === 5 ? (

                        <View style={{ marginTop:10 ,  justifyContent: 'center', alignItems: 'center' , marginTop:100 }}>
                            <Image source={require('../../assets/cleaner.jpg')}style={{width:200 , height:200  , marginBottom:10}}  />

                            <Text  style={{fontWeight:"700"}}>You have booked Cleaner for your event.</Text>
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
                                                <Text style={{color:"black"}}>{getItemInclusion(product.inclusion)}</Text>
                                                
                                            </View>
                                        </View>
                                    </View>
                                ))}
                                <Text style = {{color:"black", fontWeight:"bold", paddingBottom:10}}>Your comments, if any:</Text>
                                <Text style = {{color:"black", paddingBottom:100}}>{decorationComments}</Text>
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
        color:'black'
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
        color:"#000",
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