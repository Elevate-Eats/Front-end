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
import {selectBranch} from '../../../redux/branchSlice';
import transactionSlice from '../../../redux/transactionSlice';
import {addItemsInfo, addPcsInfo} from '../../../redux/pcsSlice';
import {deleteTransaction} from '../../../redux/showTransaction';
import {addItem, saveItem} from '../../../redux/cartSlice';

const PendingTransaction = ({navigation}) => {
  const dispatch = useDispatch();
  const allTransaction = useSelector(
    state => state.showTransaction.allTransaction,
  );
  const branch = useSelector(s => s.branch.selectedBranch);
  const menuCompany = useSelector(state => state.menu.allMenu);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredTransaction = allTransaction.filter(
    item => item.branchid === branch.id,
  );

  if (filteredTransaction.length > 0) {
    console.log('filtered:', filteredTransaction);
    filteredTransaction.map(async item => {
      let transactionId = item.id;
      console.log('id: ', transactionId);
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
  } else {
    console.log('Filtered none');
  }

  async function handleDelete(params) {
    console.log('param: ', params);
    try {
      setLoading(true);
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
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingIndicator />;
  }
  const pendingMenu = Object.values(filteredTransaction).filter(
    item => item.status === 1,
  );
  console.log('pendingMenu: ', pendingMenu);
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
                            });
                          }}>
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
