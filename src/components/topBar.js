import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {Appbar, useTheme} from 'react-native-paper';
import {DrawerBar} from '.';
import {Colors} from '../utils/colors';
const TopBar = ({navigation, title}) => {
  const {colors} = useTheme();
  return (
    <Appbar.Header
      dark={true}
      elevated={true}
      style={[styles.appbar, {backgroundColor: colors.background}]}>
      <Appbar.Action
        icon="menu"
        color={colors.onBackground}
        onPress={() => navigation.openDrawer()}
      />
      <Appbar.Content
        title={title}
        color={colors.onBackground}
        titleStyle={{
          fontWeight: '900',
        }}
      />
    </Appbar.Header>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  appbar: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    height: 55,
  },
});
