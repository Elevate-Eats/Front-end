import {StyleSheet, View, KeyboardAvoidingView} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../../../utils/colors';
import {
  BtnAdd,
  DataError,
  ListMenu,
  SearchBox,
  LoadingIndicator,
} from '../../../components';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {MENU_BRANCH_ENDPOINT, API_URL} from '@env';
import getDataQuery from '../../../utils/getDataQuery';
import Empty from '../../../assets/icons/empty-menu.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GetQueryAPI} from '../../../api';

const PilihProduk = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');

  const [data, setData] = useState({
    menu: [],
    error: null,
    loading: false,
    branch: {},
  });

  const selectBranch = useSelector(state => state.branch.selectedBranch);

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        setData(prev => ({...prev, loading: true}));
        try {
          console.log('select id: ', selectBranch.id);
          const response = await GetQueryAPI({
            operation: MENU_BRANCH_ENDPOINT,
            endpoint: 'showMenus',
            query: `branchid=${selectBranch.id}`,
          });
          if (response.status === 200) {
            setData(prev => ({...prev, menu: response.data.menuData}));
            // console.log('respon: ', response.status);
          }
        } catch (error) {
          const fullMessage = error.response?.data?.message;
          if (fullMessage) {
            setData(prev => ({
              ...prev,
              error: 'No Data Found',
              menu: [],
            }));
          }
          console.log('error: ', error.response?.data?.message);
        } finally {
          setData(prev => ({...prev, loading: false}));
        }
      }
      fetchData();
    }, [selectBranch?.id]),
  );

  console.log('length: ', data.menu.length);
  if (data.loading) {
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
        </View>
        <View style={{flex: 1, marginVertical: 10}}>
          {data.menu.length === 0 ? (
            <View style={styles.dataError}>
              <Empty width={200} height={200} />
              <DataError data={data.error} />
            </View>
          ) : (
            <ListMenu
              data={data.menu}
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
    padding: 15,
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
  boxStyles: {
    borderColor: '#878787',
    borderWidth: 1.5,
    borderRadius: 5,
    paddingVertical: 18,
  },
  dropdownStyles: {
    borderRadius: 5,
    borderWidth: 1.5,
  },
  dataError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 10,
  },
});
