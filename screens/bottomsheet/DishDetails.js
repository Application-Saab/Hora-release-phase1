import React, { useState, useRef, useEffect } from 'react';
import { Dimensions, View, Button, FlatList, Text, TouchableOpacity, StyleSheet, Image, TouchableHighlight } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { BASE_URL, API_SUCCESS_CODE, GET_ADDRESS_LIST } from '../../utils/ApiConstants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



const DishDetails = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const bottomSheetRef = useRef(null);

  const AddressItem = ({ address, selected, onSelect }) => (

    <TouchableOpacity onPress={onSelect}>
      <View style={[styles.container, selected && styles.selectedContainer]}>
        <View style={{ flexDirection: 'row', flex: 1, marginTop: 25, justifyContent: 'space-between' }}>
          <Text style={[styles.headingText, selected && styles.selectedText]}>Delivers To</Text>
          <Image source={require('../../assets/info.png')} style={styles.homeIcon} />
        </View>

        <View style={{ flexDirection: 'row', flex: 1, marginTop: 10, marginHorizontal: 16 }}>
          <View>
            <Image source={require('../../assets/info.png')} style={styles.homeIcon} />
            <Text style={[styles.bottomText, selected && styles.selectedText]}>{address.title}</Text>
          </View>
          <View>
            <Text style={[styles.parallelText, selected && styles.selectedText]}>Home</Text>
            <Text style={[styles.multiLineText, selected && styles.selectedText]}>
              {address.address1}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#F3F2F2',
      borderRadius: 8,
      elevation: 1,
      paddingHorizontal: 16,
      marginHorizontal: 16,
      paddingBottom:17,
      marginBottom: 3
    },
    headingText: {
      flex: 1,
      color: '#414141',
      fontSize: 12,
      fontWeight: '400',
      justifyContent: 'space-between',
      opacity: 0.8,
      marginLeft: 10,
    },
    homeIcon: {
      marginLeft: 42,
      width: 18,
      height: 16,

    },
    bottomText: {
      marginTop: 8,
      marginLeft: 38,
      color: '#414141',
      fontWeight: '400',
      fontSize: 10,
      opacity: 0.8


    },
    parallelText: {
      marginLeft: 16,
      fontSize: 12,
      fontWeight: '600',
      color: '#000'
    },
    multiLineText: {
      marginTop: 6,
      paddingHorizontal: 16,
      color: '#414141',
      fontWeight: '400',
      fontSize: 11,
      opacity: 0.8,
    },
    buttonText: {
      color: 'white',
      fontWeight: '500',
      fontSize: 18,
    },
    customButton: {
      height: 57,
      width: Dimensions.get('window').width * 0.8,
      backgroundColor: '#9252AA',
      marginHorizontal: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
    },
    selectedContainer: {
      backgroundColor: '#9252AA', // Selected background color
      borderColor: '#9252AA', // Selected border color
    },
    selectedText: {
      color: 'white', // Selected text color
    },
    bottomSheetContainer: {
      backgroundColor: 'white',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      padding: 12,
      paddingTop:52

    },
    bottomSheetWrapper: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    draggableIcon: {
      backgroundColor: '#000',
    },

  });



  const BottomSheetContent = ({ data, selectedAddress, onSelectAddress }) => (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AddressItem
          address={item}
          selected={item.id === selectedAddress?.id}
          onSelect={() => onSelectAddress(item)}
        />
      )}>
    </FlatList>

  );

  useEffect(() => {
    openBottomSheet()
    const fetchAddressesFromAPI = async () => {
      try {
        const url = BASE_URL + GET_ADDRESS_LIST;
        const requestData = {
          page: '1'
        };
        const token = await AsyncStorage.getItem('token')
        const response = await axios.post(url, requestData, {
          headers: {
            'Content-Type': 'application/json',
            'authorization': token
          },
        });
        console.warn(response.status)
        if (response.status == API_SUCCESS_CODE) {
          console.warn(response.data.data.address)
          setAddresses(response.data.data.address)
        }
      } catch (error) {
        console.log('Error Fetching Data:', error.message);
      }
    };

    fetchAddressesFromAPI();
  }, []);


  const openBottomSheet = () => {
    bottomSheetRef.current.open();
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    bottomSheetRef.current.close();
  };

  const addAddress = () => {

  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={false}
        height={500}
        customStyles={{
          container: styles.bottomSheetContainer,
          wrapper: styles.bottomSheetWrapper,
          draggableIcon: styles.draggableIcon,
        }}
      >
        <BottomSheetContent
          data={addresses}
          selectedAddress={selectedAddress}
          onSelectAddress={handleSelectAddress}
    
        />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          marginTop:90,
          marginBottom:20,
          alignItems: 'center',
        }}>
          <TouchableHighlight onPress={() => addAddress()} style={styles.customButton} underlayColor="transparent" activeOpacity={1}>
            <Text style={styles.buttonText}> + Add Address</Text>
          </TouchableHighlight>
        </View>
      </RBSheet>
    </View>
  );
};

export default DishDetails;
