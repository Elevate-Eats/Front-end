import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {MANAGER_ENDPOINT} from '@env';
import {
  BtnAdd,
  DataError,
  ListColumn,
  LoadingIndicator,
  SearchBox,
} from '../../../components';
import {Colors} from '../../../utils/colors';
import Store from '../../../assets/icons/store.svg';
import {GetAPI, PostAPI} from '../../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PilihManager = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({
    manager: [],
    loading: false,
    error: null,
    local: {},
  });

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        setData(prev => ({...prev, loading: true}));
        try {
          const response = await GetAPI({
            operation: MANAGER_ENDPOINT,
            endpoint: 'showManagers',
          });
          if (response.status === 200) {
            setData(prev => ({...prev, manager: response.data.managerData}));
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

  useEffect(() => {
    async function fetchLocalStorage(params) {
      try {
        const response = await AsyncStorage.getItem('credentials');
        const parsed = JSON.parse(response);
        setData(prev => ({...prev, local: parsed}));
      } catch (error) {
        console.log('error: ', error);
      }
    }
    fetchLocalStorage();
  }, []);

  async function handleDelete(item) {
    setData(prev => ({...prev, loading: true}));
    try {
      const response = await PostAPI({
        operation: MANAGER_ENDPOINT,
        endpoint: 'deleteManager',
        payload: {id: item.id},
      });
      if (response.status === 200) {
        ToastAndroid.show(
          `${item.name} successfully deleted`,
          ToastAndroid.SHORT,
        );
        setData(prev => ({
          ...prev,
          manager: prev.manager.filter(element => element.id !== item.id),
        }));
      }
    } catch (error) {
      ToastAndroid.show(`Failed to delete ${item.name}`, ToastAndroid.SHORT);
    } finally {
      setData(prev => ({...prev, loading: false}));
    }
  }

  if (data.loading) {
    return <LoadingIndicator />;
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.whiteLayer}>
        <SearchBox search="Cari manager ..." />
        <View style={{flex: 1, marginVertical: 10}}>
          {data.error || data.manager.length === 0 ? (
            <View style={styles.dataError}>
              <Store width={200} height={200} />
              <DataError data={data.error} />
            </View>
          ) : (
            <ListColumn
              role={data.local.role}
              data={data.manager.sort((a, b) => a.name.localeCompare(b.name))}
              onPress={item => navigation.navigate('Edit Manager', {item})}
              onLongPress={item => {
                Alert.alert(
                  'Delete Manager',
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
      {data.local.role === 'general_manager' ? (
        <BtnAdd onPress={() => navigation.navigate('Tambah Manager')} />
      ) : null}
    </KeyboardAvoidingView>
  );
};

export default PilihManager;

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
  dataError: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 20,
  },
});
