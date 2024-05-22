import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {TopBar} from '../../components';
import {useNavigation} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import {useSelector} from 'react-redux';
import {Colors} from '../../utils/colors';
import Analisis from '../../assets/icons/analisis-bulk.svg';
import Bar from '../../assets/icons/chart-bulk.svg';
import Store from '../../assets/icons/store-bulk.svg';
import ArrowRight from '../../assets/icons/arrow-right-bulk.svg';
import ArrowDown from '../../assets/icons/arrow-down-bulk.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import FormatDateToISO from '../../utils/formatDateToIso';
import FormatDateTime from '../../utils/formatDateTime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarPicker from '../../components/calendar';
import SalesItem from '../../components/salesItem';
import IncomeItem from '../../components/incomeItem';
import getDataQuery from '../../utils/getDataQuery';
import {ANALYTICS_ENDPOINT} from '@env';
import BarChartComponent from '../../components/barChart';
import ContentPage from '../../components/contentPage';

const MainStatistik = () => {
  const navigation = useNavigation();
  const {allBranch} = useSelector(state => state.branch);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [type, setType] = useState('');
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [items, setItems] = useState([]);

  const menuCompany = useSelector(state => state.menu.allMenu);

  const listBranch = allBranch.map(item => ({
    label: item.name,
    value: item.id,
  }));

  useEffect(() => {
    const fetchCompanyId = async () => {
      const id = await AsyncStorage.getItem('companyId');
      setCompanyId(id);
    };
    fetchCompanyId();
  }, []);

  useEffect(() => {
    if (value && startDate && endDate) {
      const fetchAnalyticsData = async () => {
        const querySummary = `companyId=${companyId}&branchId=${value}&startDate=${FormatDateToISO(
          FormatDateTime(startDate).realDate,
        )}&endDate=${FormatDateToISO(FormatDateTime(endDate).realDate)}`;
        const queryExpense = `branchId=${value}&startDate=${FormatDateToISO(
          FormatDateTime(startDate).realDate,
        )}&endDate=${FormatDateToISO(FormatDateTime(endDate).realDate)}`;
        const queryHourly = `companyId=${companyId}&branchId=${value}&startDateTime=${FormatDateToISO(
          FormatDateTime(startDate).realDate,
        )}&endDateTime=${FormatDateToISO(FormatDateTime(endDate).realDate)}`;
        try {
          setLoading(true);
          const dataSummary = await getDataQuery({
            operation: ANALYTICS_ENDPOINT,
            endpoint: 'showAdvancedSummary',
            resultKey: 'data',
            query: querySummary,
          });
          setSummary(dataSummary);
          const dataExpense = await getDataQuery({
            operation: ANALYTICS_ENDPOINT,
            endpoint: 'showAdvancedExpenses',
            resultKey: 'data',
            query: queryExpense,
          });
          if (dataExpense) {
            const combinedData = {
              ...dataSummary[0],
              sumtotal: dataExpense.sumtotal,
            };
            setSummary([combinedData]);
          }
          const dataHourly = await getDataQuery({
            operation: ANALYTICS_ENDPOINT,
            endpoint: 'showAdvancedHourlySummary',
            resultKey: 'data',
            query: queryHourly,
          });
          setHourly(dataHourly);
          const dataItems = await getDataQuery({
            operation: ANALYTICS_ENDPOINT,
            endpoint: 'showAdvancedItemsSummary',
            resultKey: 'data',
            query: querySummary,
          });
          setItems(dataItems);
        } catch (error) {
          console.log('error: ', error);
        } finally {
          setLoading(false);
        }
      };
      fetchAnalyticsData();
    }
  }, [startDate, endDate, value]);

  const handleStartDate = (event, selectedDate) => {
    if (!selectedDate) {
      setStartDate(null);
      setShowDate(false);
      return;
    }
    setStartDate(selectedDate);
    setDate(selectedDate);
    setShowDate(false);
  };

  const handleEndDate = (event, selectedDate) => {
    if (!selectedDate) {
      setEndDate(null);
      setShowDate(false);
      return;
    }
    setEndDate(selectedDate);
    setDate(selectedDate);
    setShowDate(false);
  };

  const chartData = datas => {
    let labels = [];
    let data = [];

    if (datas === 'item') {
      items.forEach(item => {
        const menuItem = menuCompany.find(
          menuItem => menuItem.id === item.menuid,
        );
        if (menuItem) {
          labels.push(menuItem.name);
          data.push(parseInt(item.sumitemssold));
        }
      });
    } else {
      hourly.forEach(item => {
        const hour = parseInt(item.hour);
        const formattedHour =
          hour === 12 ? `${hour}p` : hour > 12 ? `${hour - 12}p` : `${hour}a`;
        labels.push(formattedHour);
        data.push(parseInt(item.sumtransactions));
      });
    }

    return {labels, data};
  };

  const dataHourly = {
    labels: chartData('hour').labels,
    datasets: [{data: chartData('hour').data}],
  };

  const dataItems = {
    labels: chartData('item').labels,
    datasets: [{data: chartData('item').data}],
  };

  function handlePress(screen) {
    navigation.navigate(screen);
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
      <TopBar title={'Statistik'} navigation={navigation} />
      {/* <ScrollView style={[styles.whiteLayer, {flexGrow: 1}]}>
        <Dropdown
          mode="modal"
          data={listBranch.sort((a, b) =>
            a.label.toUpperCase().localeCompare(b.label.toUpperCase()),
          )}
          search
          labelField={'label'}
          valueField={'value'}
          placeholder="Pilih cabang"
          placeholderStyle={{fontWeight: '500', fontSize: 18}}
          value={value}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
          style={styles.dropdown}
          selectedTextStyle={styles.selectedTextStyle}
          renderLeftIcon={() => (
            <View style={{marginRight: 10}}>
              <Store width={25} height={25} />
            </View>
          )}
          renderRightIcon={() => (
            <View>
              {!isFocus ? (
                <ArrowDown width={15} height={15} />
              ) : (
                <ArrowRight width={15} height={15} />
              )}
            </View>
          )}
        />
        <View style={styles.calendarContainer}>
          <CalendarPicker
            title="Start Date"
            date={startDate ? FormatDateTime(startDate).realDate : null}
            onPress={() => {
              setShowDate(true);
              setType('START_DATE');
            }}
          />
          <CalendarPicker
            disabled={startDate === null}
            title="End Date"
            date={endDate ? FormatDateTime(endDate).realDate : null}
            onPress={() => {
              setShowDate(true);
              setType('END_DATE');
            }}
          />
          {showDate && (
            <DateTimePicker
              value={
                type === 'START_DATE' ? startDate || date : endDate || date
              }
              mode="date"
              onChange={type === 'START_DATE' ? handleStartDate : handleEndDate}
              negativeButton={{label: 'Batal', textColor: Colors.deleteColor}}
              minimumDate={type === 'END_DATE' ? startDate : null}
            />
          )}
        </View>
        <View style={{flexDirection: 'row', gap: 20}}>
          <SalesItem
            title="Transaksi"
            total={summary.length > 0 ? summary[0].sumtransactions : '0'}
            loading={loading}
          />
          <SalesItem
            title="Item"
            total={summary.length > 0 ? summary[0].sumitemssold : '0'}
            loading={loading}
          />
        </View>
        <View style={{marginVertical: 10}}>
          <IncomeItem
            title="Sales Information"
            profit={
              summary.length > 0
                ? parseInt(summary[0].sumtotalsales) -
                  parseInt(summary[0].sumtotal)
                : '0'
            }
            income={
              summary.length > 0 ? parseInt(summary[0].sumtotalsales) : '0'
            }
            expense={summary.length > 0 ? parseInt(summary[0].sumtotal) : '0'}
            loading={loading}
          />
        </View>
        <View style={{marginVertical: 10}}>
          <BarChartComponent
            title="Hourly Performance Chart"
            data={dataHourly}
          />
        </View>
        <View style={{marginVertical: 10}}>
          <BarChartComponent title="Menu Item Sales Chart" data={dataItems} />
        </View>
      </ScrollView> */}
      <ScrollView style={[styles.whiteLayer, {flexGrow: 1}]}>
        <View style={{marginVertical: 15}}>
          <Text style={styles.textOpsi}>Pilih Opsi</Text>
          <ContentPage
            title="Data Analisis"
            Icon={Analisis}
            onPress={() => handlePress('Data Analisis')}
          />
          <ContentPage
            title="Data Prediksi"
            Icon={Bar}
            onPress={() => handlePress('Data Prediksi')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainStatistik;

const styles = StyleSheet.create({
  textOpsi: {
    fontSize: 20,
    fontWeight: '700',
    padding: 10,
  },
  dropdown: {
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
  },
  pickDate: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
  },
  whiteLayer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 5,
    elevation: 1,
    paddingHorizontal: 10,
  },
  selectedTextStyle: {
    fontWeight: '500',
    fontSize: 18,
    color: Colors.btnColor,
  },
  calendarContainer: {
    flexDirection: 'row',
    columnGap: 15,
    paddingVertical: 10,
  },
});
