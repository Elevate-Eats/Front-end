import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {Appbar} from 'react-native-paper';
import {DrawerBar} from '.';
import {Colors} from '../utils/colors';
const TopBar = ({navigation, title}) => {
  return (
    <Appbar.Header dark={true} elevated={true} style={styles.appbar}>
      <Appbar.Action
        icon="menu"
        // isLeading={true}
        color={'#000'}
        onPress={() => navigation.openDrawer()}
      />
      <Appbar.Content
        title={title}
        color={'#000'}
        titleStyle={{
          fontWeight: '500',
        }}
      />
    </Appbar.Header>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
});
