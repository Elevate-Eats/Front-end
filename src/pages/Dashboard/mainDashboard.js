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
  ANALYTICS_ENDPOINT,
  REPORT_ENDPOINT,
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
import {allManager} from '../../redux/manager';
import SalesToday from '../../components/salesToday';
import FormatRP from '../../utils/formatRP';

const MainDashboard = ({navigation, route}) => {
  const dispatch = useDispatch();
  const selectBranch = useSelector(state => state.branch.selectedBranch);
  // console.log('select branch: ', selectBranch.id);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [todayData, setTodayData] = useState({
    dailySummary: [],
    predict: [],
    weekly: [],
    shiftData: [],
  });

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
          const dataDailySummary = await getDataQuery({
            operation: ANALYTICS_ENDPOINT,
            endpoint: 'showDailySummary',
            resultKey: 'data',
            query: `companyId=1&branchId=12&startDate=2024-05-08&endDate=2024-05-08`,
          });
          const dataPredict = await getDataQuery({
            operation: REPORT_ENDPOINT,
            endpoint: 'predictTransaction',
            resultKey: 'data',
            query: `branchId=12&startDate=2024-05-08&endDate=2024-05-08`,
          });
          const dataWeekly = await getDataQuery({
            operation: REPORT_ENDPOINT,
            endpoint: 'predictTransaction',
            resultKey: 'data',
            query: `branchId=12&startDate=2024-05-13&endDate=2024-05-19`,
          });
          if (dataDailySummary && dataPredict && dataWeekly) {
            const {totalsales, numberoftransactions} = dataDailySummary[0];
            let revenueShift1 = 0;
            let revenueShift2 = 0;
            let transactionShift1 = 0;
            let transactionShift2 = 0;

            dataPredict.forEach(item => {
              if (item['Shift'] === 1) {
                transactionShift1 += item['Jumlah Transaksi'];
                revenueShift1 += item['Total'];
              } else if (item['Shift'] === 2) {
                transactionShift2 += item['Jumlah Transaksi'];
                revenueShift2 += item['Total'];
              }
            });

            const totalPredictedSales = revenueShift1 + revenueShift2;
            const totalPredictedTransactions =
              transactionShift1 + transactionShift2;
            const salesChange =
              ((totalsales - totalPredictedSales) / totalPredictedSales) * 100;
            const transactionChange =
              ((numberoftransactions - totalPredictedTransactions) /
                totalPredictedTransactions) *
              100;

            const dataDaily = {
              transactions: numberoftransactions,
              sales: totalsales,
              transactionChange: transactionChange.toFixed(2),
              salesChange: salesChange.toFixed(2),
            };

            const dataPrediction = {
              transactions: totalPredictedTransactions,
              sales: totalPredictedSales,
            };

            const shiftData = [
              {shift: 1, transactions: transactionShift1, sales: revenueShift1},
              {shift: 2, transactions: transactionShift2, sales: revenueShift2},
            ];

            const filteredData = dataWeekly
              .map(item => ({
                Tanggal: item.Tanggal,
                Shift: item.Shift,
                Days: item.Days,
                JumlahTransaksi: item['Jumlah Transaksi'],
                Total: item.Total / 1000000,
              }))
              .sort((a, b) => a.Days - b.Days);

            const aggregatedData = filteredData.reduce((acc, cur) => {
              const existing = acc.find(item => item.Tanggal === cur.Tanggal);
              if (existing) {
                existing.JumlahTransaksi += cur.JumlahTransaksi;
                existing.Total += cur.Total;
              } else {
                acc.push({...cur});
              }
              return acc;
            }, []);
            const weeklyTransactions = aggregatedData.map(
              day => day.JumlahTransaksi,
            );
            const weeklySales = aggregatedData.map(day => day.Total);

            const weeklyData = {
              transactions: weeklyTransactions,
              sales: weeklySales,
            };

            setTodayData(prev => ({
              ...prev,
              dailySummary: [dataDaily],
              predict: [dataPrediction],
              shiftData: shiftData,
              weekly: [weeklyData],
            }));
          }
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

  // if (loading) {
  //   return <LoadingIndicator message="Please Wait ..." />;
  // }

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
          {/* <View style={{flexDirection: 'row', marginBottom: 100}}> */}
          {/* <ItemDashboard
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
            /> */}
          {/* </View> */}
          <View style={{rowGap: 10}}>
            <View>
              <TitleDashboard title="Bisnis Hari Ini" />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <SalesToday
                  loading={loading}
                  label={'Jumlah Transaksi'}
                  value={
                    todayData.dailySummary[0]
                      ? todayData.dailySummary[0].transactions
                      : 0
                  }
                  percentage={
                    todayData.dailySummary[0]
                      ? todayData.dailySummary[0].transactionChange
                      : 0
                  }
                />
                <SalesToday
                  loading={loading}
                  label={'Penjualan'}
                  value={
                    todayData.dailySummary[0]
                      ? FormatRP(todayData.dailySummary[0].sales)
                      : 0
                  }
                  percentage={
                    todayData.dailySummary[0]
                      ? todayData.dailySummary[0].salesChange
                      : 0
                  }
                />
              </View>
            </View>
            <View>
              <TitleDashboard title="Prediksi Hari Ini" />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <SalesToday
                  loading={loading}
                  label={'Jumlah Transaksi'}
                  value={
                    todayData.predict[0] ? todayData.predict[0].transactions : 0
                  }
                />
                <SalesToday
                  loading={loading}
                  label={'Prediksi Penjualan'}
                  value={
                    todayData.predict[0]
                      ? FormatRP(todayData.predict[0].sales)
                      : 0
                  }
                />
              </View>
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
