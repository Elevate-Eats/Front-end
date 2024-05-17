import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
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
import {useSelector} from 'react-redux';
import {Colors} from '../../../utils/colors';
import Store from '../../../assets/icons/store-bulk.svg';
import StoreFront from '../../../assets/icons/store.svg';
import getDataQuery from '../../../utils/getDataQuery';
import {EXPENSE_ENDPOINT} from '@env';
import FormatDateTime from '../../../utils/formatDateTime';
import Pencil from '../../../assets/icons/edit-bulk.svg';
import Calendar from '../../../assets/icons/calendar-bulk.svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import {BtnAdd, LoadingIndicator} from '../../../components';
import FormatDateToISO from '../../../utils/formatDateToIso';
import Expense from '../../../assets/icons/cash-out.svg';
import FormatRP from '../../../utils/formatRP';
import PostData from '../../../utils/postData';

const MainExpense = () => {
  const navigation = useNavigation();
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const [expense, setExpense] = useState({});
  const [showDate, setShowDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const allBranch = useSelector(state => state.branch.allBranch);
  const listBranch = allBranch.map(item => ({
    value: item.id,
    label: item.name,
  }));

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        try {
          setLoading(true);
          const formatedDate = FormatDateToISO(FormatDateTime(date).realDate);
          const data = await getDataQuery({
            operation: EXPENSE_ENDPOINT,
            endpoint: 'showExpenses',
            resultKey: 'expenses',
            query: `branchId=${value}&date=${formatedDate}`,
          });
          if (data) {
            setExpense(data);
          }
        } catch (error) {
          setExpense([]);
          console.log('error: ', error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [value, date]),
  );

  async function handleDeleteExpense(id) {
    try {
      setLoading(true);
      const action = await PostData({
        operation: EXPENSE_ENDPOINT,
        endpoint: 'deleteExpense',
        payload: {id: id},
      });
      if (action) {
        setExpense(expense.filter(item => item.id !== id));
        ToastAndroid.show(action.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Expense Failed to Deleted', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }
  function handleDate(event, value) {
    setDate(value);
    setShowDate(false);
  }

  if (loading) {
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
            data={Object.values(listBranch).sort((a, b) =>
              a.label.localeCompare(b.label),
            )}
            selectedTextStyle={{
              fontWeight: '700',
              color: Colors.btnColor,
              fontSize: 18,
            }}
            style={[styles.dropdown, isFocus]}
            placeholderStyle={{
              fontSize: 18,
              fontWeight: '700',
              color: Colors.btnColor,
            }}
            inputSearchStyle={{height: 40, fontSize: 16}}
            placeholder="Pilih Cabang"
            itemTextStyle={{fontWeight: '700'}}
            search
            searchPlaceholder="Search ..."
            maxHeight={300}
            labelField={'label'}
            valueField={'value'}
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue(item.value);
              setIsFocus(false);
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
        <Pressable style={[styles.calendar]} onPress={() => setShowDate(true)}>
          <Calendar width={25} height={25} />
          <Text variant="titleMedium" style={{flex: 1, marginHorizontal: 10}}>
            {FormatDateTime(date.toISOString()).realDate}
          </Text>
          <Pencil width={20} height={20} />
        </Pressable>
        {showDate && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={handleDate}
            negativeButton={{label: 'Batal', textColor: Colors.deleteColor}}
            maximumDate={new Date()}
          />
        )}
      </View>
      {value !== null ? (
        expense.length !== 0 ? (
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
              data={expense}
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
                              onPress: () => handleDeleteExpense(item.id),
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
                    date: date.toISOString(),
                    branchId: value,
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
              Data pengeluaran tidak tersedia
            </Text>
            <View style={{position: 'absolute', right: 0, bottom: 0}}>
              <BtnAdd
                onPress={() =>
                  navigation.navigate('Tambah Pengeluaran', {
                    date: date.toISOString(),
                    branchId: value,
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
