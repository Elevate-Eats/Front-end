import {Pressable, StyleSheet} from 'react-native';
import React from 'react';
import {Colors} from '../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DeleteButton = props => {
  return (
    <Pressable
      style={[
        styles.delete,
        {
          backgroundColor:
            props.role === 'general_manager' ? Colors.deleteColor : '#DCDCDC',
        },
      ]}
      onPress={props.onPress}>
      <Ionicons name="trash-bin-outline" size={25} color={'white'} />
    </Pressable>
  );
};

export default DeleteButton;

const styles = StyleSheet.create({
  delete: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 4,
  },
});
