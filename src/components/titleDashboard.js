import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';

const TitleDashboard = props => {
  return (
    <Text variant="titleMedium" style={{fontWeight: '700'}}>
      {props.title}
    </Text>
  );
};

export default TitleDashboard;
