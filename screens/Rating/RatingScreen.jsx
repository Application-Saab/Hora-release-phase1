import React from 'react';
import { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Text, Image, TextInput, TouchableHighlight, Button, ImageBackground, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import { Rating } from '@rneui/base';

const RatingScreen = ({ navigation }) => {
    let base_url = 'https://horaservices.com:3000'
    useEffect(() => {
        fetchUserAccount(); // Fetch user profile data on component mount
    }, []);



    const fetchUserAccount = async () => {
        console.log("rating")
    };


    return (
        <View style={styles.container}>
            <View style={''}>
                <h1>{'Rahul Kumanr Gupta'}</h1>
                <p>Rate your over all experience. It helps us to improve </p>
                {/* {Rating} */}
            </View>
            <View>
                <View>
                    <Text>Appetizers(2)
                    </Text>
                    <View>
                        <ul>
                            <li>
                                <p>Tea</p>

                            </li>
                            <li>
                                <p>Poha</p>
                            </li>
                        </ul>
                    </View>
                </View>
                <View>
                    <Text>Main Course(3)
                    </Text>
                    <View>
                        <ul>
                            <li>
                                <p>Tawa Roti</p>
                            </li>
                            <li>
                                <p>Paneer tikka</p>
                            </li>
                            <li>
                                <p>Masala Dosa</p>
                            </li>
                            <li>
                                <p>Main</p>
                            </li>
                            <li>
                                <p>Paneer tikka</p>
                            </li>
                            <li>
                                <p>Masala Dosa</p>
                            </li>
                        </ul>
                    </View>

                </View>
                <View>
                    <Text>Appetizers
                    </Text>
                </View>
            </View>
            <View>
                <Text>Rate us for Cleanliness</Text>
                <View>
                    <Text>We would love to hear your special feedback/comment if any.</Text>
                </View>
            </View>
            <View>
                <TouchableHighlight style={styles.button}  underlayColor="#E56352">
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableHighlight> 
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: "20px",
        paddingRight: "21px",
        backgroundColor: 'white'
    }


});


export default RatingScreen;