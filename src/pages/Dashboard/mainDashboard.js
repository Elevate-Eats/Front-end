import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Colors} from '../../utils/colors';
import {Appbar, Button} from 'react-native-paper';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {LOGIN_ENDPOINT} from '@env';

import {TopBar} from '../../components';

const Drawer = createDrawerNavigator();

const MainDashboard = ({navigation}) => {
  return (
    <View style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
      <TopBar navigation={navigation} />
      <Button
        // onPress}
        labelStyle={{paddingVertical: 10}}
        icon=""
        mode="elevated"
        style={{
          marginTop: 10,
          borderRadius: 5,
          marginHorizontal: 20,
          backgroundColor: Colors.btnColor,
        }}>
        Button
      </Button>
    </View>
  );
};

export default MainDashboard;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
});
