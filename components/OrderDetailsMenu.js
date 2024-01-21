import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { ScrollView } from  'react-native';
										   

const OrderDetailsMenu = ({ OrderMenu }) => {
  var Appetizer = [];
  var Breads = [];
  var Breakfast = [];
  var Dessert = [];
  var Maincourse = [];
  var Mocktails = [];
  var SaladPapad = [];
  var SoupBeverages = [];
  OrderMenu.forEach((item) => {
    if (item.mealId[0].name === 'Appetizer') {
      Appetizer.push({ name: item.name, image: item.image, price: item.price });
    }
    else if (item.mealId[0].name === 'Breads, Rice and Raita') {
      Breads.push({ name: item.name, image: item.image, price: item.price });
    }
    else if (item.mealId[0].name === 'Breakfast') {
      Breakfast.push({ name: item.name, image: item.image, price: item.price });
    }
    else if (item.mealId[0].name === 'Dessert') {
      Dessert.push({ name: item.name, image: item.image, price: item.price });
    }
    else if (item.mealId[0].name === 'Main course') {
      Maincourse.push({ name: item.name, image: item.image, price: item.price });
    }
    else if (item.mealId[0].name === 'Mocktails') {
      Mocktails.push({ name: item.name, image: item.image, price: item.price });
    }
    else if (item.mealId[0].name === 'Salad & Papad') {
      SaladPapad.push({ name: item.name, image: item.image, price: item.price });
    }
    else if (item.mealId[0].name === 'Soups & Beverages') {
      SoupBeverages.push({ name: item.name, image: item.image, price: item.price });
    }
  });
  return (
    <ScrollView style={styles.orderCon}>
      {Appetizer.length > 0 && (
        <View style={styles.foodItemsContainer}>
          <View>
            <Text style={styles.menuCat}>{'Appetizer'} {"(" + Appetizer.length + ")"}</Text>
          </View>
          <View style={styles.foodItemsSecContainer}>
            {Appetizer.map((item, index) => (
              <View key={index} style={styles.foodItem}>
                <View style={styles.foodItemImageContainer}>
                  <Image source={{ uri: `https://horaservices.com/api/uploads/${item.image}` }} style={styles.foodItemImage} />
                </View>
                <View style={styles.foodItemDetails}>
                <Text style={styles.foodItemName}>{item.name}</Text>

                </View>
              </View>
            ))}
          </View>

        </View>
      )}
      {Breads.length > 0 && (
        <View style={styles.foodItemsContainer}>
          <View>
            <Text style={styles.menuCat}>{'Breads, Rice and Raita'} {"(" + Breads.length + ")"}</Text>
          </View>
          <View style={styles.foodItemsSecContainer}>
            {Breads.map((item, index) => (
              <View key={index} style={styles.foodItem}>
                <View style={styles.foodItemImageContainer}>
                  <Image source={{ uri: `https://horaservices.com/api/uploads/${item.image}` }} style={styles.foodItemImage} />
                </View>
                <View style={styles.foodItemDetails}>
                <Text style={styles.foodItemName}>{item.name}</Text>

                </View>
              </View>
            ))}
          </View>

        </View>
      )}
      {Breakfast.length > 0 && (
    <View style={styles.foodItemsContainer}>
      <View>
        <Text style={styles.menuCat}>{'Breakfast'} {"(" + Breakfast.length + ")"}</Text>
      </View>
      <View style={styles.foodItemsSecContainer}>
        {Breakfast.map((item, index) => (
          <View key={index} style={styles.foodItem}>
            <View style={styles.foodItemImageContainer}>
              <Image source={{ uri: `https://horaservices.com/api/uploads/${item.image}` }} style={styles.foodItemImage} />
            </View>
            <View style={styles.foodItemDetails}>
            <Text style={styles.foodItemName}>{item.name}</Text>

            </View>
          </View>
        ))}
      </View>

    </View>
  )}
  {Dessert.length > 0 && (
    <View style={styles.foodItemsContainer}>
      <View>
        <Text style={styles.menuCat}>{'Dessert'} {"(" + Dessert.length + ")"}</Text>
      </View>
      <View style={styles.foodItemsSecContainer}>
        {Dessert.map((item, index) => (
          <View key={index} style={styles.foodItem}>
            <View style={styles.foodItemImageContainer}>
              <Image source={{ uri: `https://horaservices.com/api/uploads/${item.image}` }} style={styles.foodItemImage} />
            </View>
            <View style={styles.foodItemDetails}>
            <Text style={styles.foodItemName}>{item.name}</Text>

            </View>
          </View>
        ))}
      </View>

    </View>
  )}
  {Maincourse.length > 0 && (
    <View style={styles.foodItemsContainer}>
      <View>
        <Text style={styles.menuCat}>{'Main course'} {"(" + Maincourse.length + ")"}</Text>
      </View>
      <View style={styles.foodItemsSecContainer}>
        {Maincourse.map((item, index) => (
          <View key={index} style={styles.foodItem}>
            <View style={styles.foodItemImageContainer}>
              <Image source={{ uri: `https://horaservices.com/api/uploads/${item.image}` }} style={styles.foodItemImage} />
            </View>
            <View style={styles.foodItemDetails}>
            <Text style={styles.foodItemName}>{item.name}</Text>

            </View>
          </View>
        ))}
      </View>

    </View>
  )}
  {Mocktails.length > 0 && (
    <View style={styles.foodItemsContainer}>
      <View>
        <Text style={styles.menuCat}>{'Mocktails'} {"(" + Mocktails.length + ")"}</Text>
      </View>
      <View style={styles.foodItemsSecContainer}>
        {Mocktails.map((item, index) => (
          <View key={index} style={styles.foodItem}>
            <View style={styles.foodItemImageContainer}>
              <Image source={{ uri: `https://horaservices.com/api/uploads/${item.image}` }} style={styles.foodItemImage} />
            </View>
            <View style={styles.foodItemDetails}>
            <Text style={styles.foodItemName}>{item.name}</Text>

            </View>
          </View>
        ))}
      </View>

    </View>
  )}
  {SaladPapad.length > 0 && (
    <View style={styles.foodItemsContainer}>
      <View>
        <Text style={styles.menuCat}>{'Salad & Papad'} {"(" + SaladPapad.length + ")"}</Text>
      </View>
      <View style={styles.foodItemsSecContainer}>
        {SaladPapad.map((item, index) => (
          <View key={index} style={styles.foodItem}>
            <View style={styles.foodItemImageContainer}>
              <Image source={{ uri: `https://horaservices.com/api/uploads/${item.image}` }} style={styles.foodItemImage} />
            </View>
            <View style={styles.foodItemDetails}>
            <Text style={styles.foodItemName}>{item.name}</Text>

            </View>
          </View>
        ))}
      </View>

    </View>
  )}
  {SoupBeverages.length > 0 && (
    <View style={styles.foodItemsContainer}>
      <View>
        <Text style={styles.menuCat}>{'Soups & Beverages'} {"(" + SoupBeverages.length + ")"}</Text>
      </View>
      <View style={styles.foodItemsSecContainer}>
        {SoupBeverages.map((item, index) => (
          <View key={index} style={styles.foodItem}>
            <View style={styles.foodItemImageContainer}>
              <Image source={{ uri: `https://horaservices.com/api/uploads/${item.image}` }} style={styles.foodItemImage} />
            </View>
            <View style={styles.foodItemDetails}>
            <Text style={styles.foodItemName}>{ item.name}</Text>
            </View>
          </View>
        ))}
      </View>

    </View>
  )}
    </ScrollView>
  );
  
};
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
	orderCon:{
    height: Dimensions.get('window').height*0.65,
    backgroundColor:"#fff",
  },		
												
						   
	
  menuCat: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold"
  },
  foodItemsContainer:{
    backgroundColor:"#fff",
    paddingTop:10,
    paddingLeft:12,
    paddingRight:10,
  },
  foodItemsSecContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap', // Allow items to wrap into the next row
  },
  foodItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginRight: 3, // Add margin between food items
    borderWidth: 1,
    borderColor: '#ccc', // Specify the border color
    borderRadius: 10, // Add border radius for rounded corners
    width: '48%', // Adjust width based on available space
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight:5,
    paddingLeft:5,
    minHeight:70,
  },
  foodItemImageContainer: {
    width: 50,
    height: 50,
  },
  foodItemImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  foodItemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  foodItemName: {
    fontSize: 12,
    color: '#333',
  },
});

export default OrderDetailsMenu;
