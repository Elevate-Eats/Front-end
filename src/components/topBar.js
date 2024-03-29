import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {Appbar} from 'react-native-paper';
import {DrawerBar} from '.';
const TopBar = ({navigation, title}) => {
  return (
    <Appbar.Header dark={true} elevated={true}>
      <Appbar.Action
        icon="menu"
        isLeading={true}
        color={'#000'}
        onPress={() => navigation.openDrawer()}
      />
      <Appbar.Content
        title={title}
        color={'#000'}
        titleStyle={{
          fontWeight: '800',
        }}
      />
    </Appbar.Header>
  );
};

export default TopBar;

const styles = StyleSheet.create({});
