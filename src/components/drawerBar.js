import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  CompanyAccount,
  EditCabang,
  LoginPage,
  MainBisnis,
  MainDashboard,
  PilihCabang,
  RegisterPage,
  TambahCabang,
} from '../pages';
import {BottomBar} from '.';
import Route from '../routes/route';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const DrawerBar = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
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

      {/* BISNIS */}
      <Stack.Group>
        <Stack.Screen name="Pilih Cabang" component={PilihCabang} />
        <Stack.Screen name="Tambah Cabang" component={TambahCabang} />
        <Stack.Screen name="Edit Cabang" component={EditCabang} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default DrawerBar;

const styles = StyleSheet.create({});
