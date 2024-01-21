import React from 'react';
import Carousel from 'react-native-snap-carousel';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';

const CarouselComponent = ({ data, reviewData, navigation }) => {

  
  const handelpage = (item) => {
    console.log(item.openLink + item.category)
      navigation.navigate(item.openLink, { category: item.category });
    }
  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      {reviewData ? (
        <Image source={item.image} style={styles.image1} />
      ) : (
        <View style={{ paddingLeft: 6, paddingRight: 6, marginTop: 2 }}>
          <View style={{ position: "relative" }}>
            <Image source={item.image} style={styles.image} />
            <View style={{ position: 'absolute', backgroundColor: '#000', opacity: 0.3, width: '100%', height: '100%', borderRadius: 10 }}></View>
          </View>
          <View style={{ position: "absolute", bottom: item.id == 3 ? "20%" : "20%", transform: "translateY(0, 0)", left: 23, width: item.id == 1 ? "50%" : "80%" }}>
            <Text style={{ color: "white", fontSize: 16, fontWeight: "700", fontSize: 18, textShadowColor: 'rgba(0, 0, 0, 0.6)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4 }}>{item.text}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.customButton} activeOpacity={1} onPress={() => handelpage(item)}>
                <Text style={styles.buttonText}> Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={Dimensions.get('window').width}
        itemWidth={Dimensions.get('window').width - 15}
        loop={true}
        autoplay={true}
        autoplayInterval={5000}
        paginationStyle={styles.paginationStyle}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={styles.inactiveDotStyle}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  carouselItem: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 158,
    borderRadius: 10,
  },
  image1: {
    width: '100%',
    height: 300,
  },
  paginationStyle: {
    bottom: 30, // Adjust this value to position the pagination dots as per your design
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#9252AA', // Active dot color
  },
  inactiveDotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CFCFCF', // Inactive dot color
  },
  buttonContainer: {
    backgroundColor: "#9252AA",
    width: 100,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 7
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: '700',
  }
});

export default CarouselComponent;
