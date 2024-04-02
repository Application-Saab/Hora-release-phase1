import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { ScrollView } from  'react-native';
import App from '../App';
			 

const OrderDetailsMenu = ({ OrderMenu, OrderType, NoOfPeople }) => {
  console.log(NoOfPeople)
  var Appetizer = [];
  var Breads = [];
  var Breakfast = [];
  var Dessert = [];
  var Maincourse = [];
  var Mocktails = [];
  var SaladPapad = [];
  var SoupBeverages = [];
  var preparationTextList = []

  var itemCount = 0;


  const RenderDishQunatity = ({ item }) => {
    let quantity = item.foodQty * NoOfPeople;
    console.log(NoOfPeople)
    if (itemCount <= 5) {
        quantity = quantity;
    } else if (itemCount == 6) {
        quantity = quantity * (1 - 0.15);
    } else if (itemCount == 7) {
        console.log("quantity before" + quantity);
        quantity = quantity * (1 - 0.15);
        console.log("quantity after" + quantity);
    } else if (itemCount == 8) {
        quantity = quantity * (1 - 0.25);
    } else if (itemCount == 9) {
        quantity = quantity * (1 - 0.30);
    } else if (itemCount == 10) {
        quantity = quantity * (1 - 0.35);
    } else if (itemCount == 11) {
        quantity = quantity * (1 - 0.40);
    } else if (itemCount == 12) {
        quantity = quantity * (1 - 0.50);
    } else if (itemCount == 13) {
        quantity = quantity * (1 - 0.53);
    } else if (itemCount == 15) {
        quantity = quantity * (1 - 0.55);
    }

    quantity = Math.round(quantity);
    let unit = item.foodUnit;

    if (quantity >= 1000) {
        quantity = quantity / 1000;
        if (unit === 'Gram') unit = 'KG';
        else if (unit === 'ml') unit = 'L';
    }

    return { quantity, unit }; // Return the calculated quantity and unit
};


  OrderMenu.forEach((item) => {
    if (item.mealId[0].name === 'Appetizer') {
      Appetizer.push({ name: item.name, image: item.image, price: item.price, foodQty: item.cuisineArray[1], foodUnit: item.cuisineArray[2] });
      preparationTextList.push(item.preperationtext);
      itemCount = itemCount + 1;
    }
    else if (item.mealId[0].name === 'Breads, Rice and Raita') {
      Breads.push({ name: item.name, image: item.image, price: item.price, foodQty: item.cuisineArray[1], foodUnit: item.cuisineArray[2] });
      preparationTextList.push(item.preperationtext)
      itemCount = itemCount + 1;
    }
    else if (item.mealId[0].name === 'Breakfast') {
      Breakfast.push({ name: item.name, image: item.image, price: item.price, foodQty: item.cuisineArray[1], foodUnit: item.cuisineArray[2] });
      preparationTextList.push(item.preperationtext)
    }
    else if (item.mealId[0].name === 'Dessert') {
      Dessert.push({ name: item.name, image: item.image, price: item.price , foodQty: item.cuisineArray[1], foodUnit: item.cuisineArray[2]});
      preparationTextList.push(item.preperationtext)
    }
    else if (item.mealId[0].name === 'Main course') {
      Maincourse.push({ name: item.name, image: item.image, price: item.price , foodQty: item.cuisineArray[1], foodUnit: item.cuisineArray[2]});
      preparationTextList.push(item.preperationtext)
      itemCount = itemCount + 1;
    }
    else if (item.mealId[0].name === 'Mocktails') {
      Mocktails.push({ name: item.name, image: item.image, price: item.price , foodQty: item.cuisineArray[1], foodUnit: item.cuisineArray[2]});
      preparationTextList.push(item.preperationtext)
    }
    else if (item.mealId[0].name === 'Salad & Papad') {
      SaladPapad.push({ name: item.name, image: item.image, price: item.price, foodQty: item.cuisineArray[1], foodUnit: item.cuisineArray[2] });
      preparationTextList.push(item.preperationtext)
    }
    else if (item.mealId[0].name === 'Soups & Beverages') {
      SoupBeverages.push({ name: item.name, image: item.image, price: item.price, foodQty: item.cuisineArray[1], foodUnit: item.cuisineArray[2] });
      preparationTextList.push(item.preperationtext)
    }
  });

  Breads.forEach(x => {
    const { quantity, unit } = RenderDishQunatity({ item: x });
    // Now you can use the `quantity` and `unit` variables here
    x.foodQty = quantity;
    x.foodUnit = unit;
});

Maincourse.forEach(x => {
  const { quantity, unit } = RenderDishQunatity({ item: x });
  // Now you can use the `quantity` and `unit` variables here
  x.foodQty = quantity;
  x.foodUnit = unit;
});

Appetizer.forEach(x => {
  const { quantity, unit } = RenderDishQunatity({ item: x });
  // Now you can use the `quantity` and `unit` variables here
  x.foodQty = quantity;
  x.foodUnit = unit;
});

  

  return (
    <ScrollView style={styles.orderCon}>
      <View>
      {OrderType != 6 && OrderType != 7 &&
      (<View style={{ marginTop: 9, flexDirection: 'column', padding: 10, width: Dimensions.get('window').width*0.7 , marginLeft:10}}>
                        <Text style={{ color: '#9252AA', fontSize: 12, fontWeight: '700' }}>*Advance Preparations required</Text>
                        <Text style={{ color: '#4B4B4B', fontSize: 12, fontWeight: '400' }}>{preparationTextList ? preparationTextList : "NA"}</Text>
       </View>)}
      </View>
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
                <Text style={styles.foodItemName}>{item.preperationtext}</Text>
                <Text style={styles.foodItemName}>{item.foodQty}</Text>
                <Text style={styles.foodItemName}>{item.foodUnit}</Text>
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
                <Text style={styles.foodItemName}>{item.foodQty}</Text>
                <Text style={styles.foodItemName}>{item.foodUnit}</Text>
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
            <Text style={styles.foodItemName}>{item.foodQty}</Text>
                <Text style={styles.foodItemName}>{item.foodUnit}</Text>
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
            <Text style={styles.foodItemName}>{item.foodQty}</Text>
                <Text style={styles.foodItemName}>{item.foodUnit}</Text>
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
            <Text style={styles.foodItemName}>{item.foodQty}</Text>
                <Text style={styles.foodItemName}>{item.foodUnit}</Text>
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
            <Text style={styles.foodItemName}>{item.foodQty}</Text>
                <Text style={styles.foodItemName}>{item.foodUnit}</Text>
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
            <Text style={styles.foodItemName}>{item.foodQty}</Text>
                <Text style={styles.foodItemName}>{item.foodUnit}</Text>
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
            <Text style={styles.foodItemName}>{item.foodQty}</Text>
                <Text style={styles.foodItemName}>{item.foodUnit}</Text>
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
