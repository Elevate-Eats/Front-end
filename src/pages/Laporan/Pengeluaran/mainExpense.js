import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import {Colors} from '../../../utils/colors';
import Store from '../../../assets/icons/store-bulk.svg';
import StoreFront from '../../../assets/icons/store.svg';
import {EXPENSE_ENDPOINT} from '@env';
import FormatDateTime from '../../../utils/formatDateTime';
import Pencil from '../../../assets/icons/edit-bulk.svg';
import Calendar from '../../../assets/icons/calendar-bulk.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import {BtnAdd, LoadingIndicator} from '../../../components';
import FormatDateToISO from '../../../utils/formatDateToIso';
import Expense from '../../../assets/icons/cash-out.svg';
import FormatRP from '../../../utils/formatRP';
import {GetQueryAPI, PostAPI} from '../../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainExpense = () => {
  const navigation = useNavigation();
  const [calendar, setCalendar] = useState({
    date: new Date(),
    showDate: false,
  });

  const [dropdown, setDropdown] = useState({
    focus: false,
    value: null,
  });

  const [data, setData] = useState({
    expense: {},
    loading: false,
    branch: [],
    error: '',
    local: {},
    manager: [],
  });
  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        setData(prev => ({...prev, loading: true}));
        try {
          const formatedDate = FormatDateToISO(
            FormatDateTime(calendar.date).realDate,
          );
          const response = await GetQueryAPI({
            operation: EXPENSE_ENDPOINT,
            endpoint: 'showExpenses',
            query: `branchId=${dropdown.value}&date=${formatedDate}`,
          });
          if (response.status === 200) {
            setData(prev => ({...prev, expense: response.data.expenses}));
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message;
          setData(prev => ({...prev, error: errorMessage, expense: []}));
        } finally {
          setData(prev => ({...prev, loading: false}));
        }
      }
      fetchData();
    }, [dropdown.value, calendar.date]),
  );

  useEffect(() => {
    async function fetchLocalStorage(params) {
      const response = await AsyncStorage.getItem('credentials');
      const branch = await AsyncStorage.getItem('allBranch');
      const manager = await AsyncStorage.getItem('allManager');
      const filteredManager = JSON.parse(manager).filter(
        item => item.id === JSON.parse(response).id,
      );
      const parsed = JSON.parse(response);
      setData({
        ...data,
        local: parsed,
        branch: JSON.parse(branch),
        manager: filteredManager,
      });
    }
    fetchLocalStorage();
  }, []);

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

  async function handleDeleteExpense(item) {
    setData(prev => ({...prev, loading: true}));
    try {
      const response = await PostAPI({
        operation: EXPENSE_ENDPOINT,
        endpoint: 'deleteExpense',
        payload: {id: item.id},
      });
      if (response.status === 200) {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        setData(prev => ({
          ...prev,
          expense: prev.expense.filter(element => element.id !== item.id),
        }));
      }
    } catch (error) {
      ToastAndroid.show('Failed to delete expense', ToastAndroid.SHORT);
    } finally {
      setData(prev => ({...prev, loading: false}));
    }
  }
  function handleDate(event, value) {
    setCalendar(prev => ({...prev, date: value, showDate: false}));
  }

  if (data.loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.header}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 16}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={25} color="black" />
          </TouchableOpacity>
          <Text variant="titleMedium" style={{fontSize: 20}}>
            Catatan Pengeluaran
          </Text>
        </View>
        <View style={{marginTop: 20, marginBottom: 10}}>
          <Dropdown
            mode="modal"
            data={listBranch()}
            selectedTextStyle={{
              fontWeight: '700',
              color: Colors.btnColor,
              fontSize: 18,
              textTransform: 'uppercase',
            }}
            style={[styles.dropdown, dropdown.focus]}
            placeholderStyle={{
              fontSize: 18,
              fontWeight: '700',
              color: Colors.btnColor,
              textTransform: 'uppercase',
            }}
            inputSearchStyle={{height: 40, fontSize: 16}}
            placeholder="Pilih Cabang"
            itemTextStyle={{fontWeight: '700', textTransform: 'uppercase'}}
            search
            searchPlaceholder="Search ..."
            maxHeight={300}
            labelField={'name'}
            valueField={'id'}
            value={dropdown.value}
            onFocus={() => setDropdown(prev => ({...prev, focus: true}))}
            onBlur={() => setDropdown(prev => ({...prev, focus: false}))}
            onChange={item => {
              setDropdown(prev => ({...prev, value: item.id, focus: false}));
            }}
            renderLeftIcon={() => {
              return (
                <View style={{marginRight: 20}}>
                  <Store width={25} height={25} />
                </View>
              );
            }}
          />
        </View>
        <Pressable
          style={[styles.calendar]}
          onPress={() => setCalendar(prev => ({...prev, showDate: true}))}>
          <Calendar width={25} height={25} />
          <Text variant="titleMedium" style={{flex: 1, marginHorizontal: 10}}>
            {FormatDateTime(calendar.date.toISOString()).realDate}
          </Text>
          <Pencil width={20} height={20} />
        </Pressable>
        {calendar.showDate && (
          <DateTimePicker
            value={calendar.date}
            mode="date"
            onChange={handleDate}
            negativeButton={{label: 'Batal', textColor: Colors.deleteColor}}
            maximumDate={new Date()}
          />
        )}
      </View>
      {dropdown.value !== null ? (
        data.expense.length !== 0 ? (
          <View
            style={{
              flex: 1,
              paddingVertical: 15,
              paddingHorizontal: 10,
            }}>
            <Text variant="headlineSmall" style={{marginHorizontal: 7}}>
              Pengeluaran
            </Text>
            <FlatList
              data={data.expense}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                // console.log('item: ', item);
                return (
                  <View style={styles.itemExpense}>
                    <Expense width={50} height={50} />
                    <TouchableOpacity
                      style={styles.touchExpense}
                      onPress={() =>
                        navigation.navigate('Edit Pengeluaran', {data: item})
                      }
                      onLongPress={() => {
                        Alert.alert(
                          'Actions',
                          'Hapus catatan pengeluaran? ',
                          [
                            {text: 'Batal', style: 'cancel'},
                            {
                              text: 'OK',
                              onPress: () => handleDeleteExpense(item),
                            },
                          ],
                          {cancelable: true},
                        );
                      }}>
                      <View style={{flex: 1}}>
                        <Text variant="titleMedium">{item.name}</Text>
                        <Text variant="titleMedium">{item.category}</Text>
                      </View>
                      <Text
                        variant="titleMedium"
                        style={{color: Colors.deleteColor, fontWeight: '700'}}>
                        {FormatRP(item.total)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
            <View style={{position: 'absolute', right: 0, bottom: 0}}>
              <BtnAdd
                onPress={() =>
                  navigation.navigate('Tambah Pengeluaran', {
                    date: calendar.date.toISOString(),
                    branchId: dropdown.value,
                  })
                }
              />
            </View>
          </View>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontStyle: 'italic',
                color: Colors.btnColor,
              }}>
              {data.error}
            </Text>
            <View style={{position: 'absolute', right: 0, bottom: 0}}>
              <BtnAdd
                onPress={() =>
                  navigation.navigate('Tambah Pengeluaran', {
                    date: calendar.date.toISOString(),
                    branchId: dropdown.value,
                  })
                }
              />
            </View>
          </View>
        )
      ) : (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <StoreFront width={250} height={250} />
          <Text
            style={{
              fontSize: 20,
              fontStyle: 'italic',
              color: Colors.btnColor,
            }}>
            Silakan pilih cabang terlebih dahulu
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MainExpense;

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingVertical: 20,
    elevation: 5,
    zIndex: 888,
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 8,
  },
  calendar: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  touchExpense: {
    paddingLeft: 10,
    paddingRight: 5,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemExpense: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
});
