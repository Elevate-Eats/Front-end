import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

const AddPhoto = props => {
  return (
    <View style={styles.wrap}>
      <View style={styles.icon}>
        <Ionicons name={props.icon} size={40} />
        <TouchableOpacity style={styles.camera}>
          <Ionicons name="camera-outline" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddPhoto;

const styles = StyleSheet.create({
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  camera: {
    height: 40,
    width: 40,
    backgroundColor: '#fff',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: -5,
    right: -5,
    borderRadius: 40,
    elevation: 6,
  },
  wrap: {
    alignItems: 'center',
    paddingVertical: 10,
  },
});
