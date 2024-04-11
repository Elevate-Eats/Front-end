import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import PostData from '../../../utils/postData';
import {TRANSACTION_ENDPOINT} from '@env';
import getDataQuery from '../../../utils/getDataQuery';
import {Colors} from '../../../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SearchBox} from '../../../components';
import {teal100} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const PendingTransaction = () => {
  const branch = useSelector(s => s.branch.selectedBranch);
  const [menu, setMenu] = useState({});
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
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
        }
      }
      fetchData();
    }, []),
  );
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
        {menu ? (
          <View style={{flex: 1, marginTop: 10, marginBottom: 5}}>
            <FlatList
              data={menu}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                return (
                  <View>
                    <View style={styles.item}>
                      <View style={{marginLeft: 5}}>
                        <Ionicons name="receipt-outline" size={40} />
                      </View>
                      <View style={{marginHorizontal: 15, flex: 1}}>
                        <TouchableOpacity style={{rowGap: 3}}>
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
                              {item.totalprice ? item.totalprice : 'Rp. 25.000'}
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
        ) : null}
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
