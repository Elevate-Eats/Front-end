import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useState} from 'react';
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  CompanyAccount,
  DetailTransaksi,
  EditCabang,
  EditMenu,
  EditPegawai,
  EditProduk,
  LoginPage,
  MainBisnis,
  MainDashboard,
  MainTransaksi,
  PilihCabang,
  PilihMenu,
  PilihPegawai,
  PilihProduk,
  RegisterPage,
  TambahCabang,
  TambahMenu,
  TambahPegawai,
  TambahProduk,
  Transaksi,
  PendingTransaction,
  Pembayaran,
  DetailItemsCart,
} from '../pages';
import {BottomBar} from '.';
import Route from '../routes/route';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors} from '../utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import ImgIcons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const DrawerBar = ({route}) => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => {
        return (
          <SafeAreaView>
            <View style={styles.drawer}>
              <ImgIcons
                name="person-circle-outline"
                color={'white'}
                size={90}
              />
              <Text
                variant="titleLarge"
                style={{color: 'white', fontWeight: '700'}}>
                CV. Balibul Solo
              </Text>
            </View>
            <DrawerItemList {...props} />
          </SafeAreaView>
        );
      }}
      screenOptions={{
        drawerStyle: {backgroundColor: 'white', width: 250},
        drawerActiveTintColor: 'white',
        drawerActiveBackgroundColor: Colors.btnColor,
        drawerInactiveTintColor: 'grey',
        drawerLabelStyle: {fontWeight: '500', fontSize: 14},
        swipeEnabled: false,
      }}>
      <Drawer.Group>
        <Drawer.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{
            headerShown: false,
            drawerIcon: ({focused}) => {
              const iconName = focused ? 'home' : 'home';
              const color = focused ? 'white' : 'gray';
              return <Icon name={iconName} size={25} color={color} />;
            },
          }}
        />
        <Drawer.Screen
          name="Account"
          component={CompanyAccount}
          options={{
            drawerLabel: 'Account',
            title: 'My Account',
            headerShown: true,
            drawerIcon: ({focused}) => {
              const iconName = focused ? 'person-circle' : 'person-circle';
              const color = focused ? 'white' : 'gray';
              return <Icon name={iconName} size={25} color={color} />;
            },
          }}
        />
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

function HomeStackNavigator(params) {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Bottom Tab"
        component={BottomBar}
        options={{
          headerShown: false,
          statusBarColor: Colors.btnColor,
          statusBarStyle: 'inverted',
        }}
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
      <Stack.Group
        screenOptions={{
          animation: 'slide_from_bottom',
          animationTypeForReplace: 'push',
          statusBarStyle: 'inverted',
          statusBarColor: Colors.btnColor,
        }}>
        <Stack.Screen name="Pilih Cabang" component={PilihCabang} />
        <Stack.Screen name="Tambah Cabang" component={TambahCabang} />
        <Stack.Screen name="Edit Cabang" component={EditCabang} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          animation: 'slide_from_bottom',
          animationTypeForReplace: 'push',
          statusBarStyle: 'inverted',
          statusBarColor: Colors.btnColor,
        }}>
        <Stack.Screen name="Pilih Pegawai" component={PilihPegawai} />
        <Stack.Screen name="Tambah Pegawai" component={TambahPegawai} />
        <Stack.Screen name="Edit Pegawai" component={EditPegawai} />
      </Stack.Group>

      {/* DASHBOARD*/}
      <Stack.Group
        screenOptions={{
          animation: 'slide_from_bottom',
          animationTypeForReplace: 'push',
          statusBarStyle: 'inverted',
          statusBarColor: Colors.btnColor,
        }}>
        <Stack.Screen name="Pilih Produk" component={PilihProduk} />
        <Stack.Screen name="Edit Produk" component={EditProduk} />
        <Stack.Screen name="Tambah Produk" component={TambahProduk} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Pilih Menu" component={PilihMenu} />
        <Stack.Screen name="Edit Menu" component={EditMenu} />
        <Stack.Screen name="Tambah Menu" component={TambahMenu} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Transaksi" component={MainTransaksi} />
        <Stack.Screen name="Transaksi 2" component={Transaksi} />
        <Stack.Screen
          name="Detail Transaksi"
          component={DetailTransaksi}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Detail Items Cart"
          component={DetailItemsCart}
          options={{headerShown: false}}
        />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Pending" component={PendingTransaction} />
      </Stack.Group>
      <Stack.Screen name="Pembayaran" component={Pembayaran} />
    </Stack.Navigator>
  );
}

export default DrawerBar;

const styles = StyleSheet.create({
  drawer: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.btnColor,
    marginBottom: 10,
    rowGap: 10,
  },
});
