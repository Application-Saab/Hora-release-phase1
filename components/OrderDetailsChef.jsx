import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

const OrderDetailsChef = ({ OrderDetail }) => {

    useEffect(() => {
        // getOrderId()
    }, [])
    return (
        <View style={styles.container}>
            {OrderDetail.order_status == '4' ? '' :
                <View>
                    <Image source={require('../assets/Frame.png')} style={styles.chefimage} />
                </View>
            }
        </View>
    )

    
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10
    },
    chefmidsec: {
        display: "flex",
        justifyContent: 'space-around',
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        marginTop: 10
    },
    image: {
        height: 59,
        width: 59,
        marginLeft: 15,
        marginVertical: 46,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        // boxShadow: "0 0 5px #9f9e9e",
    },
    chefimage: {
        height: 179,
        maxWidth: "100%",
        borderRadius: 10,
        marginBottom: 10,
        // boxShadow: "0 0 5px #9f9e9e",
    },
    imagebanner: {
        backgroundSize: "contain",
        opacity: 1,
        // boxShadow: "0 0 5px #9f9e9e",
    }
})


export default OrderDetailsChef;