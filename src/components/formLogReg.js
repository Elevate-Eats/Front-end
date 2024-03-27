import {StyleSheet} from 'react-native';
import React from 'react';

import {Text, TextInput, HelperText} from 'react-native-paper';
import {Colors} from '../utils/colors';

const FormLogReg = props => {
  return (
    <TextInput
      style={{marginVertical: 5}}
      mode="outlined"
      label={props.label} //{'Email'}
      placeholder={props.placeholder} //"email-address"
      secureTextEntry={props.secureTextEntry}
      keyboardType={props.keyboardType} //"email-address"
      right={<TextInput.Icon icon={props.right} />} //eye
      left={<TextInput.Icon icon={props.left} size={30} color={'grey'} />}
      outlineColor={'#878787'}
      activeOutlineColor={Colors.btnColor}
      outlineStyle={{borderWidth: 1.5}}
      value={props.value}
      onChangeText={props.onChangeText}
    />
  );
};

export default FormLogReg;

const styles = StyleSheet.create({});
