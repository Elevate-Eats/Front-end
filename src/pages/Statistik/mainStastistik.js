import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {LoadingIndicator, TopBar} from '../../components';
import {useNavigation} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import {useSelector} from 'react-redux';
import {Colors} from '../../utils/colors';
import Store from '../../assets/icons/store-bulk.svg';
import ArrowRight from '../../assets/icons/arrow-right-bulk.svg';
import ArrowDown from '../../assets/icons/arrow-down-bulk.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import Calendar from '../../assets/icons/calendar-bulk.svg';
import FormatDateToISO from '../../utils/formatDateToIso';
import FormatDateTime from '../../utils/formatDateTime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarPicker from '../../components/calendar';
import SalesItem from '../../components/salesItem';
import IncomeItem from '../../components/incomeItem';
import FormatRP from '../../utils/formatRP';
import getDataQuery from '../../utils/getDataQuery';
import {ANALYTICS_ENDPOINT} from '@env';

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

  const listBranch = allBranch.map(item => ({
    label: item.name,
    value: item.id,
  }));

  useEffect(() => {
    async function fetchCompanyId() {
      const id = await AsyncStorage.getItem('companyId');
      setCompanyId(id);
    }
    fetchCompanyId();
  }, []);

  useEffect(() => {
    if ((value, startDate, endDate)) {
      async function fetchAnalyticsData(params) {
        try {
          setLoading(true);
          const data = await getDataQuery({
            operation: ANALYTICS_ENDPOINT,
            endpoint: 'showAdvancedSummary',
            resultKey: 'data',
            query: `companyId=${companyId}&branchId=${value}&startDate=${FormatDateToISO(FormatDateTime(startDate).realDate)}&endDate=${FormatDateToISO(FormatDateTime(endDate).realDate)}`,
          });
          setSummary(data);
        } catch (error) {
          console.log('error: ', error);
        } finally {
          setLoading(false);
        }
      }
      fetchAnalyticsData();
    }
  }, [startDate, endDate, value]);
  function handleStartDate(event, value) {
    if (!value) {
      setStartDate(null);
      setShowDate(false);
      return;
    }
    const currentDate = value || startDate;
    setStartDate(currentDate);
    setDate(currentDate);
    setShowDate(false);
  }
  function handleEndDate(event, value) {
    if (!value) {
      setEndDate(null);
      setShowDate(false);
      return;
    }
    const currentDate = value || endDate;
    setEndDate(currentDate);
    setDate(currentDate);
    setShowDate(false);
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
      <TopBar title={'Statistik'} navigation={navigation} />
      <ScrollView contentContainerStyle={[styles.whiteLayer]}>
        <Dropdown
          mode="modal"
          data={listBranch.sort((a, b) =>
            a.label.toUpperCase().localeCompare(b.label.toUpperCase),
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
        <View style={[styles.calendarContainer]}>
          <CalendarPicker
            title="Start Date"
            date={startDate ? FormatDateTime(startDate).realDate : null}
            onPress={() => {
              setShowDate(true);
              setType('START_DATE');
            }}
          />
          <CalendarPicker
            disabled={startDate === null ? true : false}
            title="End Date"
            date={endDate ? FormatDateTime(endDate).realDate : null}
            onPress={() => {
              setShowDate(true);
              setType('END_DATE');
            }}
          />
          {showDate === true && (
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
            total={summary[0].sumtransactions}
            loading={loading}
          />
          <SalesItem
            title="Item"
            total={summary[0].sumitemssold}
            loading={loading}
          />
        </View>
        <View style={{marginVertical: 20}}>
          <IncomeItem
            title="Sales Information"
            profit={parseInt(summary[0].sumtotalsales - 120000)}
            income={parseInt(summary[0].sumtotalsales)}
            expense={parseInt(120000)}
            loading={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainStatistik;

const styles = StyleSheet.create({
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
    padding: 10,
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
