import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Appearance,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import React from 'react';
import {createDrawerNavigator, DrawerItemList} from '@react-navigation/drawer';
import {
  History,
  CompanyAccount,
  DetailTransaksi,
  EditCabang,
  EditMenu,
  EditPegawai,
  EditProduk,
  LoginPage,
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
  DetailHistory,
  DetailPembayaran,
  MainExpense,
  AddExpense,
  EditExpense,
  DataAnalisis,
  DataPrediksi,
  SplashScreen,
  PilihManager,
  EditManager,
  TambahManager,
  MainLaporan,
} from '../pages';
import {BottomBar} from '.';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Colors} from '../utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import ImgIcons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Chart, MoneySend, StatusUp} from '../assets/icons';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const DrawerBar = ({route}) => {
  const {colors} = useTheme();
  const selectedBranch = useSelector(state => state.branch.selectedBranch);
  return (
    <Drawer.Navigator
      drawerContent={props => {
        const {navigation} = props;
        function handleLogOut(params) {
          navigation.navigate('Home');
          navigation.closeDrawer();
          AsyncStorage.clear()
            .then(() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                }),
              );
            })
            .catch(error => {
              console.log('Error clearing AsyncStorage: ', error);
            });
        }
        return (
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
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
            <TouchableOpacity
              onPress={() => handleLogOut()}
              style={[
                styles.logoutButton,
                {
                  alignItems: 'flex-end',
                  backgroundColor: colors.errorContainer,
                },
              ]}>
              <Icon
                name="log-out-outline"
                size={25}
                color={
                  Appearance.getColorScheme() === 'light'
                    ? colors.error
                    : colors.onErrorContainer
                }
              />
              <Text
                style={{
                  color:
                    Appearance.getColorScheme() === 'light'
                      ? colors.error
                      : colors.onErrorContainer,
                  fontWeight: '900',
                }}>
                Log Out
              </Text>
            </TouchableOpacity>
          </ScrollView>
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
            title: 'Dashboard',
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
            headerShown: false,
            drawerIcon: ({focused}) => {
              const iconName = focused ? 'person-circle' : 'person-circle';
              const color = focused ? 'white' : 'gray';
              return <Icon name={iconName} size={25} color={color} />;
            },
          }}
        />
        <Drawer.Screen
          name="Catatan Pengeluaran"
          component={MainExpense}
          options={{
            drawerLabel: 'Catatan Pengeluaran',
            title: 'Catatan Pengeluaran',
            headerShown: false,
            drawerIcon: ({focused}) => {
              return focused ? (
                <MoneySend width={25} height={25} />
              ) : (
                <MoneySend width={25} height={25} />
              );
            },
          }}
        />
        <Drawer.Screen
          name="Data Analisis"
          component={DataAnalisis}
          options={{
            drawerLabel: 'Data Analisis',
            title: 'Data Analisis',
            headerShown: false,
            drawerIcon: ({focused}) => {
              return focused ? (
                <StatusUp width={25} height={25} />
              ) : (
                <StatusUp width={25} height={25} />
              );
            },
          }}
        />
        <Drawer.Screen
          name="Data Prediksi"
          component={DataPrediksi}
          options={{
            drawerLabel: 'Data Prediksi',
            title: 'Data Prediksi',
            headerShown: false,
            drawerIcon: ({focused}) => {
              return focused ? (
                <Chart width={25} height={25} />
              ) : (
                <Chart width={25} height={25} />
              );
            },
          }}
        />
        <Drawer.Screen
          name="Pilih Produk"
          component={PilihProduk}
          options={{
            drawerLabel: 'List Menu Branch',
            title: 'Pilih Produk',
            drawerIcon: ({focused}) => {
              const iconName = focused ? 'fast-food' : 'fast-food-outline';
              const color = focused ? 'white' : 'gray';
              return <Icon name={iconName} size={25} color={color} />;
            },
          }}
        />
        <Drawer.Screen
          initialParams={selectedBranch}
          name="Riwayat Transaksi"
          component={History}
          options={{
            drawerLabel: 'Riwayat Transaksi',
            title: 'Riwayat Transaksi',
            drawerIcon: ({focused}) => {
              const iconName = focused ? 'clipboard' : 'clipboard-outline';
              const color = focused ? 'white' : 'gray';
              return <Icon name={iconName} size={25} color={color} />;
            },
          }}
        />
        <Drawer.Screen
          name="On Going"
          component={PendingTransaction}
          options={{
            drawerLabel: 'On Going',
            title: 'On Going',
            drawerIcon: ({focused}) => {
              const iconName = focused ? 'hourglass' : 'hourglass-outline';
              const color = focused ? 'white' : 'gray';
              return <Icon name={iconName} size={25} color={color} />;
            },
          }}
        />
        <Drawer.Screen
          name="Pilih Cabang"
          component={PilihCabang}
          options={{
            drawerLabel: 'List Cabang',
            title: 'Pilih Cabang',
            drawerIcon: ({focused}) => {
              const iconName = focused ? 'storefront' : 'storefront-outline';
              const color = focused ? 'white' : 'gray';
              return <Icon name={iconName} size={25} color={color} />;
            },
          }}
        />
        <Drawer.Screen
          name="Pilih Manager"
          component={PilihManager}
          options={{
            drawerLabel: 'List Manager',
            title: 'Pilih Manager',
            drawerIcon: ({focused}) => {
              const iconName = focused ? 'person' : 'person-outline';
              const color = focused ? 'white' : 'gray';
              return <Icon name={iconName} size={25} color={color} />;
            },
          }}
        />
        <Drawer.Screen
          name="Pilih Pegawai"
          component={PilihPegawai}
          options={{
            drawerLabel: 'List Pegawai',
            title: 'Pilih Pegawai',
            drawerIcon: ({focused}) => {
              const iconName = focused ? 'people' : 'people-outline';
              const color = focused ? 'white' : 'gray';
              return <Icon name={iconName} color={color} size={25} />;
            },
          }}
        />
        <Drawer.Screen
          name="Pilih Menu"
          component={PilihMenu}
          options={{
            drawerLabel: 'List Menu Company',
            title: 'Pilih Menu',
            drawerIcon: ({focused}) => {
              const iconName = focused ? 'cube' : 'cube-outline';
              const color = focused ? 'white' : 'gray';
              return <Icon name={iconName} color={color} size={25} />;
            },
          }}
        />
      </Drawer.Group>
    </Drawer.Navigator>
  );
};

function HomeStackNavigator(params) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash Screen"
        component={SplashScreen}
        options={{headerShown: false}}
      />

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
          animation: 'simple_push',
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
          animation: 'simple_push',
          animationTypeForReplace: 'push',
          statusBarStyle: 'inverted',
          statusBarColor: Colors.btnColor,
        }}>
        <Stack.Screen name="Pilih Manager" component={PilihManager} />
        <Stack.Screen name="Edit Manager" component={EditManager} />
        <Stack.Screen name="Tambah Manager" component={TambahManager} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          animation: 'simple_push',
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
          animation: 'simple_push',
          animationTypeForReplace: 'push',
          statusBarStyle: 'inverted',
          statusBarColor: Colors.btnColor,
        }}>
        {/* <Stack.Screen name="Pilih Produk" component={PilihProduk} /> */}
        <Stack.Screen
          name="Edit Produk"
          component={EditProduk}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Tambah Produk" component={TambahProduk} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          animation: 'simple_push',
          statusBarStyle: 'inverted',
          statusBarColor: Colors.btnColor,
        }}>
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
      <Stack.Group>
        <Stack.Screen name="Pembayaran" component={Pembayaran} />
        <Stack.Screen
          name="Detail Pembayaran"
          component={DetailPembayaran}
          options={{headerShown: false}}
        />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen
          name="History"
          component={History}
          options={{title: 'Riwayat Penjualan', headerShown: false}}
        />
        <Stack.Screen
          name="Detail History"
          component={DetailHistory}
          options={{headerShown: false}}
        />
      </Stack.Group>

      {/*LAPORAN */}
      <Stack.Group screenOptions={{animation: 'simple_push'}}>
        <Stack.Screen
          name="Pengeluaran"
          component={MainExpense}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Tambah Pengeluaran" component={AddExpense} />
        <Stack.Screen name="Edit Pengeluaran" component={EditExpense} />
      </Stack.Group>

      <Stack.Group
        screenOptions={{animation: 'simple_push', headerShown: false}}>
        <Stack.Screen name="Data Analisis" component={DataAnalisis} />
        <Stack.Screen name="Data Prediksi" component={DataPrediksi} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default DrawerBar;

const styles = StyleSheet.create({
  drawer: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.btnColor,
    marginBottom: 10,
    rowGap: 10,
  },
  logoutButton: {
    marginTop: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    borderRadius: 10,
  },
});
