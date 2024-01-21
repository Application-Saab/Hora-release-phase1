import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Dimensions, Linking, Image } from 'react-native';
import { BASE_URL, USER_DETAILS_ENDPOINT } from '../../utils/ApiConstants';
import CustomHeader from '../../components/CustomeHeader';


const FoodDelivery = ({ navigation }) => {
    const screenHeight = Dimensions.get('window').height - 30;

    const handlePage = () => {
        Linking.openURL('whatsapp://send?phone=+918982321487&text=Hello%20I%20wanted%20to%20know%20about%20food%20delivery%20service');
    }
    return (
        <ScrollView>
            <CustomHeader title={"Food Delivery"} navigation={navigation} />
            <View style={{ ...styles.container, height: screenHeight }}>
                <Image source={require('../../assets/foodDelivery1.png')} style={styles.image} />
                <Text style={{ color: "#9252AA", fontSize: 14, textAlign: "left", marginTop: 20, marginBottom: 20, paddingLeft: 20, paddingRight: 10 }}>
                    Prices begin at Rs 200 per person.
                    {"\n\n"}
                    Minimum bill must be Rs 1500.
                    {"\n\n"}
                    For further inquiries and to place an order, contact our customer support team.</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.customButton} activeOpacity={1} onPress={handlePage}>
                        <Text style={styles.buttonText}>Click here to book Order</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'top', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
        position: "relative",
        paddingTop:20
    },
    image: {
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.2,
        borderColor: "#ddd",
        borderWidth: 1,
    },
    buttonContainer: {
        backgroundColor: "#9252AA",
        width: 200,
        paddingVertical: 10,
        borderRadius: 5,
        justifyContent: "center", // Center the content vertically
        alignItems: "center", // Center the content horizontally
        alignSelf: "center", // Center the container within its parent
        marginTop: 0,
    },
    customButton: {
        textAlign: "center",
        marginHorizontal: "auto",
        marginVertical: 0,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        fontWeight: '700',
    }

});

export default FoodDelivery