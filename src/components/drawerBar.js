import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CompanyAccount, MainDashboard} from '../pages';

const Drawer = createDrawerNavigator();
const DrawerBar = () => {
  const [active, setActive] = useState('');
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Dashboard" component={MainDashboard} />
      <Drawer.Screen name="Account" component={CompanyAccount} />
    </Drawer.Navigator>
  );
};

export default DrawerBar;

const styles = StyleSheet.create({});
