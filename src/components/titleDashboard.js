import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';

const TitleDashboard = props => {
  return <Text style={{fontWeight: '900', fontSize: 18}}>{props.title}</Text>;
};

export default TitleDashboard;
const styles = StyleSheet.create({});
