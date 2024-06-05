import {StyleSheet, Text, TurboModuleRegistry, View} from 'react-native';
import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CommonActions} from '@react-navigation/native';
import {BottomNavigation} from 'react-native-paper';

import Icon from 'react-native-vector-icons/Ionicons';

import {
  MainDashboard,
  MainBisnis,
  MainLaporan,
  MainStatistik,
  PilihCabang,
} from '../pages';
import {Colors} from '../utils/colors';
import {LightTheme} from '../themes';

const Tab = createBottomTabNavigator();

const BottomBar = ({route}) => {
  const item = route.params;
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar
          activeIndicatorStyle={{
            backgroundColor: LightTheme.colors.btnColorContainer,
          }}
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
        initialParams={item}
        name="Dashboard"
        component={MainDashboard}
        options={{
          headerShown: false,
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({focused}) => {
            const iconSize = focused ? 27 : 23;
            const iconColor = focused ? Colors.btnColor : Colors.btnOpacity;
            const iconName = focused ? 'home' : 'home-outline';
            return <Icon name={iconName} size={iconSize} color={iconColor} />;
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
            const iconName = focused ? 'newspaper' : 'newspaper-outline';
            return <Icon name={iconName} size={iconSize} color={iconColor} />;
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
            const iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            return <Icon name={iconName} size={iconSize} color={iconColor} />;
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
            const iconName = focused ? 'business' : 'business-outline';
            return <Icon name={iconName} size={iconSize} color={iconColor} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomBar;

const styles = StyleSheet.create({});
