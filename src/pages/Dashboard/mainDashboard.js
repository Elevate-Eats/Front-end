import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  ToastAndroid,
  Image,
  SafeAreaView,
  Modal,
  Pressable,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../../utils/colors';
import {Text, useTheme} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  MANAGER_ENDPOINT,
  BRANCH_ENDPOINT,
  MENU_COMPANY_ENDPOINT,
  EMPLOYEE_ENDPOINT,
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
import employee, {allEmployee} from '../../redux/employee';
import getDataQuery from '../../utils/getDataQuery';
import {allManager} from '../../redux/manager';
import SalesToday from '../../components/salesToday';
import FormatRP from '../../utils/formatRP';
import BarChartComponent from '../../components/barChart';
import User from '../../assets/images/user-profile.jpg';
import Close from '../../assets/icons/close-bold.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainDashboard = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {colors} = useTheme();
  const selectBranch = useSelector(state => state.branch.selectedBranch);
  const employee = useSelector(state => state.employee.allEmployee);
  const [modal, setModal] = useState({
    chart: false,
    branch: false,
  });
  const [loading, setLoading] = useState(false);
  const [todayData, setTodayData] = useState({
    dailySummary: [],
    predict: [],
    weekly: [],
    shiftData: [],
    localData: {},
  });

  useEffect(() => {
    async function fetchLocalStorage(params) {
      const response = await AsyncStorage.getItem('credentials');
      setTodayData(prev => ({...prev, localData: JSON.parse(response)}));
    }
    fetchLocalStorage();
  }, []);

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
          // console.log('branch: ', JSON.stringify(branch));
          await AsyncStorage.setItem('allBranch', JSON.stringify(branch));
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
            // query: `companyId=1&branchId=12&startDate=2024-05-01&endDate=2024-05-01`,
            query: `companyId=${todayData.localData.companyid}&branchId=${selectBranch ? selectBranch.id : 1}&startDate=${new Date()}&endDate=${new Date()}`,
          });
          const dataPredict = await getDataQuery({
            operation: REPORT_ENDPOINT,
            endpoint: 'predictTransaction',
            resultKey: 'data',
            query: `branchId=${selectBranch ? selectBranch.id : 1}&startDate=${new Date()}&endDate=${new Date()}`,
          });
          const dataWeekly = await getDataQuery({
            operation: REPORT_ENDPOINT,
            endpoint: 'predictTransaction',
            resultKey: 'data',
            query: `branchId=${selectBranch ? selectBranch.id : 1}&startDate=2024-05-29&endDate=2024-06-04`,
          });

          let revenueShift1 = 0;
          let revenueShift2 = 0;
          let transactionShift1 = 0;
          let transactionShift2 = 0;
          if (dataDailySummary.length > 0) {
            const {totalsales, numberoftransactions} = dataDailySummary[0];
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

            const filteredData = dataWeekly
              .map(item => ({
                Tanggal: item['Tanggal'],
                Shift: item['Shift'],
                Days: item['Days'],
                JumlahTransaksi: item['Jumlah Transaksi'],
                Total: item['Total'] / 1000000,
              }))
              .sort((a, b) => a['Days'] - b['Days']);

            const aggregatedData = filteredData.reduce((acc, cur) => {
              const existing = acc.find(
                item => item['Tanggal'] === cur['Tanggal'],
              );
              if (existing) {
                existing['JumlahTransaksi'] += cur['JumlahTransaksi'];
                existing['Total'] += cur['Total'];
              } else {
                acc.push({...cur});
              }
              return acc;
            }, []);
            const weeklyTransactions = aggregatedData.map(
              day => day['JumlahTransaksi'],
            );
            const weeklySales = aggregatedData.map(day => day['Total']);
            // ! ==========================================================================

            const dataDaily = {
              transactions: numberoftransactions,
              sales: totalsales,
              salesChange: salesChange.toFixed(2),
              transactionChange: transactionChange.toFixed(2),
            };

            const dataPrediction = {
              transactions: totalPredictedTransactions,
              sales: totalPredictedSales,
            };

            const shiftData = [
              {shift: 1, transactions: transactionShift1, sales: revenueShift1},
              {shift: 2, transactions: transactionShift2, sales: revenueShift2},
            ];

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
          } else {
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
              ((0 - totalPredictedSales) / totalPredictedSales) * 100;
            const transactionChange =
              ((0 - totalPredictedTransactions) / totalPredictedTransactions) *
              100;

            const filteredData = dataWeekly
              .map(item => ({
                Tanggal: item['Tanggal'],
                Shift: item['Shift'],
                Days: item['Days'],
                JumlahTransaksi: item['Jumlah Transaksi'],
                Total: item['Total'] / 1000000,
              }))
              .sort((a, b) => a['Days'] - b['Days']);

            const aggregatedData = filteredData.reduce((acc, cur) => {
              const existing = acc.find(
                item => item['Tanggal'] === cur['Tanggal'],
              );
              if (existing) {
                existing['JumlahTransaksi'] += cur['JumlahTransaksi'];
                existing['Total'] += cur['Total'];
              } else {
                acc.push({...cur});
              }
              return acc;
            }, []);
            const weeklyTransactions = aggregatedData.map(
              day => day['JumlahTransaksi'],
            );
            const weeklySales = aggregatedData.map(day => day['Total']);

            // !============================================================================
            const dataDaily = {
              transactions: 0,
              sales: 0,
              salesChange: salesChange.toFixed(2),
              transactionChange: transactionChange.toFixed(2),
            };

            const dataPrediction = {
              transactions: totalPredictedTransactions,
              sales: totalPredictedSales,
            };

            const shiftData = [
              {shift: 1, transactions: transactionShift1, sales: revenueShift1},
              {shift: 2, transactions: transactionShift2, sales: revenueShift2},
            ];

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
    }, [dispatch, selectBranch?.id]),
  );

  // if (loading) {
  //   return <LoadingIndicator message="Please Wait ..." />;
  // }

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0,
  };

  const nullData = [0, 0, 0, 0, 0, 0, 0];
  const transactionData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: todayData.weekly[0] ? todayData.weekly[0].transactions : nullData,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: todayData.weekly[0] ? todayData.weekly[0].sales : nullData,
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  function modalChart(params) {
    return (
      <SafeAreaView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal.chart}
          onRequestClose={() => setModal(prev => ({...prev, chart: false}))}>
          <SafeAreaView style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[styles.textHeader, {flex: 1}]}>
                    Detail Transaksi Hari Ini
                  </Text>
                  <TouchableOpacity
                    onPress={() => setModal(prev => ({...prev, chart: false}))}>
                    <Close width={35} height={35} />
                  </TouchableOpacity>
                </View>
                <View style={{rowGap: 5, marginVertical: 10}}>
                  <Text style={{fontWeight: '900', fontSize: 18}}>Shift 1</Text>
                  <View style={styles.statRow}>
                    <View style={[styles.statItem, {rowGap: 5}]}>
                      <Text style={{fontSize: 16, color: 'grey'}}>
                        Transactions
                      </Text>
                      <Text style={styles.textValue}>
                        {todayData.shiftData[0]
                          ? todayData.shiftData[0].transactions
                          : 0}
                      </Text>
                    </View>
                    <View style={[styles.statItem, {rowGap: 5}]}>
                      <Text style={{fontSize: 16, color: 'grey'}}>Sales</Text>
                      <Text style={styles.textValue}>
                        {todayData.shiftData[0]
                          ? FormatRP(todayData.shiftData[0].sales)
                          : 0}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{rowGap: 5}}>
                  <Text style={{fontWeight: '900', fontSize: 18}}>Shift 2</Text>
                  <View style={styles.statRow}>
                    <View style={[styles.statItem, {rowGap: 5}]}>
                      <Text style={{fontSize: 16, color: 'grey'}}>
                        Transactions
                      </Text>
                      <Text style={styles.textValue}>
                        {todayData.shiftData[1]
                          ? todayData.shiftData[1].transactions
                          : 0}
                      </Text>
                    </View>
                    <View style={[styles.statItem, {rowGap: 5}]}>
                      <Text style={{fontSize: 16, color: 'grey'}}>Sales</Text>
                      <Text style={styles.textValue}>
                        {todayData.shiftData[1]
                          ? FormatRP(todayData.shiftData[1].sales)
                          : 0}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{marginHorizontal: 70, marginTop: 15}}>
                  <ConstButton
                    title="Close"
                    onPress={() => setModal(prev => ({...prev, chart: false}))}
                  />
                </View>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
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

  // console.log('local data: ', todayData.localData);

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} title={'Dashboard'} />
      <View
        style={[styles.blueLayer, {backgroundColor: Colors.secondaryColor}]}>
        <View style={styles.account}>
          <ModalBranch
            open={modal.branch}
            close={() => setModal(prev => ({...prev, branch: false}))}
          />
          {/* <Ionicons name="person-circle-outline" size={80} color={'white'} /> */}
          <Pressable onPress={() => navigation.navigate('Account')}>
            <Image
              source={User}
              style={{
                width: 80,
                height: 80,
                borderRadius: 100,
                marginRight: 15,
              }}
            />
          </Pressable>
          <View style={{justifyContent: 'center', rowGap: 5}}>
            <Text
              variant="titleMedium"
              style={{
                fontSize: 18,
                color: colors.onBackground,
                textTransform: 'lowercase',
              }}>
              {todayData.localData.nickname}
            </Text>
            {todayData.localData.role === 'general_manager' ? (
              <Text variant="titleMedium">General Manager</Text>
            ) : todayData.localData.role === 'store_manager' ? (
              <Text variant="titleMedium">Store Manager</Text>
            ) : (
              <Text variant="titleMedium">Area Manager</Text>
            )}
          </View>
        </View>
        <View style={styles.employee}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', columnGap: 5}}>
            <Ionicons name="people-outline" size={25} color="black" />
            <Text variant="titleLarge">{employee.length}</Text>
          </View>
          <TouchableOpacity
            style={styles.pilihCabang}
            onPress={() => setModal(prev => ({...prev, branch: true}))}>
            <Text style={{color: 'white'}} variant="bodyMedium">
              {selectBranch ? selectBranch.name : 'Pilih Cabang'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.whiteLayer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {modalChart(modal.chart)}
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TitleDashboard title="Prediksi Hari Ini" />
                <TouchableOpacity
                  onPress={prev => setModal({...prev, chart: true})}>
                  <Text style={styles.textDetails}>Detail</Text>
                </TouchableOpacity>
              </View>
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

            <BarChartComponent
              suffix={' trs'}
              data={transactionData}
              title={'Weekly Transaction Predictions'}
            />
            <BarChartComponent
              suffix={' jt'}
              label={'Rp. '}
              data={salesData}
              title={'Weekly Income Predictions'}
            />
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
    // backgroundColor: Colors.secondaryColor,
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
  textDetails: {
    fontWeight: '900',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  textHeader: {
    fontWeight: '900',
    fontSize: 18,
    marginVertical: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    padding: 10,
    borderWidth: 1, // Add black border
    borderColor: '#000', // Black border color
    borderRadius: 10, // Optional, add if you want rounded corners
  },
  textValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
