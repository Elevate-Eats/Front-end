import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  BtnAdd,
  DataError,
  ListMenu,
  LoadingIndicator,
  SearchBox,
} from '../../../components';
import Empty from '../../../assets/icons/empty-menu.svg';
import {Colors} from '../../../utils/colors';
import {useFocusEffect} from '@react-navigation/native';
import GetData from '../../../utils/getData';
import {MENU_COMPANY_ENDPOINT} from '@env';

const PilihMenu = ({navigation}) => {
  const dispatch = useDispatch();
  // const menuCompany = useSelector(state => state.menu.allMenu);
  const [menuCompany, setMenuCompany] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        try {
          setLoading(true);
          const action = await GetData({
            operation: MENU_COMPANY_ENDPOINT,
            endpoint: 'showMenus',
            resultKey: 'menuData',
          });
          setMenuCompany(action);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, []),
  );

  // useEffect(() => {
  //   if (!menuCompany) {
  //     setError('Menu not Found');
  //   }
  // });

  const menu = Object.values(menuCompany).sort((a, b) => {
    a.name.localeCompare(b.name);
  });
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.whiteLayer}>
        <View style={styles.wrapSearch}>
          <View style={{flex: 1}}>
            <SearchBox
              search="Cari produk ..."
              value={query}
              onChangeText={text => setQuery(text)}
            />
          </View>
        </View>
        <View style={{flex: 1, marginVertical: 10}}>
          {error ? (
            <View style={styles.dataError}>
              <Empty width={200} height={200} />
              <DataError data={error} />
            </View>
          ) : (
            <ListMenu
              data={menu}
              onPress={item => navigation.navigate('Edit Menu', {item})}
            />
          )}
        </View>
      </View>
      <BtnAdd onPress={() => navigation.navigate('Tambah Menu')} />
    </SafeAreaView>
  );
};

export default PilihMenu;

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
    padding: 15,
  },
  wrapSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  dataError: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 20,
  },
});
