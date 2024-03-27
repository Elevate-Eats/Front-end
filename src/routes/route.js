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
    <Stack.Navigator initialRouteName="Login">
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
};

export default Route;
