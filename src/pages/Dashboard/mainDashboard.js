import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Colors} from '../../utils/colors';
import {Text} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MANAGER_ENDPOINT, BRANCH_ENDPOINT, MENU_COMPANY_ENDPOINT} from '@env';
import {
  ItemDashboard,
  TopBar,
  TitleDashboard,
  ConstButton,
  ModalBranch,
} from '../../components';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import GetData from '../../utils/getData';
import {allBranch} from '../../redux/branchSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {allMenu} from '../../redux/menuSlice';
import {listColumns} from '../../database/listColumn';

const MainDashboard = ({navigation, route}) => {
  const dispatch = useDispatch();
  const selectBranch = useSelector(state => state.branch.selectedBranch);

  const [modal, setModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        try {
          const branch = await GetData({
            operation: BRANCH_ENDPOINT,
            endpoint: 'showBranches',
            resultKey: 'branchData',
          });
          const menuCompany = await GetData({
            operation: MENU_COMPANY_ENDPOINT,
            endpoint: 'showMenus',
            resultKey: 'menuData',
          });
          if (Array.isArray(branch) && Array.isArray(menuCompany)) {
            dispatch(allBranch(branch)); // !save branch to redux
            dispatch(allMenu(menuCompany)); //! save menu Company to redux
          }
        } catch (error) {
          console.log('Error useFocus');
        }
      }
      fetchData();
    }, [dispatch]),
  );

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} title={'Dashboard'} />

      <View style={styles.blueLayer}>
        <View style={styles.account}>
          <Ionicons name="person-circle-outline" size={80} color={'white'} />
          <View style={{justifyContent: 'center', rowGap: 5}}>
            <Text variant="titleMedium" style={{fontSize: 18}}>
              {/* {manager.name ? manager.name : 'Name'} */}
              name
            </Text>
            <Text variant="titleMedium">
              {/* {manager.role ? manager.role : 'role'} */}
              role
            </Text>
          </View>
        </View>
        <View style={styles.employee}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', columnGap: 5}}>
            <Ionicons name="people-outline" size={25} color="black" />
            <Text variant="titleLarge">10</Text>
          </View>
          <TouchableOpacity
            style={styles.pilihCabang}
            onPress={() => setModal(true)}>
            <Text style={{color: 'white'}} variant="bodyMedium">
              {selectBranch ? selectBranch.name : 'Pilih Cabang'}
              {/* {branchName ? branchName : 'Pilih Cabang'} */}
            </Text>
          </TouchableOpacity>
          <ModalBranch open={modal} close={() => setModal(false)} />
        </View>
      </View>

      <View style={styles.whiteLayer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>? */}
            <ItemDashboard
              iconName="fast-food"
              name="Menu"
              onPress={() => navigation.navigate('Pilih Produk')}
            />
            <ItemDashboard iconName="clipboard-outline" name="History" />
            <ItemDashboard
              iconName="hourglass-outline"
              name="On Going"
              onPress={() => navigation.navigate('Pending')}
            />
            {/* </ScrollView> */}
          </View>
          <View style={{rowGap: 10}}>
            <View>
              <TitleDashboard title="Bisnis hari ini" />
              <View style={styles.box}></View>
            </View>
            <View>
              <TitleDashboard title="Penjualan" />
              <View style={styles.box}></View>
            </View>
            <View>
              <TitleDashboard title="Statistik" />
              <View style={styles.box}></View>
            </View>
          </View>
        </ScrollView>
        <View style={{marginTop: 10}}>
          <ConstButton
            title="Transaksi"
            onPress={() => navigation.navigate('Transaksi')}
          />
        </View>
      </View>
    </View>
  );
};

export default MainDashboard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  blueLayer: {
    backgroundColor: Colors.secondaryColor,
    flex: 1 / 5,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  whiteLayer: {
    backgroundColor: 'white',
    flex: 4 / 5,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 10,
    elevation: 1,
    padding: 10,
  },
  pilihCabang: {
    backgroundColor: Colors.btnColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  account: {
    marginHorizontal: 10,
    columnGap: 2,
    flexDirection: 'row',
    flex: 1,
  },
  employee: {
    alignItems: 'flex-end',
    marginHorizontal: 10,
    rowGap: 5,
  },
  box: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.btnColor,
    width: 320,
    height: 160,
    borderRadius: 5,
  },
});
