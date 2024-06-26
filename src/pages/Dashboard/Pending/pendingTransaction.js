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
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {TRANSACTION_ENDPOINT, ITEM_ENDPOINT} from '@env';
import getDataQuery from '../../../utils/getDataQuery';
import {Colors} from '../../../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LoadingIndicator, SearchBox} from '../../../components';
import FormatRP from '../../../utils/formatRP';
import Receipt from '../../../assets/icons/receipt.svg';
import {deleteTransaction} from '../../../redux/showTransaction';
import {GetQueryAPI, PostAPI} from '../../../api';
import {saveItem} from '../../../redux/cartSlice';
import FormatDateToISO from '../../../utils/formatDateToIso';
import FormatDateTime from '../../../utils/formatDateTime';

const PendingTransaction = ({navigation}) => {
  const dispatch = useDispatch();
  const branch = useSelector(state => state.branch.selectedBranch);
  const menuCompany = useSelector(state => state.menu.allMenu);
  const [query, setQuery] = useState('');

  const [data, setData] = useState({
    transaction: [],
    loading: false,
    query: '',
    error: null,
  });

  async function fetchData(params) {
    setData(prev => ({...prev, loading: true}));
    try {
      const response = await GetQueryAPI({
        operation: TRANSACTION_ENDPOINT,
        endpoint: 'showTransactions',
        query: `branch=${branch.id}&limit=50&status=1`,
      });
      if (response.data) {
        setData(prev => ({...prev, transaction: response.data.transactions}));
      }
    } catch (error) {
      setData(prev => ({
        ...prev,
        transaction: [],
        error: 'Transaction not found',
      }));
      console.log('error pending: ', error);
    } finally {
      setData(prev => ({...prev, loading: false}));
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [branch?.id]),
  );

  async function handleDelete(item) {
    try {
      setData(prev => ({...prev, loading: true}));
      const response = await PostAPI({
        operation: TRANSACTION_ENDPOINT,
        endpoint: 'deleteTransaction',
        payload: {id: item.id},
      });
      if (response.status === 200) {
        dispatch(deleteTransaction(item.id));
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        setData(prev => ({
          ...prev,
          transaction: prev.transaction.filter(
            element => element.id !== item.id,
          ),
        }));
      }
    } catch (error) {
      ToastAndroid.show(`Failed to delete transaction`, ToastAndroid.SHORT);
    } finally {
      setData(prev => ({...prev, loading: false}));
    }
  }

  if (data.loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.whiteLayer}>
        <View style={styles.wrapSearch}>
          <View style={{flex: 1}}>
            <SearchBox
              search="Cari transaksi ..."
              value={query}
              onChangeText={text => setQuery(text)}
            />
          </View>
        </View>
        {data.transaction.length !== 0 ? (
          <FlatList
            data={data.transaction}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => {
              return (
                <View>
                  <View style={styles.item}>
                    <View style={{marginLeft: 0}}>
                      <Ionicons name="receipt-outline" size={40} />
                    </View>
                    <View style={{marginHorizontal: 15, flex: 1}}>
                      <TouchableOpacity
                        onLongPress={() => {
                          Alert.alert('Actions', 'Hapus transaksi ? ', [
                            {text: 'Batal'},
                            {
                              text: 'OK',
                              onPress: () => handleDelete(item),
                            },
                          ]);
                        }}
                        style={{rowGap: 3}}
                        onPress={() => {
                          navigation.navigate('Transaksi', {
                            name: item.customername,
                            id: item.id,
                            table: item.tablenumber,
                          });
                          // console.log('item: ', item.id);
                        }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text variant="titleMedium" style={{fontSize: 18}}>
                            {`${item.customername}`}
                          </Text>
                          <Text
                            variant="titleMedium"
                            style={{fontSize: 14, fontWeight: '900'}}>
                            {`${FormatDateTime(item.transactiondate).realDate}`}
                          </Text>
                        </View>
                        <Text
                          variant="titleMedium"
                          style={{
                            color:
                              item.status === 1 ? Colors.deleteColor : 'green',
                            fontWeight: '700',
                          }}>
                          {item.status === 1 ? 'Pending' : 'Selesai'}
                        </Text>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text variant="titleSmall" style={{color: 'black'}}>
                            {`${FormatDateTime(item.transactiondate).realTime.slice(0, 5)}`}
                          </Text>
                          <Text variant="titleMedium">
                            {item.totalprice
                              ? FormatRP(item.totalprice)
                              : 'Rp. 0'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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

export default PendingTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  whiteLayer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    elevation: 1,
    padding: 10,
  },

  item: {
    alignItems: 'center',
    flexDirection: 'row',
    // paddingBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 0.75,
    borderBottomColor: 'rgba(0,0,0,0.2)',
    // marginBottom: 10,
  },
  wrapSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
});
