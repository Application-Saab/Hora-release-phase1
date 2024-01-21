import React from 'react';
import { View, Modal, TouchableOpacity, Image, StyleSheet,Text,TouchableHighlight,Dimensions} from 'react-native';

const OrderWarning = ({ visible, onClose, title, amount, message, buttonText}) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.popup}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Image source={require('../../assets/cross.png')} style={styles.icon} />
          </TouchableOpacity>

        <View style={{justifyContent:'center',alignItems:'center'}}> 
        <Image source={require('../../assets/OrderWarning.png')} style={styles.warningImage} />
        <Text style={{marginTop:17,fontSize:16,fontWeight:'500',color:'black'}}>{title} </Text>
        <Text style={{fontSize:16,fontWeight:'500',color:'#9252AA'}}>{amount}</Text>
        <Text style={{marginTop:14,fontSize:12,fontWeight:'400',color:'#707070', padding:20}}>{message}</Text>
        <TouchableOpacity onPress={onClose} style={styles.customButton} underlayColor="transparent" activeOpacity={1}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>

        </View>

      </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
  },
  popup: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent:'center'
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  icon: {
    width: 12,
    height: 12,
    marginEnd:7,
    marginTop:7
  },
  warningImage: {
    width: 108,
    height: 123,
  },
  customButton: {
    backgroundColor: '#9252AA',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingVertical:9,
    marginTop:26,
    marginBottom:22,
    paddingHorizontal:62
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
  },
});

export default OrderWarning;
