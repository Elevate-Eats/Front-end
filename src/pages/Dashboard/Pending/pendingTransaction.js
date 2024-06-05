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
import PostData from '../../../utils/postData';
import {TRANSACTION_ENDPOINT, ITEM_ENDPOINT} from '@env';
import getDataQuery from '../../../utils/getDataQuery';
import {Colors} from '../../../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {LoadingIndicator, SearchBox} from '../../../components';
import FormatRP from '../../../utils/formatRP';
import Receipt from '../../../assets/icons/receipt.svg';
import {deleteTransaction} from '../../../redux/showTransaction';
import {addItem, saveItem} from '../../../redux/cartSlice';

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
      console.log('branchId: ', branch.id);
      const response = await getDataQuery({
        operation: TRANSACTION_ENDPOINT,
        endpoint: 'showTransactions',
        resultKey: 'transactions',
        query: `branch=${branch.id}&limit=50`,
      });
      if (response) {
        setData(prev => ({...prev, transaction: response}));
      }
    } catch (error) {
      setData(prev => ({
        ...prev,
        transaction: [],
        error: 'Transaction not found',
      }));
    } finally {
      setData(prev => ({...prev, loading: false}));
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [branch?.id]),
  );

  const pendingMenu = Object.values(data.transaction).filter(
    item => item.status === 1,
  );
  if (pendingMenu.length > 0) {
    pendingMenu.map(async item => {
      try {
        const data = await getDataQuery({
          operation: ITEM_ENDPOINT,
          endpoint: 'showItems',
          resultKey: 'itemData',
          query: `transactionId=${item.id}`,
        });
        if (data) {
          function getName(params) {
            return data.map(item => {
              const menu = menuCompany.find(menu => menu.id === item.menuid);
              return menu
                ? {...item, name: menu.name}
                : {...item, name: 'Unknown'};
            });
          }
          const newData = getName(data);
          dispatch(saveItem(newData));
        }
      } catch (error) {}
    });
  }

  async function handleDelete(params) {
    try {
      setData(prev => ({...prev, loading: true}));
      const action = await PostData({
        operation: TRANSACTION_ENDPOINT,
        endpoint: 'deleteTransaction',
        payload: {id: params.id},
      });
      if (action) {
        dispatch(deleteTransaction(params.id));
        ToastAndroid.show(`${action.message}`, ToastAndroid.SHORT);
      }
    } catch (error) {
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
        {pendingMenu.length > 0 ? (
          <View style={{flex: 1, marginTop: 10, marginBottom: 5}}>
            <FlatList
              data={pendingMenu}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                return (
                  <View>
                    <View style={styles.item}>
                      <View style={{marginLeft: 5}}>
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
                          // onPress={() => showItems(item)}
                          onPress={() => {
                            navigation.navigate('Transaksi', {
                              name: item.customername,
                              id: item.id,
                              table: item.tablenumber,
                            });
                          }}
                          // onPress={() => console.log('item: ', item)}
                        >
                          <Text variant="titleMedium" style={{fontSize: 18}}>
                            {`${item.customername}`}
                          </Text>
                          <Text
                            variant="titleMedium"
                            style={{
                              color:
                                item.status === 1
                                  ? Colors.deleteColor
                                  : 'green',
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
                            <Text
                              variant="titleSmall"
                              style={{color: 'black', fontWeight: '700'}}>
                              {item.transactiondate}
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
          </View>
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
    paddingBottom: 10,
    borderBottomWidth: 0.75,
    borderBottomColor: 'rgba(0,0,0,0.2)',
    marginBottom: 10,
  },
  wrapSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
});
