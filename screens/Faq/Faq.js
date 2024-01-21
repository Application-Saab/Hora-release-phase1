import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Linking } from 'react-native';
import CustomHeader from "../../components/CustomeHeader";

const Faq = ({ navigation }) => {
    const [expandedQuestions, setExpandedQuestions] = useState([]);

    const toggleAnswer = (index) => {
        if (expandedQuestions.includes(index)) {
            setExpandedQuestions(expandedQuestions.filter(item => item !== index));
        } else {
            setExpandedQuestions([...expandedQuestions, index]);
        }
    };

    const handlePage = () => {
        Linking.openURL('whatsapp://send?phone=+918982321487&text=I%20wanted%20to%20know%20more%20about%20your%20services');
    }

    const faqData = [
        {
            question: "How does the Chef for party work?",
            answer: "In Chef for party service , After you have booked your order by selecting the dishes, date, time of event, You can check the list of ingredients with quantity in order detail screen. These ingredients are easy to procure from online stores or local shops. Chef would come, Cook in your kitchen using your ingredients, Clean the Platform and leave.",
        },
        {
            question: "How does the decoration service work?",
            answer: "In the decoration service, After you have booked your order by selecting the design, date, time of execution. The decoration executor would come to your selected location with material. Will execute the service and leave. In case some of the items are to be taken back, the executor would come on next day and take the rental items back.",
        },
        {
            question: "How does the Hospitality service (Waiter/Cleaner/Bartender) work?",
            answer: "In the Hospitality service (Waiter/Cleaner/Bartender) service , After you have booked your order by selecting the date, time slot of service. Service providers would come at the given location/time slot and serve for 4 hours.",
        },
        {
            question: "How to Contact the Chef/Decorator/Waiter/Cleaner?",
            answer: "Currently we don't provide Chef/Decorator/Waiter/Cleaner personal information on the platform. If you have any query regarding your booking / ingredients / timing / menu / service hours / arrival time / preparations needed etc., please reach out to our support system. \n\n The Customer Support team will be happy to help you.\n\nNOTE:\n- In case the Chef/Decorator/Waiter/Cleaner is unable to find your location, he will call you.",
        },
        {
            question: "What time will the service provider reach?            ",
            answer: "Please check the date and timing mentioned in your booking details. Service providers shall reach on time (consider a 30 minute buffer)  at the address shared by you.",
        },
        {
            question: "What Preparations I need to do one night before my booking - Chef for the party?",
            answer: "Details of any preparation required to be done at your end, would be available in the order details",
        },
        {
            question: "How to Reschedule or Add dish / Replace dish / Change menu in my booking?",
            answer: "Hora, works towards mapping you to the best possible service provider on a platform which can match your Menu with maximum rating. Reschedule or order editing cannot be done. You can cancel the booking and place a new booking.",
        },
        {
            question: "When can I cancel my booking?",
            answer: "Customers can cancel the booking any time. If the order status has not changed to “Accepted”, 100% of the amount will be refunded, otherwise 50% of advance will be deducted as cancellation charges to compensate the service provider.",
        },
        {
            question: "How to change Number of People in my booking?",
            answer: "To increase the number of people in your booking, reach out to our customer support team. The new quantity of members will be updated to Chef.\n\nNote: A charge of ₹49 per head will be added to your Total bill.\n\n- We cannot reduce the number of people after an order is placed, but we can increase it.",
        },
        {
            question: "How to give ratings to the chef?",
            answer: "After order completion, you will receive an option to rate the service on the app Home page. You can rate the chef after the service is completed. You can rate the chef on 2 factors:\n1. Taste of dishes\n2. Cleanliness\nWe track the punctuality of the Chef at our end.",
        },
        {
            question: "Can I get Add On Services?",
            answer: "Sure! To request for any add-on service by reaching our customer support team, \n\nDifferent kind of services available are:\n\n- Appliances on Rent\n\n- Entertainer\n\n- DJ. \n\nWe accept the add on service basis city and availability of the service provider.",
        },
        {
            question: "Is your service reliable?",
            answer: "We verify, train and do background checks of all service providers. Our chefs are from the top restaurants in the city and have at least 7 years of experience. We have a 10 step verification process to make sure we deliver the best service providers in the city. ",
        },
        {
            question: "How many people can you serve?",
            answer: "We can serve up to 100 people. Call us at +91-8982321487 if your gathering is bigger than 50 people. ",
        },
        {
            question: "Will a Chef be sufficient for my party?",
            answer: "For small parties, 1 Chef is enough. For big parties, 1 Chef + 1 Assistant Chef. System will calculate and show if Assistant Chef is required for your party.",
        },
        {
            question: "What about Utensils and Appliances?",
            answer: "We use your kitchen's utensils and appliances. List of special appliances required is shared in the order details. In case you do not have some appliance, we suggest dish alternatives.",
        },
        {
            question: "What are your Charges?",
            answer: "Charges depend on the number of people and number of dishes. The total amount is shown in the Payment Summary before you confirm the booking",
        },


    ];

    useEffect(() => {
        // Open the first question by default
        setExpandedQuestions([0]);
    }, []);

    return (
        <View style={styles.screenContainer}>
            <ScrollView>
                <CustomHeader title={"Faq"} navigation={navigation} />
                <View style={styles.container}>
                    <Text style={{ color: "#9252AA", fontSize: 20, fontWeight: "600", paddingVertical: 10 }}>{'TOP QUESTIONS'}</Text>
                    <View>
                        {faqData.map((item, index) => (
                            <View key={index} style={{ borderColor: "#D9D9D9", borderWidth: 1, marginVertical: 10, paddingHorizontal: 20, paddingVertical: 20, borderRadius: 10 }}>
                                <TouchableOpacity onPress={() => toggleAnswer(index)}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 14, color: "#000", fontWeight: "600" }}>{item.question}</Text>
                                        <Text style={{ color: "#9252AA", fontSize: 20 }}>{expandedQuestions.includes(index) ? ' -' : ' +'}</Text>
                                    </View>
                                </TouchableOpacity>
                                {expandedQuestions.includes(index) && <Text style={{ fontSize: 14, color: "#000", fontWeight: "400" }}>{item.answer}</Text>}
                            </View>
                        ))}
                    </View>
                </View>

            </ScrollView>
            <View style={styles.shadowContainer}>
                <View style={styles.container}>
                    <Text style={{ fontSize: 12, color: "#000", textAlign: "center", fontWeight: "600" }}>Still stuck? Help us a call away</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.customButton} activeOpacity={1} onPress={handlePage}>
                            <Text style={styles.buttonText}>Contact Us</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'white',
        paddingTop: 5
    },
    screenContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    buttonContainer: {
        backgroundColor: "#9252AA",
        width: "100%",
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: "center", // Center the content vertically
        alignItems: "center", // Center the content horizontally
        alignSelf: "center", // Center the container within its parent
        marginTop: 10,
        marginBottom: 20,
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
    },
    shadowContainer: {
        backgroundColor: 'white',
        elevation: 5, // For Android
        ...Platform.select({
            ios: {
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 5,
            },
        }),
        padding: 4,
        borderRadius: 10,
    },
});

export default Faq;
