import {View, Text} from 'react-native';
import React from 'react';
import {ActivityIndicator, MD2Colors} from 'react-native-paper';
import {Colors} from '../utils/colors';

const LoadingIndicator = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator animating={true} color={Colors.btnColor} size={25} />
      <Text style={{color: Colors.btnColor, marginTop: 10, fontSize: 18}}>
        Loading ...
      </Text>
    </View>
  );
};

export default LoadingIndicator;
