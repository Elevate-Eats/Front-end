import {StyleSheet, View} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import React from 'react';
import {Colors} from '../utils/colors';

/*
USE: 
- Edit Cabang
- Tambah Cabang
*/

const FormInput = props => {
  return (
    <View style={{marginTop: 10}}>
      <TextInput
        disabled={props.disabled}
        mode="outlined"
        label={props.label} // Nama Cabang
        placeholder={props.placeholder} // Masukkan nama cabang ...
        placeholderTextColor={'grey'}
        keyboardType={props.keyboardType} //default
        left={<TextInput.Icon icon={props.left} size={25} color={'grey'} />}
        outlineColor="#878787"
        activeOutlineColor={Colors.btnColor}
        outlineStyle={{borderWidth: 1.5}}
        value={props.value}
        onChangeText={props.onChangeText}
        secureTextEntry={props.secureTextEntry}
      />
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({});
