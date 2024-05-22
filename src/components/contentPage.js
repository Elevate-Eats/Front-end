import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import RightArrow from '../assets/icons/arrow-right.svg';
import React from 'react';

const ContentPage = ({title, onPress, Icon}) => {
  return (
    <View>
      <Pressable onPress={onPress} style={styles.box}>
        <Icon width={40} height={40} />
        <Text variant="titleMedium" style={styles.titleText}>
          {title}
        </Text>
        <TouchableOpacity onPress={onPress}>
          <RightArrow width={30} height={30} />
        </TouchableOpacity>
      </Pressable>
    </View>
  );
};

export default ContentPage;

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.07)',
    borderRadius: 8,
    marginVertical: 10,
  },
  titleText: {fontWeight: '700', marginHorizontal: 15, flex: 1},
});
