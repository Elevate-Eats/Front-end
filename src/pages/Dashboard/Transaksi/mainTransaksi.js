import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback, useState} from 'react';
import {
  BottomSheet,
  ConstButton,
  ListTransaction,
  LoadingIndicator,
  SearchBox,
} from '../../../components';
import {Colors} from '../../../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import GetData from '../../../utils/getData';
import {MENU_COMPANY_ENDPOINT} from '@env';

const MainTransaksi = ({navigation, route}) => {
  const items = route.params;
  const [status, setStatus] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menu, setMenu] = useState({});

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        setLoading(true);
        try {
          const data = await GetData({
            operation: MENU_COMPANY_ENDPOINT,
            endpoint: 'showMenus',
            resultKey: 'menuData',
          });
          setMenu(data);
        } catch (error) {
          setError('Menu Not Found !');
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, []),
  );

  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.whiteLayer}>
        {/* ////////////////// */}
        <View style={styles.wrapSearch}>
          <View style={{flex: 1}}>
            <SearchBox
              search="Cari produk ..."
              value={query}
              onChangeText={text => setQuery(text)}
            />
          </View>
          <TouchableOpacity style={styles.receipt}>
            <Ionicons name="options" size={28} />
          </TouchableOpacity>
        </View>
        {/* ///////////////// */}

        <View style={{flex: 1, marginVertical: 10}}>
          <ListTransaction
            data={menu}
            onPress={item => navigation.navigate('Detail Transaksi', {item})}
          />
        </View>
        <ConstButton onPress={() => setStatus(true)} title="Checkout" />
      </View>
      {status && <BottomSheet condition={setStatus} items={items} />}
    </View>
  );
};
export default MainTransaksi;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
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
  receipt: {
    backgroundColor: '#e8e8e8',
    padding: 14,
    borderRadius: 5,
  },
});
