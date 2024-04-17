import {View, Text} from 'react-native';
import React from 'react';
import {ActivityIndicator, ProgressBar} from 'react-native-paper';
import {Colors} from '../utils/colors';

const LoadingIndicator = props => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator animating={true} color={Colors.btnColor} size={25} />
      <Text style={{color: Colors.btnColor, marginTop: 10, fontSize: 18}}>
        {props.message ? props.message : 'Loading ...'}
      </Text>
      <ProgressBar progress={1} color={Colors.btnColor} />
    </View>
  );
};

export default LoadingIndicator;
