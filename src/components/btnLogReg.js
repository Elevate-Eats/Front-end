import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {Button, useTheme} from 'react-native-paper';
import {Colors} from '../utils/colors';

const BtnLogReg = props => {
  const {colors} = useTheme();
  return (
    <Button
      labelStyle={{color: colors.onBtnColor, fontWeight: '700'}}
      loading={props.loading}
      disabled={props.disabled}
      onPress={props.onPress}
      mode="elevated"
      buttonColor={props.disabled ? colors.surfaceDisabled : colors.btnColor}
      // textColor={colors.onBtnColor}
      style={{paddingVertical: 5, borderRadius: 3, marginTop: 10}}>
      {props.name}
    </Button>
  );
};

export default BtnLogReg;

const styles = StyleSheet.create({});
