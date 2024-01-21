import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Onboarding = ({ navigation }) => {
    const data = [
        { image: require('../../assets/splash.png') },
        { image: require('../../assets/splash.png') },
        { image: require('../../assets/splash.png') },
        // Add more onboarding screens as needed
      ];
  const [currentScreen, setCurrentScreen] = useState(0);
  const flatListRef = useRef(null);


  const OnboardingScreenItem = ({ imageSource, onPressSkip }) => (
    <View style={{ flex: 1 }}>
      <Image source={imageSource} style={{ flex: 1 }} resizeMode="cover" />
      <TouchableOpacity onPress={onPressSkip} style={{ position: 'absolute', top: 20, right: 20 }}>
        <Text>Skip</Text>
      </TouchableOpacity>
    </View>
  );

  const onPressSkip = () => {
    if (currentScreen < data.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentScreen + 1 });
      setCurrentScreen(currentScreen + 1);
    }
  };

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentScreen(viewableItems[0].index);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        renderItem={({ item }) => (
          <OnboardingScreenItem
            imageSource={item.image}
            onPressSkip={onPressSkip}
          />
        )}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 20 }}>
        {data.map((_, index) => (
          <View
            key={index}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 5,
              backgroundColor: index === currentScreen ? 'blue' : 'gray',
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default Onboarding;


