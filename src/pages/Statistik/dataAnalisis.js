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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Dropdown} from 'react-native-element-dropdown';
import Store from '../../assets/icons/store-bulk.svg';
import ArrowDown from '../../assets/icons/arrow-down-bulk.svg';
import ArrowRight from '../../assets/icons/arrow-right-bulk.svg';
import CalendarPicker from '../../components/calendar';
import FormatDateTime from '../../utils/formatDateTime';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Colors} from '../../utils/colors';
import SalesItem from '../../components/salesItem';
import FormatDateToISO from '../../utils/formatDateToIso';
import getDataQuery from '../../utils/getDataQuery';
import {ANALYTICS_ENDPOINT} from '@env';
import IncomeItem from '../../components/incomeItem';
import BarChartComponent from '../../components/barChart';

const DataAnalisis = () => {
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
    id: null,
    loading: false,
    summary: [],
    hourly: [],
    items: [],
    branch: [],
    menu: [],
  });

  useEffect(() => {
    async function fetchDataLocal(params) {
      const id = await AsyncStorage.getItem('companyId');
      const allBranch = await AsyncStorage.getItem('allBranch');
      const allMenu = await AsyncStorage.getItem('allMenuCompany');
      setData(prev => ({
        ...prev,
        id: id,
        branch: JSON.parse(allBranch),
        menu: JSON.parse(allMenu),
      }));
    }
    fetchDataLocal();
  }, []);

  useEffect(() => {
    if ((dropdown.value, calendar.start, calendar.end)) {
      async function fetchAnalyticsData(params) {
        const startDate = FormatDateToISO(
          FormatDateTime(calendar.start).realDate,
        );
        const endDate = FormatDateToISO(FormatDateTime(calendar.end).realDate);
        const querySummary = `companyId=${data.id}&branchId=${dropdown.value}&startDate=${startDate}&endDate=${endDate}`;
        const queryExpense = `branchId=${dropdown.value}&startDate=${startDate}&endDate=${endDate}`;
        const queryHourly = `companyId=${data.id}&branchId=${dropdown.value}&startDateTime=${startDate}&endDateTime=${endDate}`;

        try {
          setData(prev => ({...prev, loading: true}));
          const dataSummary = await getDataQuery({
            operation: ANALYTICS_ENDPOINT,
            endpoint: 'showAdvancedSummary',
            resultKey: 'data',
            query: querySummary,
          });
          setData(prev => ({
            ...prev,
            summary: dataSummary,
          }));
          // !-------

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
            setData(prev => ({
              ...prev,
              summary: [combinedData],
            }));
          }
          //! ----

          const dataHourly = await getDataQuery({
            operation: ANALYTICS_ENDPOINT,
            endpoint: 'showAdvancedHourlySummary',
            resultKey: 'data',
            query: queryHourly,
          });
          setData(prev => ({
            ...prev,
            hourly: dataHourly,
          }));
          //!----

          const dataItems = await getDataQuery({
            operation: ANALYTICS_ENDPOINT,
            endpoint: 'showAdvancedItemsSummary',
            resultKey: 'data',
            query: querySummary,
          });
          setData(prev => ({
            ...prev,
            items: dataItems,
          }));
        } catch (error) {
          console.log('error: ', error);
        } finally {
          setData(prev => ({...prev, loading: false}));
        }
      }
      fetchAnalyticsData();
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

  function handleEndDate(params, selectedDate) {
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

  function chartData(datas) {
    let labels = [];
    let dataset = [];

    if (datas === 'item') {
      data.items.forEach(item => {
        const menuItem = Object.values(data.menu).find(
          menuItem => menuItem.id === item.menuid,
        );
        if (menuItem) {
          labels.push(menuItem.name);
          dataset.push(parseInt(item.sumitemssold));
        }
      });
    } else {
      data.hourly.forEach(item => {
        const hour = parseInt(item.hour);
        const formatedHour =
          hour === 12 ? `${hour}p` : hour > 12 ? `${hour - 12}p` : `${hour}a`;
        labels.push(formatedHour);
        dataset.push(parseInt(item.sumtransactions));
      });
    }

    return {dataset, labels};
  }

  function fiveMenuItems(dataItems) {
    const combined = dataItems?.datasets[0]?.data
      .map((value, index) => {
        return {
          value: value,
          label: dataItems.labels[index],
        };
      })
      .sort((a, b) => b.value - a.value);

    const topFive = combined.slice(0, 5);
    const sortedData = topFive.map(item => item.value);
    const sortedLabels = topFive.map(item => item.label);
    return {
      datasets: [{data: sortedData}],
      labels: sortedLabels,
    };
  }

  const dataHourly = {
    datasets: [{data: chartData('hour').dataset}],
    labels: chartData('hour').labels,
  };

  const dataItems = {
    datasets: [{data: chartData('item').dataset.slice(0, 10)}],
    labels: chartData('item').labels.slice(0, 10),
  };
  const listBranch = data.branch.map(item => ({
    label: item.name,
    value: item.id,
  }));

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.header}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 16}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={25} color="#000" />
          </TouchableOpacity>
          <Text variant="titleMedium" style={{fontSize: 20}}>
            Data Analisis
          </Text>
        </View>
        <View style={{marginTop: 20, gap: 10}}>
          <Dropdown
            data={listBranch.sort((a, b) => a.label.localeCompare(b.label))}
            mode="modal"
            search
            maxHeight={250}
            labelField={'label'}
            valueField={'value'}
            value={dropdown.value}
            placeholder="Pilih cabang"
            placeholderStyle={{fontWeight: '700', fontSize: 18}}
            style={styles.dropdown}
            selectedTextStyle={styles.selectedTextStyle}
            itemTextStyle={{fontWeight: '700', textTransform: 'uppercase'}}
            onBlur={() => setDropdown(prev => ({...prev, focus: false}))}
            onFocus={() => setDropdown(prev => ({...prev, focus: true}))}
            onChange={item => {
              setDropdown(prev => ({...prev, value: item.value, focus: false}));
            }}
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
        <Text variant="titleLarge">Data Analisis</Text>
        <View style={{flexDirection: 'row', gap: 20, marginTop: 10}}>
          <SalesItem
            title="Transaksi"
            total={
              data.summary.length > 0 ? data.summary[0].sumtransactions : '0'
            }
            loading={data.loading}
          />
          <SalesItem
            title="Item"
            total={data.summary.length > 0 ? data.summary[0].sumitemssold : '0'}
            loading={data.loading}
          />
        </View>
        <View style={{marginVertical: 10}}>
          <IncomeItem
            type={'money'}
            loading={data.loading}
            title={'Sales Information'}
            centerName={'Profit'}
            leftName={'Income'}
            rightName={'Expense'}
            center={
              data.summary.length > 0
                ? parseInt(
                    data.summary[0].sumtotalsales - data.summary[0].sumtotal,
                  )
                : '0'
            }
            left={
              data.summary.length > 0
                ? parseInt(data.summary[0].sumtotalsales)
                : '0'
            }
            right={
              data.summary.length > 0 ? parseInt(data.summary[0].sumtotal) : '0'
            }
          />
        </View>
        <View style={{marginVertical: 10}}>
          <BarChartComponent
            title="Hourly Performance Chart"
            data={dataHourly}
            suffix={' trs'}
          />
          <View style={{marginVertical: 10}}>
            <BarChartComponent
              barSize={0.9}
              suffix={' pcs'}
              title={'Menu Item Sales Chart'}
              data={fiveMenuItems(dataItems)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataAnalisis;

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
