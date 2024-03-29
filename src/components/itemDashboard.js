import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../utils/colors';
import React from 'react';

const ItemDashboard = props => {
  return (
    <TouchableOpacity
      style={{
        rowGap: 4,
        borderWidth: 0.8,
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        borderColor: 'black',
        marginRight: 10,
      }}>
      <Ionicons name={props.iconName} size={30} color={Colors.btnColor} />
      <Text variant="titleMedium">{props.name}</Text>
    </TouchableOpacity>
  );
};

export default ItemDashboard;

const styles = StyleSheet.create({});
