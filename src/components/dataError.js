import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';

const DataError = props => {
  return (
    <View style={styles.ifError}>
      <Text variant="headlineMedium" style={{fontWeight: '700'}}>
        {props.data}
      </Text>
    </View>
  );
};

export default DataError;

const styles = StyleSheet.create({
  ifError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
