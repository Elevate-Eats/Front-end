import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '../utils/colors';

const SalesToday = ({label, percentage, value, loading}) => {
  return (
    <View style={styles.containerContent}>
      <Text style={styles.label}>{label}</Text>
      {loading ? (
        <ActivityIndicator
          size={'small'}
          color={'grey'}
          style={{paddingVertical: 5}}
        />
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
      {percentage ? (
        <Text
          style={[
            styles.percentage,
            {color: parseInt(percentage) > 0 ? 'green' : Colors.deleteColor},
          ]}>
          {percentage} %
        </Text>
      ) : null}
    </View>
  );
};

export default SalesToday;

const styles = StyleSheet.create({
  containerContent: {
    alignItems: 'center',
    width: '48%',
    padding: 10,
    borderWidth: 1, // Add black border
    borderColor: '#000', // Black border color
    borderRadius: 8,
    rowGap: 5,
  },
  value: {
    color: 'black',
    fontSize: 20,
    fontWeight: '900',
  },
  label: {
    fontSize: 16,
    color: 'grey',
  },
  percentage: {
    fontSize: 16,
    fontWeight: '900',
  },
});
