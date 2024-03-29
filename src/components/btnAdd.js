import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import {Colors} from '../utils/colors';

/*
Page: 
- Pilih Cabang

*/

const BtnAdd = props => {
  return (
    <View>
      <TouchableOpacity style={styles.btn} onPress={props.onPress}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default BtnAdd;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.secondaryColor,
    width: 55,
    height: 55,
    borderRadius: 50,
    position: 'absolute',
    bottom: 25,
    right: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 7,
    zIndex: 99,
  },
});
