import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CompanyAccount, LoginPage, MainDashboard, RegisterPage} from '../pages';
import {BottomBar} from '.';
import Route from '../routes/route';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const DrawerBar = () => {
  const [active, setActive] = useState('');
  return (
    <Drawer.Navigator initialRouteName="Home Stack">
      <Drawer.Screen
        name="Home Stack"
        component={HomeStackNavigator}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Account"
        component={CompanyAccount}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

function HomeStackNavigator(params) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Bottom Tab"
        component={BottomBar}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Sign Up"
        component={RegisterPage}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default DrawerBar;

const styles = StyleSheet.create({});
