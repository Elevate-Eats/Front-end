import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {Appbar} from 'react-native-paper';
const TopBar = () => {
  return (
    <Appbar.Header dark={true} elevated={true}>
      <Appbar.Action icon="menu" isLeading={true} color={'#000'} />
      <Appbar.Content
        title="Dashboard"
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
