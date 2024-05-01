import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {LoadingIndicator, SearchBox, TopBar} from '../../../components';
import {Colors} from '../../../utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FormatRP from '../../../utils/formatRP';
import Receipt from '../../../assets/icons/receipt.svg';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import getDataQuery from '../../../utils/getDataQuery';
import {TRANSACTION_ENDPOINT} from '@env';
import PostData from '../../../utils/postData';
import FormatDateTime from '../../../utils/formatDateTime';

const History = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState({});

  const allBranch = useSelector(state => state.branch.allBranch);
  const listBranch = allBranch.map(item => ({
    value: item.id,
    label: item.name.toUpperCase(),
  }));
  listBranch.push({
    value: 0,
    label: 'Semua Cabang',
  });

  useEffect(() => {
    async function fetchData(params) {
      setLoading(true);
      try {
        const data = await getDataQuery({
          operation: TRANSACTION_ENDPOINT,
          endpoint: 'showTransactions',
          resultKey: 'transactionData',
          query: `branch=${value}`,
        });
        if (data) {
          setTransaction(data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [value]);

  console.log('transaction backend: ', transaction);

  function sortTransaction(data) {
    const sortedData = data.sort((a, b) => {
      if (a.status === b.status) {
        return 0;
      } else if (a.status > b.status) {
        return -1;
      } else {
        return 1;
      }
    });
    return sortedData;
  }

  async function handleDelete(id) {
    try {
      setLoading(true);
      const action = await PostData({
        operation: TRANSACTION_ENDPOINT,
        endpoint: 'deleteTransaction',
        payload: {id: id},
      });
      if (action) {
        ToastAndroid.show(
          'Delete Transaction Successfully!',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      ToastAndroid.show('Error deleting transaction', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 16}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={25} color="black" />
          </TouchableOpacity>
          <Text variant="titleMedium" style={{fontSize: 20}}>
            Riwayat Transaksi
          </Text>
        </View>
        <View style={{marginTop: 10}}>
          <Dropdown
            mode="modal"
            style={[styles.dropdown, isFocus && {borderColor: Colors.btnColor}]}
            placeholderStyle={{fontSize: 16}}
            selectedTextStyle={{
              fontSize: 18,
              fontWeight: '600',
              color: Colors.btnColor,
            }}
            inputSearchStyle={{height: 40, fontSize: 16}}
            data={Object.values(listBranch).sort((a, b) =>
              a.label.localeCompare(b.label),
            )}
            itemTextStyle={{fontWeight: '700'}}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={'Pilih Cabang'}
            searchPlaceholder="Search ..."
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
                  <Icon name="storefront" size={30} color={Colors.btnColor} />
                </View>
              );
            }}
          />
        </View>
      </View>
      <View style={{backgroundColor: 'rgba(0,0,0,0.0001)', flex: 1}}>
        {value !== null && transaction.length > 0 ? (
          <FlatList
            data={sortTransaction(
              transaction.filter(item => item.status === 0),
            )}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => {
              function getTime(transactionDate) {
                const splitDateTime = transactionDate.split('T');
                const date = splitDateTime[0];
                const time = splitDateTime[1].split('.')[0];
                return time;
              }
              return (
                <View>
                  <View style={[styles.icon, {flexDirection: 'row'}]}>
                    <Ionicons name="receipt-outline" size={40} />
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Detail History', {data: item})
                      }
                      onLongPress={() =>
                        Alert.alert('Actions', 'Hapus transaksi ?', [
                          {text: 'Batal'},
                          {text: 'OK', onPress: () => handleDelete(item.id)},
                        ])
                      }
                      style={{
                        paddingLeft: 15,
                        flex: 1,
                        justifyContent: 'center',
                        rowGap: 5,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          variant="titleMedium"
                          style={{fontWeight: '600', color: 'grey'}}>
                          {item.paymentmethod === '0' ? 'Cash' : 'Transfer'}
                        </Text>
                        <Text
                          variant="titleMedium"
                          style={{color: 'green', fontWeight: '700'}}>
                          {FormatRP(item.totalprice)}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text variant="titleMedium" style={{fontWeight: '700'}}>
                          {item.transactiondate}
                        </Text>
                        <Text variant="titleMedium" style={{color: 'grey'}}>
                          {FormatDateTime(item.transactiondate).realTime}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Receipt width={200} height={200} />
            <Text variant="headlineMedium" style={{fontWeight: '700'}}>
              Transaction not found
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.backgroundColor,
  },
  whiteLayer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    elevation: 1,
    padding: 10,
  },
  wrapSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 8,
  },
  icon: {
    marginVertical: 5,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.3,
    marginHorizontal: 15,
    // backgroundColor: 'red',
    paddingVertical: 15,
  },
  status: {
    fontWeight: '700',
    fontSize: 16,
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingVertical: 20,
    elevation: 5,
    zIndex: 888,
  },
});
