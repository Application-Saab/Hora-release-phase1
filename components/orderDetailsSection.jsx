import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderDetailsSection = ({ OrderDetail, apiOrderId, orderId, orderType }) => {
    const [orderDate, setOrderDate] = useState('')

    const getOrderId = (e) => {
        const orderId1 = 10800 + e
        const updateOrderId = "#" + orderId1
        return updateOrderId;
    }

    
    
    const getOrderStatus = (orderStatusValue) => {
        if (orderStatusValue === 0) {
            return "Booked"
        }
        if (orderStatusValue == 1) {
            return "Accepted"
        }
        if (orderStatusValue === 2) {
            return "In-progress"
        }
        if (orderStatusValue === 3) {
            return "Completed"
        }
        if (orderStatusValue === 4) {
            return "Cancelled"
        }
        if (orderStatusValue === 5) {
            return ""
        }
        if (orderStatusValue === 6) {
            return "expire"
        }
    }

    const getOrderD = (e) => {
        try {
            if (!e || typeof e !== 'string') {
                throw new Error('Invalid date format');
            }

            const str = e.split("T");
            if (str.length < 2) {
                throw new Error('Invalid date format');
            }

            const d1 = new Date(str[0]);
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const month = months[d1.getMonth()];
            const dateValueUpdate = d1.getDate() + " " + month + " , " + d1.getFullYear();
            return dateValueUpdate;
        } catch (error) {
            console.error('Error processing date:', error.message);
            return null; // or handle the error in a way that makes sense for your application
        }
    };




    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: "#9252AA", paddingTop: 12, paddingBottom: 12, paddingLeft: 12, paddingRight: 12 }}>
                <Text style={{ color: "#fff", fontWeight: "500", fontSize: 13 }}>
                    {"OrderId:"}{'  '}{getOrderId(orderId)}
                </Text>
                <Text style={styles.orderstausclass}>{getOrderStatus(OrderDetail.order_status)}</Text>
            
            </View>
            <View style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 12, paddingRight: 12 }}>
                <Text>
                    <Image source={require('../assets/date.png')} style={{
                        height: 13,
                        width: 13,
                        marginLeft: 15,
                        marginVertical: 46,
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: 0,
                        marginBottom: 0
                    }} />

                </Text>
              
                    <Text style={styles.orderheadings}>{getOrderD(OrderDetail.order_date)}</Text>         

            </View> 
		
            <View style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 12, paddingRight: 12 }}>
                <Text>
                    <Image source={require('../assets/time-icon.png')} style={{
                        height: 13,
                        width: 13,
                        marginLeft: 15,
                        marginVertical: 46,
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: 0,
                        marginBottom: 0
                    }} />
                </Text>
									
                <Text style={styles.orderheadings}>{OrderDetail.order_time}</Text>
        	  
            </View>
            {orderType === 2  || orderType === 6 || orderType === 7 ? (
                <View style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 12, paddingRight: 12 }}>
                    <Text><Image source={require('../assets/icon3.png')} style={{
                        height: 13,
                        width: 13,
                        marginLeft: 15,
                        marginVertical: 46,
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: 0,
                        marginBottom: 0
                    }} />
                    </Text>
                    <Text style={styles.orderheadings}>{OrderDetail.no_of_people} {"People"}</Text>
                </View>
                ): null} 
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DFDFDF',
        display: "flex",
        flexDirection: "row",
        justifyContent: 'inherit',
        alignItems: 'center'
    },
    orderheadings: {
        color: "#9252AA",
        fontWeight: "600",
        fontSize: 11
    },
    orderstausclass:
    {
        backgroundColor: "rgb(169 123 185)",
        borderRadius: 15,
        // verticalAlign: "middile", // This is the invalid property
        fontWeight: "500",
        fontSize: 10,
        color: "#fff",
        textTransform: "capitalize",
        textAlign: "center",
        marginTop: 4,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0, // Typo: should be "marginBottom"
        paddingTop: 1,
        paddingBottom: 4, // Typo: should be "paddingBottom"
        paddingLeft: 0,
        width: "90%",
        display: "inline-block",
    }
})


export default OrderDetailsSection;