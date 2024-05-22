import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import {Colors} from '../utils/colors';

const SalesItem = props => {
  return (
    <View style={[styles.container]}>
      <Text variant="titleMedium" style={{fontSize: 20, color: 'grey'}}>
        {props.title}
      </Text>
      {props.loading ? (
        <ActivityIndicator
          size={25}
          color={Colors.btnColor}
          style={{paddingVertical: 5}}
        />
      ) : (
        <Text style={{fontWeight: '500', fontSize: 24}}>
          {props.total ? props.total : 'Rp. 0'}
        </Text>
      )}
    </View>
  );
};

export default SalesItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    shadowColor: '#000',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    gap: 10,
    alignItems: 'center',
  },
});
