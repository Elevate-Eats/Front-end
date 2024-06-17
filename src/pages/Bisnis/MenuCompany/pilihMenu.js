import {
  Alert,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  BtnAdd,
  DataError,
  ListMenu,
  ListRow,
  LoadingIndicator,
  SearchBox,
} from '../../../components';
import MenuCompany from '../../../assets/icons/menuCompany.svg';
import {Colors} from '../../../utils/colors';
import {useFocusEffect} from '@react-navigation/native';
import GetData from '../../../utils/getData';
import {MENU_COMPANY_ENDPOINT} from '@env';
import {GetAPI, PostAPI} from '../../../api';

const PilihMenu = ({navigation}) => {
  const dispatch = useDispatch();
  // const menuCompany = useSelector(state => state.menu.allMenu);
  const [menuCompany, setMenuCompany] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    menuCompany: [],
    loading: false,
    error: null,
  });

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        try {
          setData(prev => ({...prev, loading: true}));
          const response = await GetAPI({
            operation: MENU_COMPANY_ENDPOINT,
            endpoint: 'showMenus',
          });
          if (response.status === 200) {
            setData(prev => ({...prev, menuCompany: response.data.menuData}));
          }
        } catch (error) {
          const fullMessage = error.response?.data?.message;
          if (fullMessage) {
            setData(prev => ({...prev, error: 'No Data Found'}));
          }
        } finally {
          setData(prev => ({...prev, loading: false}));
        }
      }
      fetchData();
    }, []),
  );

  if (data.loading) {
    return <LoadingIndicator />;
  }

  async function handleDelete(item) {
    setData(prev => ({...prev, loading: true}));
    try {
      const response = await PostAPI({
        operation: MENU_COMPANY_ENDPOINT,
        endpoint: 'deleteMenu',
        payload: {id: item.id},
      });
      if (response.status === 200) {
        ToastAndroid.show(
          `${item.name} successfully deleted`,
          ToastAndroid.SHORT,
        );
        setData(prev => ({
          ...prev,
          menuCompany: prev.menuCompany.filter(
            element => element.id !== item.id,
          ),
        }));
      }
    } catch (error) {
      ToastAndroid.show(`Failed to delete ${item.name}`, ToastAndroid.SHORT);
    } finally {
      setData(prev => ({...prev, loading: false}));
    }
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
          {data.menuCompany.length === 0 ? (
            <View style={styles.dataError}>
              <MenuCompany width={200} height={200} />
              <DataError data={data.error} />
            </View>
          ) : (
            <ListMenu
              data={data.menuCompany.sort((a, b) =>
                a.name.localeCompare(b.name),
              )}
              onPress={item => navigation.navigate('Edit Menu', {item})}
              onLongPress={item => {
                Alert.alert(
                  `Delete Menu`,
                  `Delete ${item.name} ?`,
                  [
                    {text: 'Cancel'},
                    {text: 'OK', onPress: () => handleDelete(item)},
                  ],
                  {cancelable: true},
                );
              }}
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
