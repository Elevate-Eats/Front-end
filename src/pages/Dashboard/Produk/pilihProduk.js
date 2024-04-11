import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  InputAccessoryView,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../../../utils/colors';
import {
  BtnAdd,
  DataError,
  ListMenu,
  ModalBranchCheckBox,
  SearchBox,
} from '../../../components';
import Icon from 'react-native-vector-icons/Ionicons';
import {MENU_COMPANY_ENDPOINT, BRANCH_ENDPOINT} from '@env';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import PostData from '../../../utils/postData';
import {MENU_BRANCH_ENDPOINT, API_URL} from '@env';
import GetData from '../../../utils/getData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import getDataQuery from '../../../utils/getDataQuery';

const PilihProduk = ({navigation}) => {
  const [modal, setModal] = useState(false);
  const [menu, setMenu] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  // branch dari dashboard
  const selectBranch = useSelector(state => state.branch.selectedBranch);
  const branch = useSelector(state => state.branch.allBranch);
  const menuCompany = useSelector(state => state.menu.allMenu);

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        try {
          const data = await getDataQuery({
            operation: MENU_BRANCH_ENDPOINT,
            endpoint: 'showMenus',
            resultKey: 'menuData',
            query: `branchid=${selectBranch.id}`,
          });
          setMenu(data);
        } catch (error) {
          setError('Menu not Found');
        }
      }
      fetchData();
    }, []),
  );

  // if (loading) {
  //   return <LoadingIndicator />;
  // }
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
          <TouchableOpacity
            style={styles.receipt}
            onPress={() => setModal(true)}>
            <Icon name="options" size={28} />
            <ModalBranchCheckBox open={modal} close={() => setModal(false)} />
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
});
