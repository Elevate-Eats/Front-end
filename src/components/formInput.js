import {StyleSheet, View} from 'react-native';
import {HelperText, Text, TextInput, useTheme} from 'react-native-paper';
import React from 'react';

/*
USE: 
- Edit Cabang
- Tambah Cabang
*/

const FormInput = props => {
  const {colors} = useTheme();
  return (
    <View style={{gap: -5}}>
      <TextInput
        style={{backgroundColor: colors.background}}
        disabled={props.disabled}
        mode="outlined"
        label={props.label}
        placeholder={props.placeholder}
        placeholderTextColor={colors.outlineVariant}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType}
        left={
          <TextInput.Icon
            icon={props.left}
            size={25}
            color={props.hasError ? colors.error : 'grey'}
          />
        }
        outlineColor={props.hasError ? colors.error : colors.outline}
        activeOutlineColor={
          props.hasError ? colors.error : colors.onBtnColorContainer
        }
        outlineStyle={{borderWidth: 1.5}}
        value={props.value}
        onChangeText={props.onChangeText}
      />
      <HelperText
        type="error"
        visible={props.hasError || false}
        style={{marginTop: 0}}>
        {`Error: ${props.error}`}
      </HelperText>
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({});
