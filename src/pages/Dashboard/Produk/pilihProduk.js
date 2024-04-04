import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback, useState} from 'react';
import {Colors} from '../../../utils/colors';
import {
  BtnAdd,
  DataError,
  ListMenu,
  ListRow,
  LoadingIndicator,
  SearchBox,
} from '../../../components';

import {MENU_COMPANY_ENDPOINT, API_URL} from '@env';
import {useFocusEffect} from '@react-navigation/native';
import GetData from '../../../utils/getData';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';

const PilihProduk = ({navigation}) => {
  const [menu, setMenu] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await GetData({
            operation: MENU_COMPANY_ENDPOINT,
            endpoint: 'showMenus',
            resultKey: 'menuData',
          });
          setMenu(data);
        } catch (error) {
          setError('Menu Not Found');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []),
  );

  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <KeyboardAvoidingView enabled style={styles.container}>
      <View style={styles.whiteLayer}>
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
        <View style={{flex: 1, marginVertical: 10}}>
          {error ? (
            <DataError data={error} />
          ) : (
            <ListMenu
              data={menu}
              onPress={item => navigation.navigate('Edit Produk', {item})}
            />
          )}
        </View>
      </View>
      <BtnAdd onPress={() => navigation.navigate('Tambah Produk')} />
    </KeyboardAvoidingView>
  );
};

export default PilihProduk;

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
  receipt: {
    backgroundColor: '#e8e8e8',
    padding: 14,
    borderRadius: 5,
  },
  wrapSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
});
