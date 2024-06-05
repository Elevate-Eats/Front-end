import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-paper';
import {LightTheme} from '../themes';

const FormProfile = props => {
  return (
    <TextInput
      disabled={props.disabled}
      left={<TextInput.Icon icon={props.left} size={25} color={'grey'} />}
      right={
        <TextInput.Icon icon={props.right} size={25} onPress={props.onPress} />
      }
      style={{
        backgroundColor: '#f7f7f7',
        marginHorizontal: 20,
      }}
      placeholder={props.placeholder}
      placeholderTextColor={'grey'}
      activeUnderlineColor={LightTheme.colors.btnColor}
      value={props.value}
      onChangeText={props.onChangeText}
      label={props.label}
      keyboardType={props.keyboardType}
    />
  );
};

export default FormProfile;

const styles = StyleSheet.create({});
