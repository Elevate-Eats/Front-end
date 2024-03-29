import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

const ItemBisnis = props => {
  return (
    <View style={{marginBottom: 30}}>
      <TouchableOpacity style={styles.item} onPress={props.onPress}>
        <View style={{flex: 1, rowGap: 5}}>
          <Text variant="titleMedium" style={{fontSize: 25}}>
            {props.title}
          </Text>
          <Text variant="titleSmall">Kelola Semua {props.title}</Text>
        </View>
        <Ionicons
          name="chevron-forward-circle-outline"
          size={30}
          color={'grey'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ItemBisnis;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    marginHorizontal: 10,
    paddingHorizontal: 5,
    borderBottomColor: 'grey',
    borderBottomWidth: 1.3,
  },
});
