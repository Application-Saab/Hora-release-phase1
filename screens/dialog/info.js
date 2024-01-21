import React from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';

const InfoModal = ({ isVisible, onClose, children }) => {
  return (
    <Modal transparent visible={isVisible} animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modal}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex:0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderRadius: 10,
    width: '75%',
    height:115,
    backgroundColor: '#E4E4E4',
    alignItems: 'center',
  },
});

export default InfoModal;
