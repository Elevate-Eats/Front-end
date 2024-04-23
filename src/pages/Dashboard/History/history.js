import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {SearchBox} from '../../../components';
import {Colors} from '../../../utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import FormatRP from '../../../utils/formatRP';
import Receipt from '../../../assets/icons/receipt.svg';

const History = () => {
  const [query, setQuery] = useState('');
  const allTransaction = useSelector(
    state => state.showTransaction.allTransaction,
  );
  const transactionID = useSelector(state => state.transaction.transactionId);
  const branch = useSelector(state => state.branch.selectedBranch);
  const filteredTransaction = allTransaction.filter(
    item => item.branchid === branch.id && item.status === 0,
  );

  console.log('filtered: ', filteredTransaction);

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

        {filteredTransaction.length > 0 ? (
          <View style={{flex: 1, marginTop: 10, marginBottom: 5}}>
            <FlatList
              data={filteredTransaction}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                return (
                  <View style={styles.item}>
                    <View style={{marginLeft: 5}}>
                      <Icon name="receipt-outline" size={40} />
                    </View>
                    <View style={{marginHorizontal: 15, flex: 1}}>
                      <TouchableOpacity
                        onLongPress={() => console.log('Long Press')}
                        onPress={() => console.log('onPress')}>
                        <Text variant="titleMedium" style={{fontSize: 18}}>
                          {item.customername}
                        </Text>
                        <View>
                          <Text
                            variant="titleMedium"
                            style={{
                              color: 'green',
                              fontWeight: '700',
                            }}>
                            Success
                          </Text>
                        </View>
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
                              : FormatRP(0)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Receipt width={200} height={200} />
            <Text variant="titleMedium">Tidak Ada Transaksi</Text>
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
  wrapSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 0.75,
    borderBottomColor: 'rgba(0,0,0,0.2)',
    marginBottom: 10,
  },
});
