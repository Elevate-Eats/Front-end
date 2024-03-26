import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  MainBisnis,
  MainDashboard,
  MainLaporan,
  MainStatistik,
  MainTransaksi,
} from '../pages';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../utils/colors';
import {BottomBar} from '../components';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// function BottomTab(params) {
//   return (
//     <Tab.Navigator
//       screenOptions={({route}) => ({
//         tabBarIcon: ({focused, color, size}) => {
//           let iconName;
//           if (route.name === 'Dashboard') {
//             iconName = 'home';
//             // color = focused ? Colors.btnColor : Colors.backgroundColor;
//             size = focused ? 32 : 25;
//           } else if (route.name === 'Statistik') {
//             iconName = 'stats-chart';
//             size = focused ? 32 : 25;
//           } else if (route.name === 'Laporan') {
//             iconName = 'clipboard';
//             size = focused ? 32 : 25;
//           } else if (route.name === 'Bisnis') {
//             iconName = 'business';
//             size = focused ? 32 : 25;
//           }

//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: Colors.btnColor,
//         tabBarInactiveTintColor: Colors.btnOpacity,
//         tabBarShowLabel: false,
//         tabBarStyle: {height: 60},
//       })}>
//       <Tab.Screen
//         name="Dashboard"
//         component={MainDashboard}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen
//         name="Statistik"
//         component={MainStatistik}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen
//         name="Laporan"
//         component={MainLaporan}
//         options={{headerShown: false}}
//       />
//       <Tab.Screen
//         name="Bisnis"
//         component={MainBisnis}
//         options={{headerShown: false}}
//       />
//       {/* <Tab.Screen name="Dashboard" component={MainDashboard} /> */}
//     </Tab.Navigator>
//   );
// }

const Route = () => {
  return (
    <Stack.Navigator initialRouteName="Bottom Tab">
      <Stack.Screen
        name="Bottom Tab"
        component={BottomBar}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Transaksi" component={MainTransaksi} />
    </Stack.Navigator>
  );
};

export default Route;
