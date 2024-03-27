import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {Button} from 'react-native-paper';
import {Colors} from '../utils/colors';

const BtnLogReg = props => {
  return (
    <Button
      disabled={props.disabled}
      onPress={props.onPress}
      mode="elevated"
      buttonColor={Colors.btnColor}
      textColor="#fff"
      style={{paddingVertical: 5, borderRadius: 3, marginTop: 20}}>
      {props.name}
    </Button>
  );
};

export default BtnLogReg;

const styles = StyleSheet.create({});
