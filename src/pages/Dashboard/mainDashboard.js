import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors} from '../../utils/colors';
import {Text} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  MANAGER_ENDPOINT,
  BRANCH_ENDPOINT,
  MENU_COMPANY_ENDPOINT,
  EMPLOYEE_ENDPOINT,
  TRANSACTION_ENDPOINT,
} from '@env';
import {
  ItemDashboard,
  TopBar,
  TitleDashboard,
  ConstButton,
  ModalBranch,
  LoadingIndicator,
} from '../../components';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import GetData from '../../utils/getData';
import {allBranch} from '../../redux/branchSlice';
import {allMenu} from '../../redux/menuSlice';
import {allEmployee} from '../../redux/employee';
import getDataQuery from '../../utils/getDataQuery';
import {allTransaction} from '../../redux/showTransaction';
import {allManager} from '../../redux/manager';

const MainDashboard = ({navigation, route}) => {
  const dispatch = useDispatch();
  const selectBranch = useSelector(state => state.branch.selectedBranch);
  console.log('select branch: ', selectBranch);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        setLoading(true);
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
          const employee = await GetData({
            operation: EMPLOYEE_ENDPOINT,
            endpoint: 'showEmployees',
            resultKey: 'employeeData',
          });
          const manager = await GetData({
            operation: MANAGER_ENDPOINT,
            endpoint: 'showManagers',
            resultKey: 'managerData',
          });
          if (branch || menuCompany || employee || manager) {
            dispatch(allBranch(branch));
            dispatch(allMenu(menuCompany));
            dispatch(allEmployee(employee));
            dispatch(allManager(manager));
          }
        } catch (error) {
          console.log('Eror fetching data: ', error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [dispatch]),
  );

  if (loading) {
    return <LoadingIndicator message="Please Wait ..." />;
  }
  function handlePress(params) {
    if (!selectBranch) {
      ToastAndroid.show(
        'Silakan pilih cabang terlebih dahulu',
        ToastAndroid.SHORT,
      );
    } else {
      navigation.navigate(params, {data: selectBranch.id});
    }
  }

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} title={'Dashboard'} />
      <View style={styles.blueLayer}>
        <View style={styles.account}>
          <Ionicons name="person-circle-outline" size={80} color={'white'} />
          <View style={{justifyContent: 'center', rowGap: 5}}>
            <Text variant="titleMedium" style={{fontSize: 18}}>
              name
            </Text>
            <Text variant="titleMedium">role</Text>
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
            </Text>
          </TouchableOpacity>
          <ModalBranch open={modal} close={() => setModal(false)} />
        </View>
      </View>

      <View style={styles.whiteLayer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            <ItemDashboard
              iconName="fast-food"
              name="Menu"
              onPress={() => handlePress('Pilih Produk')}
            />
            <ItemDashboard
              iconName="clipboard-outline"
              name="History"
              onPress={() => handlePress('History')}
            />
            <ItemDashboard
              iconName="hourglass-outline"
              name="On Going"
              onPress={() => handlePress('Pending')}
            />
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
            onPress={() => {
              handlePress('Transaksi');
            }}
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
    marginHorizontal: 5,
    marginTop: 5,
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
    marginHorizontal: 5,
    marginBottom: 5,
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
