import {StyleSheet} from 'react-native';
import React from 'react';

import {Text, TextInput, HelperText, useTheme} from 'react-native-paper';
import {Colors} from '../utils/colors';

const FormLogReg = props => {
  const {colors} = useTheme();
  return (
    <TextInput
      style={{marginVertical: 5, backgroundColor: colors.background}}
      mode="outlined"
      label={props.label} //{'Email'}
      placeholder={props.placeholder} //"email-address"
      placeholderTextColor={colors.outlineVariant}
      secureTextEntry={props.secureTextEntry}
      keyboardType={props.keyboardType} //"email-address"
      right={<TextInput.Icon icon={props.right} onPress={props.onPress} />} //eye
      left={<TextInput.Icon icon={props.left} size={30} color={'grey'} />}
      outlineColor={colors.outline}
      activeOutlineColor={colors.onBtnColorContainer}
      outlineStyle={{borderWidth: 1.5}}
      value={props.value}
      onChangeText={props.onChangeText}
    />
  );
};

export default FormLogReg;

const styles = StyleSheet.create({});
