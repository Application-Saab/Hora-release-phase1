import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Text, View, Image, Button } from 'react-native';
import { BASE_URL, USER_DETAILS_ENDPOINT } from '../../utils/ApiConstants';
import CustomHeader from '../../components/CustomeHeader';


const Contact = ({ navigation }) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        fetchContactDetail();
    }, [])

    async function fetchContactDetail() {
        try {
            const response = await fetch(BASE_URL + USER_DETAILS_ENDPOINT)
            const responseData = await response.json();
            const contactData = responseData.data
            const phone = "+91" + " " + contactData.phone
            setEmail(contactData.email)
            setMobileNumber(phone)
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <ScrollView>
            <CustomHeader title={"Contact"} navigation={navigation} />
            <View style={styles.container}>
                <View>
                    <Image source={require('../../assets/contausimage.png')} style={{
                        width: 339,
                        height: 345
                    }} />
                </View>
                <View style={{
                    flexDirection: 'column', marginTop: 15, minHeight: 300
                }}>
                    <View>
                        <Text style={{
                            color: '#979797',
                            fontFamily: 'Roboto-Regular',
                            fontSize: 15,
                        }}>
                            Call us at
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 1,
                            padding: 10,
                            marginTop: 10,
                            marginBottom: 14,
                            marginLeft: 0,
                            marginRight: 0,
                            shadowColor: 'rgba(100, 100, 111, 0.2)',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 1,
                            shadowRadius: 20,
                            elevation: 2,
                        }}>
                            <Image source={require('../../assets/call-icon.png')}
                                style={{
                                    height: 49,
                                    marginLeft: 15,
                                    marginVertical: 46,
                                    width: 48,
                                    marginLeft: 0,
                                    marginRight: 0,
                                    marginTop: 0,
                                    marginBottom: 0
                                }}
                            />
                            <Text style={{
                                color: '#3F3F3F',
                                fontFamily: 'Roboto-Regular',
                                marginRight: 5,
                                fontSize: 16,
                                marginLeft: 30,
                                borderColor: '#9252AA',
                                fontWeight: 700
                            }}>
                                {mobileNumber}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text style={{
                                color: '#979797',
                                fontFamily: 'Roboto-Regular',
                                marginRight: 5,
                                fontSize: 15
                            }}>Email us at</Text>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderRadius: 1,
                                padding: 10,
                                marginTop: 10,
                                marginBottom: 14,
                                marginLeft: 0,
                                marginRight: 0,
                                shadowColor: 'rgba(100, 100, 111, 0.2)',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 1,
                                shadowRadius: 20,
                                elevation: 2,
                                // boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
                            }}>

                                <Image source={require('../../assets/email-icon.png')}
                                    style={{
                                        height: 49,
                                        marginLeft: 15,
                                        marginVertical: 46,
                                        width: 48,
                                        marginLeft: 0,
                                        marginRight: 0,
                                        marginTop: 0,
                                        marginBottom: 0
                                    }}
                                />
                                <Text style={{
                                    color: '#3F3F3F',
                                    fontFamily: 'Roboto-Regular',
                                    marginRight: 5,
                                    fontSize: 16,
                                    marginLeft: 30,
                                    fontWeight: 700
                                }}>
                                    {email}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: 'white',
        paddingTop: 20
    },
    contactnumber: {
        marginTop: 14
    }
});

export default Contact