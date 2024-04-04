import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {LoginPage, RegisterPage} from '../pages';
import {BottomBar, DrawerBar} from '../components';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Route = () => {
  return (
    <NavigationContainer>
      <DrawerBar />
    </NavigationContainer>
  );
};

export default Route;
