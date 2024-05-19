import {StyleSheet, View, Pressable} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import Calendar from '../assets/icons/calendar-bulk.svg';
const CalendarPicker = props => {
  return (
    <View style={{flex: 1, rowGap: 5}}>
      <Text variant="titleMedium">{props.title}</Text>
      <Pressable
        disabled={props.disabled}
        onPress={props.onPress}
        style={[styles.dropdown, {padding: 15, flexDirection: 'row', gap: 10}]}>
        <Calendar width={20} height={20} />
        <Text
          variant="titleMedium"
          style={{color: props.date ? '#000' : 'grey'}}>
          {props.date || 'YYYY/MM/DD'}
        </Text>
      </Pressable>
    </View>
  );
};

export default CalendarPicker;

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
  },
});
