import React, { useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, ScrollView, Pressable, TouchableOpacity , Dimensions} from 'react-native';
import CustomHeader from '../../components/CustomeHeader';

const FoodDeliveryPage = ({ navigation }) => {
  const route = useRoute();
  const bottomSheetRef = useRef(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const { category } = route.params;
  const openCatItems = (subCategory) => {
    navigation.navigate('CreateOrderFoodDelivery', { subCategory }, { navigation });
  }

  const [foodCat, setFoodCat] = useState([
    { id: '1', image: require('../../assets/Birthday_dec_cat.jpg'), name: 'Single Plate Meal', category: "fooddelivery" , subCategory:"SinglePlateMeal"},
    { id: '2', image: require('../../assets/first_night_cat_dec.jpg'), name: 'Live Buffet', category: "fooddelivery", subCategory:"LiveBuffet" },
    { id: '3', image: require('../../assets/aniversary_Cat_Dec.jpg'), name: 'Bulk Food Delivery', category: "fooddelivery" , subCategory:"BulkFoodDelivery"}
  ]);


  const filteredDecCat = foodCat.filter(item => item.category === category);

  return (
    <ScrollView>
      <CustomHeader title={"Select Categories"} navigation={navigation} />
      <View style={styles.container}>
        <View style={styles.decContainer}>
          {filteredDecCat.map((item, index) => (
            <Pressable key={index} onPress={() => openCatItems(item.subCategory)} style={styles.decImageContainer}>
              <Image source={item.image} style={styles.decCatimage} />
              {
                category === 'fooddelivery' ? '' :   <Text style={styles.itemName}>{item.name}</Text> 
              }
            </Pressable>
          ))}
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 10,
    position:'relative'
  },
  itemName: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    color: '#fff',
    marginHorizontal: 'auto',
    marginVertical: 0,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // shadow color
    textShadowOffset: { width: 0, height: 2 }, // shadow offset
    textShadowRadius: 2, // shadow radius
  },
  decImageContainer: {
    width: '48%', // Set to 48% width to fit two items in a row
    aspectRatio: 1, // Maintain the aspect ratio of the images
    textAlign: 'center',
  },
  decCatimage: {
    width: '100%', // Set to 100% width
    height: Dimensions.get('window').height*0.21,
    borderRadius: 10, // Optional: Add border-radius for rounded corners
  },
  decImageText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
    marginTop: 1,
    textAlign: 'left',
    paddingLeft: 8,
    marginTop: 2,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
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
  },
  bottomSheetWrapper: {
    backgroundColor: 'transparent',
  },
  draggableIcon: {
    backgroundColor: '#000',
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
});

export default FoodDeliveryPage;
