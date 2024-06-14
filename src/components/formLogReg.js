import {StyleSheet, View} from 'react-native';
import React from 'react';

import {Text, TextInput, HelperText, useTheme} from 'react-native-paper';

const FormLogReg = props => {
  const {colors} = useTheme();
  return (
    <View style={{gap: -10}}>
      <TextInput
        style={{backgroundColor: colors.background}}
        mode="outlined"
        label={props.label} //{'Email'}
        placeholder={props.placeholder} //"email-address"
        placeholderTextColor={colors.outlineVariant}
        secureTextEntry={props.secureTextEntry}
        keyboardType={props.keyboardType} //"email-address"
        right={<TextInput.Icon icon={props.right} onPress={props.onPress} />} //eye
        left={
          <TextInput.Icon
            icon={props.left}
            size={30}
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
        style={{marginTop: 5}}>
        {`Error: ${props.error}`}
      </HelperText>
    </View>
  );
};

export default FormLogReg;

const styles = StyleSheet.create({});
