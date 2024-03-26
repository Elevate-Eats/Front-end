import {StyleSheet, Text, TurboModuleRegistry, View} from 'react-native';
import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CommonActions} from '@react-navigation/native';
import {BottomNavigation} from 'react-native-paper';

import Icon from 'react-native-vector-icons/Ionicons';

import {MainDashboard, MainBisnis, MainLaporan, MainStatistik} from '../pages';
import {Colors} from '../utils/colors';

const Tab = createBottomTabNavigator();

const BottomBar = () => {
  return (
    <Tab.Navigator
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar
          shifting={true}
          inactiveColor={Colors.btnOpacity}
          navigationState={state}
          safeAreaInsets={insets}
          activeColor={Colors.btnColor}
          style={{backgroundColor: 'white'}}
          onTabPress={({route, preventDefault}) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({route, focused, color, size}) => {
            const {options} = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({focused, color, size});
            }
            return null;
          }}
          getLabelText={({route}) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;
            return label;
          }}
        />
      )}>
      <Tab.Screen
        name="Dashboard"
        component={MainDashboard}
        options={{
          headerShown: false,
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({focused}) => {
            const iconSize = focused ? 27 : 23;
            const iconColor = focused ? Colors.btnColor : Colors.btnOpacity;
            return <Icon name="home" size={iconSize} color={iconColor} />;
          },
        }}
      />
      <Tab.Screen
        name="Laporan"
        component={MainLaporan}
        options={{
          headerShown: false,
          tabBarLabel: 'Laporan',
          tabBarIcon: ({focused}) => {
            const iconSize = focused ? 27 : 23;
            const iconColor = focused ? Colors.btnColor : Colors.btnOpacity;
            return <Icon name="clipboard" size={iconSize} color={iconColor} />;
          },
        }}
      />
      <Tab.Screen
        name="Statistik"
        component={MainStatistik}
        options={{
          headerShown: false,
          tabBarLabel: 'Statistik',
          tabBarIcon: ({focused}) => {
            const iconSize = focused ? 27 : 23;
            const iconColor = focused ? Colors.btnColor : Colors.btnOpacity;
            return (
              <Icon name="stats-chart" size={iconSize} color={iconColor} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Bisnis"
        component={MainBisnis}
        options={{
          headerShown: false,
          tabBarLabel: 'Bisnis',
          tabBarIcon: ({focused}) => {
            const iconSize = focused ? 27 : 23;
            const iconColor = focused ? Colors.btnColor : Colors.btnOpacity;
            return <Icon name="business" size={iconSize} color={iconColor} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomBar;

const styles = StyleSheet.create({});
