import React from 'react';
import {Text, Button} from 'react-native-paper';
import {Colors} from '../utils/colors';
const ConstButton = props => {
  return (
    <Button
      loading={props.loading}
      disabled={props.disabled}
      onPress={props.onPress}
      mode="elevated"
      buttonColor={Colors.btnColor}
      style={{paddingVertical: 5, borderRadius: 5}}>
      <Text variant="titleMedium" style={{color: 'white'}}>
        {props.title}
      </Text>
    </Button>
  );
};

export default ConstButton;
