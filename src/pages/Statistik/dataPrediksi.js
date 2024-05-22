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
import {useSelector} from 'react-redux';
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
import BarChartComponent from '../../components/barChart';

const DataPrediksi = () => {
  const navigation = useNavigation();
  const {allBranch} = useSelector(state => state.branch);
  const listBranch = allBranch.map(item => ({
    label: item.name,
    value: item.id,
  }));

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
  });

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
            const dataDummy = [
              {
                DayType: 'Weekend',
                Days: 6,
                Holiday: false,
                'Jumlah Transaksi': 23,
                Months: 5,
                Prev_Week_Transactions: 145,
                Ramadhan: false,
                Shift: 1,
                Tanggal: '2023-05-21',
                Total: 4664616,
                Weekend: true,
              },
              {
                DayType: 'Non-Holiday+Non-Weekend',
                Days: 0,
                Holiday: false,
                'Jumlah Transaksi': 16,
                Months: 5,
                Prev_Week_Transactions: 144,
                Ramadhan: false,
                Shift: 1,
                Tanggal: '2023-05-22',
                Total: 2839186,
                Weekend: false,
              },
              {
                DayType: 'Weekend',
                Days: 6,
                Holiday: false,
                'Jumlah Transaksi': 28,
                Months: 5,
                Prev_Week_Transactions: 195,
                Ramadhan: false,
                Shift: 2,
                Tanggal: '2023-05-21',
                Total: 4078994,
                Weekend: true,
              },
              {
                DayType: 'Non-Holiday+Non-Weekend',
                Days: 0,
                Holiday: false,
                'Jumlah Transaksi': 19,
                Months: 5,
                Prev_Week_Transactions: 185,
                Ramadhan: false,
                Shift: 2,
                Tanggal: '2023-05-22',
                Total: 2888092,
                Weekend: false,
              },
            ];
            setData(prev => ({
              ...prev,
              predict: dataPredict,
              chart: {
                labels: readableLabels(
                  processData(dataDummy).map(item => item.date),
                ),
                datasets: [
                  {
                    data: processData(dataDummy).map(item => item.transactions),
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

  // console.log('data: ', data.chart);

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

  // console.log('income shift1: ', incomeData(data.predict).dataShift1);
  // console.log('income shift2: ', incomeData(data.predict).dataShift2);

  const chartConfig = {
    paddingLeft: '0px',
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '1',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  function chartData(datas) {
    let labels = [];
    let dataset1 = [];
    let dataset2 = [];
    if (datas) {
      datas.forEach(item => {
        const formatDate = FormatDateTime(item['Tanggal']).realDate;
        if (!labels.includes(formatDate)) {
          labels.push(formatDate);
        }
        if (item['Shift'] === 1) {
          dataset1.push(item.Total);
        } else {
          dataset2.push(item.Total);
        }
      });
      // return FormatDateTime(datas[0]['Tanggal']).realDate;
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

  console.log('rev: ', dataTotalRevenueShift1.datasets[0].data.length);

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
            data={listBranch.sort((a, b) => a.label.localeCompare(b.label))}
            mode="modal"
            search
            maxHeight={250}
            labelField="label"
            valueField="value"
            value={dropdown.value}
            placeholder="Pilih cabang"
            placeholderStyle={{fontWeight: '500', fontSize: 18}}
            style={styles.dropdown}
            selectedTextStyle={styles.selectedTextStyle}
            onBlur={() => setDropdown(prev => ({...prev, focus: false}))}
            onFocus={() => setDropdown(prev => ({...prev, focus: true}))}
            onChange={item =>
              setDropdown(prev => ({...prev, value: item.value, focus: false}))
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
        <View style={{marginVertical: 10}}>
          <BarChartComponent
            title={'Total Revenue Chart Shift 1'}
            data={dataTotalRevenueShift1}
          />
        </View>
        <View style={{marginVertical: 10}}>
          <BarChartComponent
            title={'Total Revenue Chart Shift 2'}
            data={dataTotalRevenueShift2}
          />
        </View>
        {/* <View style={{flexDirection: 'row', gap: 20, marginTop: 10}}>
          <LineChartComponent
            title={'Line Chart'}
            data={data.chart}
            width={320}
            chartConfig={chartConfig}
          />
        </View> */}
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
});
