import * as React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';

const OrderDetailsAppli = ({ OrderAppl }) => {
  return (
     <View style={{ paddingTop: 20, backgroundColor: "#fff",  height: Dimensions.get('window').height*0.7,paddingTop: 20, paddingLeft: 20 }}>
      <View>
        <Text style={{ fontWeight: "600", color: "#000", fontSize: 16 }}>Required Burners</Text>
        <Text style={{ color: "#969696", fontSize: 11, fontWeight: "500" }}>(Burners would be used at your location)</Text>
        <View style={{
          flexDirection: 'row',
          display: "flex",
          borderWidth: 1,
          borderColor: ' #969696',
          borderRadius: 6,
          width: "34%",
          paddingVertical: 10,
          paddingHorizontal: 9,
          justifyContent: 'space-between',
          alignItems: "center",
          marginHorizontal: 0,
          marginVertical: 20
        }}>
          <Image
            source={require('../assets/burner.png')}
            style={{
              height: 15,
              width: 70,
              marginLeft: 15,
              marginVertical: 46,
              marginLeft: 0,
              marginRight: 0,
              marginTop: 0,
              marginBottom: 0
            }}
          />
          <Text style={{ color: "#9252AA", fontWeight: "600", fontSize: 20 }}>04</Text>
        </View>
      </View>
      <View>
        <View>
          <Text style={{ fontWeight: "600", color: "#000", fontSize: 16 }}>{'Requires Special Appliances'}</Text>
          <Text style={{ color: "#969696", fontSize: 11, fontWeight: "500" }}>{'(Keep these appliances ready at your location)'}</Text>
        </View>
        <View style={styles.foodItemsContainer}>
          {OrderAppl.length > 0 ? (
            OrderAppl.map((item, index) => (
              <View key={index} style={styles.foodItem}>
                <View style={styles.foodItemImageContainer}>
                  <Image source={{ uri: `https://horaservices.com/api/uploads/${item.image}` }} style={styles.foodItemImage} />
                </View>
                <View style={styles.foodItemDetails}>
                  <Text style={styles.foodItemName}>{item.name}</Text>
                </View>
              </View>
            ))
          ) : (
            <>
              <Text style={{paddingLeft:5, paddingRight:14, color:"#969696" ,fontWeight:"400"}}>No special appliances required.</Text>
            <Text style={{paddingLeft:5, paddingRight:14, color:"#969696" ,fontWeight:"400"}}>Normally available utensils would be sufficient to complete your order.</Text>
        
            </>
            )}
        </View>

      </View>
    </View>
  );
};
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  foodItemsContainer: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingLeft: 20,
  },

  foodItemImageContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
  },
  foodItemsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items at the start of the cross axis
    justifyContent: 'flex-start',
    marginTop: 0,
    paddingBottom: 20,
    flexWrap: 'wrap', // Allow items to wrap into the next row
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingLeft: 0,
    paddingRight: 0,
  },
  foodItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginBottom: 5,
    marginRight: 3, // Add margin between food items
    borderWidth: 1,
    borderColor: '#ccc', // Specify the border color
    borderRadius: 10, // Add border radius for rounded corners
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 5,
    paddingLeft: 5,
    minHeight: 70,
    width: '48%', // Set width to 30% for three items in a row
  },
  foodItemImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  foodItemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  foodItemName: {
    fontSize: 12,
    color: '#333',
  },
})

export default OrderDetailsAppli;
