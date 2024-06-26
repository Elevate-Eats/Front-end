import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import getDataQuery from '../../utils/getDataQuery';
import {REPORT_ENDPOINT} from '@env';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Store from '../../assets/icons/store-bulk.svg';
import ArrowRight from '../../assets/icons/arrow-right-bulk.svg';
import ArrowDown from '../../assets/icons/arrow-down-bulk.svg';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Colors} from '../../utils/colors';
import CalendarPicker from '../../components/calendar';
import FormatDateTime from '../../utils/formatDateTime';
import FormatDateToISO from '../../utils/formatDateToIso';
import LineChartComponent from '../../components/lineChart';
import moment from 'moment';
import IncomeItem from '../../components/incomeItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DataPrediksi = () => {
  const navigation = useNavigation();

  const [dropdown, setDropdown] = useState({
    focus: false,
    value: null,
  });
  const [calendar, setCalendar] = useState({
    date: new Date(),
    show: false,
    start: null,
    end: null,
    type: '',
  });
  const [data, setData] = useState({
    loading: false,
    predict: [],
    chart: [],
    shift1: {},
    shift2: {},
    branch: [],
    manager: [],
    local: {},
  });

  useEffect(() => {
    async function fetDataLocal(params) {
      const allBranch = await AsyncStorage.getItem('allBranch');
      const allManager = await AsyncStorage.getItem('allManager');
      const credentials = await AsyncStorage.getItem('credentials');
      const filteredManager = JSON.parse(allManager).filter(
        item => item.id === JSON.parse(credentials).id,
      );
      setData(prev => ({
        ...prev,
        branch: JSON.parse(allBranch),
        local: JSON.parse(credentials),
        manager: filteredManager,
      }));
    }
    fetDataLocal();
  }, []);

  useEffect(() => {
    if (dropdown.value && calendar.start && calendar.end) {
      async function fetchPredictData() {
        setData(prev => ({
          ...prev,
          loading: true,
        }));
        try {
          const query = `branchId=${dropdown.value}&startDate=${FormatDateToISO(FormatDateTime(calendar.start).realDate)}&endDate=${FormatDateToISO(FormatDateTime(calendar.end).realDate)}`;
          const dataPredict = await getDataQuery({
            operation: REPORT_ENDPOINT,
            endpoint: 'predictTransaction',
            resultKey: 'data',
            query: query,
          });
          if (dataPredict) {
            setData(prev => ({
              ...prev,
              predict: dataPredict,
              chart: {
                labels: readableLabels(
                  processData(dataPredict).map(item => item.date),
                ),
                datasets: [
                  {
                    data: processData(dataPredict).map(
                      item => item.transactions,
                    ),
                    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                    strokeWidth: 2,
                  },
                ],
              },
            }));
          }
        } catch (error) {
          console.log(error);
        } finally {
          setData(prev => ({
            ...prev,
            loading: false,
          }));
        }
      }
      fetchPredictData();
    }
  }, [dropdown.value, calendar.start, calendar.end]);

  function handleStartDate(event, selectedDate) {
    if (!selectedDate) {
      setCalendar(prev => ({
        ...prev,
        start: null,
        show: false,
      }));
      return;
    }
    setCalendar(prev => ({
      ...prev,
      start: selectedDate,
      date: selectedDate,
      show: false,
    }));
  }

  function handleEndDate(event, selectedDate) {
    if (!selectedDate) {
      setCalendar(prev => ({
        ...prev,
        end: null,
        show: false,
      }));
      return;
    }
    setCalendar(prev => ({
      ...prev,
      end: selectedDate,
      date: selectedDate,
      show: false,
    }));
  }

  function processData(rawData) {
    const groupedData = rawData.reduce((acc, item) => {
      const date = item.Tanggal;
      acc[date] = acc[date] || {date, transactions: 0};
      acc[date].transaction += item['Jumlah Transaksi'];
      return acc;
    });
    return Object.values(groupedData);
  }

  function readableLabels(dates) {
    const maxLabels = 5;
    const stepSize = Math.ceil(dates.length / maxLabels);
    return dates.map((date, idx) =>
      idx % stepSize === 0 ? moment(date).format('DD MMM') : '',
    );
  }

  function incomeData(data) {
    let dataShift1 = {total: 0, jumlahTransaksi: 0};
    let dataShift2 = {total: 0, jumlahTransaksi: 0};

    data.forEach(item => {
      if (item.Shift === 1) {
        (dataShift1.total += item.Total),
          (dataShift1.jumlahTransaksi += item['Jumlah Transaksi']);
      } else if (item.Shift === 2) {
        (dataShift2.total += item.Total),
          (dataShift2.jumlahTransaksi += item['Jumlah Transaksi']);
      }
    });
    return {dataShift1, dataShift2};
  }

  const listBranch = () => {
    if (data.manager[0]?.role !== 'general_manager') {
      const branchAccess = data.manager[0]?.branchaccess;
      const accessIds = branchAccess?.match(/\d+/g).map(Number);
      const filteredBranches = data.branch.filter(branch =>
        accessIds?.includes(branch.id),
      );
      return filteredBranches;
    }
    return data.branch.sort((a, b) => a.name.localeCompare(b.name));
  };

  function chartData(datas) {
    let labels = [];
    let dataset1 = [];
    let dataset2 = [];
    if (datas) {
      datas.forEach(item => {
        const stringValue = item.Total.toString();
        const formatedValue = `${stringValue.slice(0, 1)}.${stringValue.slice(1, 2)}`;
        const formatDate = FormatDateTime(item['Tanggal']).realDate;
        if (!labels.includes(formatDate)) {
          labels.push(formatDate);
        }
        if (item['Shift'] === 1) {
          dataset1.push(formatedValue);
        } else {
          dataset2.push(formatedValue);
        }
      });
    }
    return {labels, dataset1, dataset2};
  }

  const dataTotalRevenueShift1 = {
    datasets: [{data: chartData(data.predict).dataset1}],
    labels: chartData(data.predict).labels,
  };

  const dataTotalRevenueShift2 = {
    datasets: [{data: chartData(data.predict).dataset2}],
    labels: chartData(data.predict).labels,
  };

  const convertData = data => {
    return data.datasets[0]?.data.map((value, index) => {
      const part = data.labels[index].split(' ');
      const label = part.slice(0, 2).join(' ');
      return {
        value: parseFloat(value), // Convert the string to a float
        dataPointText: value.toString(), // Keep it as a string
        label: label, // Use the shortened date format
      };
      // return data.labels[index];
    });
  };

  const shift1 = convertData(dataTotalRevenueShift1);
  const shift2 = convertData(dataTotalRevenueShift2);
  // console.log('shi1: ', shift1);
  // console.log('data shift1: ', dataTotalRevenueShift1);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.header}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 16}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={25} color="#000" />
          </TouchableOpacity>
          <Text variant="titleMedium" style={{fontSize: 20}}>
            Data Prediksi
          </Text>
        </View>
        <View style={{marginTop: 20, gap: 10}}>
          <Dropdown
            data={listBranch()}
            mode="modal"
            search
            maxHeight={250}
            labelField="name"
            valueField="id"
            value={dropdown.value}
            itemTextStyle={{fontWeight: '700', textTransform: 'uppercase'}}
            placeholder="Pilih cabang"
            placeholderStyle={{fontWeight: '700', fontSize: 18}}
            style={styles.dropdown}
            selectedTextStyle={styles.selectedTextStyle}
            onBlur={() => setDropdown(prev => ({...prev, focus: false}))}
            onFocus={() => setDropdown(prev => ({...prev, focus: true}))}
            onChange={item =>
              setDropdown(prev => ({...prev, value: item.id, focus: false}))
            }
            renderLeftIcon={() => (
              <View style={{marginRight: 10}}>
                <Store width={25} height={25} />
              </View>
            )}
            renderRightIcon={() => (
              <View>
                {dropdown.focus ? (
                  <ArrowRight width={15} height={15} />
                ) : (
                  <ArrowDown width={15} height={15} />
                )}
              </View>
            )}
          />
          <View style={styles.calendarContainer}>
            {calendar.show && (
              <DateTimePicker
                value={
                  calendar.type === 'START_DATE'
                    ? calendar.start || calendar.date
                    : calendar.end || calendar.date
                }
                mode="date"
                onChange={
                  calendar.type === 'START_DATE'
                    ? handleStartDate
                    : handleEndDate
                }
                negativeButton={{label: 'Batal', textColor: Colors.deleteColor}}
                minimumDate={
                  calendar.type === 'END_DATE' ? calendar.start : null
                }
              />
            )}
            <CalendarPicker
              title="Start Date"
              date={
                calendar.start ? FormatDateTime(calendar.start).realDate : null
              }
              onPress={() => {
                setCalendar(prev => ({
                  ...prev,
                  show: true,
                  type: 'START_DATE',
                }));
              }}
            />
            <CalendarPicker
              title="End Date"
              disabled={calendar.start === null}
              date={calendar.end ? FormatDateTime(calendar.end).realDate : null}
              onPress={() => {
                setCalendar(prev => ({
                  ...prev,
                  show: true,
                  type: 'END_DATE',
                }));
              }}
            />
          </View>
        </View>
      </View>

      <ScrollView style={[styles.scrollViewContent, {flexGrow: 1}]}>
        <Text variant="titleLarge">Data Prediksi</Text>
        <View style={{marginVertical: 10}}>
          <IncomeItem
            type={'money'}
            loading={data.loading}
            title={'Sales Predictions'}
            centerName={'Profit'}
            leftName={'Shift 1'}
            rightName={'Shift 2'}
            center={parseInt(
              incomeData(data.predict).dataShift1.total +
                incomeData(data.predict).dataShift2.total,
            )}
            left={incomeData(data.predict).dataShift1.total}
            right={incomeData(data.predict).dataShift2.total}
          />
        </View>
        <View style={{marginVertical: 10}}>
          <IncomeItem
            loading={data.loading}
            title={'Transaction Predictions'}
            centerName={'Total Transacions'}
            leftName={'Shift 1'}
            rightName={'Shift 2'}
            center={parseInt(
              incomeData(data.predict).dataShift1.jumlahTransaksi +
                incomeData(data.predict).dataShift2.jumlahTransaksi,
            )}
            left={incomeData(data.predict).dataShift1.jumlahTransaksi}
            right={incomeData(data.predict).dataShift2.jumlahTransaksi}
          />
        </View>
        <LineChartComponent
          data1={convertData(dataTotalRevenueShift1)}
          data2={convertData(dataTotalRevenueShift2)}
          title="Total Revenue Chart"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataPrediksi;

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    padding: 10,
    paddingTop: 20,
    elevation: 3,
    zIndex: 888,
  },
  dropdown: {
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
  },
  selectedTextStyle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#000',
    textTransform: 'uppercase',
  },
  calendarContainer: {
    flexDirection: 'row',
    columnGap: 15,
    paddingVertical: 10,
  },
  scrollViewContent: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  textHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
