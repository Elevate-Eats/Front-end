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
import {removeTransaction} from '../../../redux/cartSlice';
import {deleteTransaction} from '../../../database/deleteTransaction';
import {showTransaction} from '../../../database/showTransaction';

const PendingTransaction = ({navigation}) => {
  const dispatch = useDispatch();
  const branch = useSelector(s => s.branch.selectedBranch);
  const [menu, setMenu] = useState({});
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [trans, setTrans] = useState({});

  async function fetchData(branch, setMenu, setError, setLoading) {
    setLoading(true);
    try {
      const data = await getDataQuery({
        operation: TRANSACTION_ENDPOINT,
        endpoint: 'showTransactions',
        resultKey: 'transactionData',
        query: `branch=${branch.id}`,
      });
      setMenu(data);
    } catch (error) {
      setError('Transaction not Found !');
    } finally {
      setLoading(false);
    }
  }

  console.log('menu transaction: ', menu);
  async function showItems(params) {
    console.log('params: ', params);
    try {
      const data = await getDataQuery({
        operation: ITEM_ENDPOINT,
        endpoint: 'showItems',
        resultKey: 'itemData',
        query: `transactionId=${params.id}`,
      });
      navigation.navigate('Transaksi', {
        item: data,
        name: params.customername,
        id: params.id,
      });
    } catch (error) {}
  }
  useFocusEffect(
    useCallback(() => {
      if (!branch) {
        Alert.alert('Failed', 'Silakan pilih cabang terlebih dahulu', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      }
      fetchData(branch, setMenu, setError, setLoading);
    }, []),
  );

  async function handleDelete(params) {
    try {
      const action = await PostData({
        operation: TRANSACTION_ENDPOINT,
        endpoint: 'deleteTransaction',
        payload: {id: params.id},
      });
      fetchData(branch, setMenu, setError, setLoading);
      await deleteTransaction(params.id);
      dispatch(removeTransaction(params.id));
      ToastAndroid.show(`${action.message}`, ToastAndroid.SHORT);
    } catch (error) {}
  }

  if (loading) {
    return <LoadingIndicator />;
  }
  const pendingMenu = Object.values(menu).filter(item => item.status === 1);
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
                            console.log('long press: ', item.id);
                            Alert.alert('Actions', 'Hapus transaksi? ', [
                              {text: 'Batal'},
                              {
                                text: 'OK',
                                onPress: () => handleDelete(item),
                              },
                            ]);
                          }}
                          style={{rowGap: 3}}
                          onPress={() => showItems(item)}>
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
            <Text>Tidak Ada Transaksi</Text>
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
  icon: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  wrapSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
});
