import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../../../utils/colors';
import {
  BtnAdd,
  SearchBox,
  ListRow,
  DataError,
  LoadingIndicator,
} from '../../../components';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BRANCH_ENDPOINT} from '@env';
import Store from '../../../assets/icons/store.svg';
import {GetAPI, PostAPI} from '../../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PilihCabang = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({
    branch: [],
    error: null,
    loading: false,
    local: {},
  });

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        setData(prev => ({...prev, loading: true}));
        try {
          const response = await GetAPI({
            operation: BRANCH_ENDPOINT,
            endpoint: 'showBranches',
          });
          if (response.status === 200) {
            setData(prev => ({...prev, branch: response.data.branchData}));
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
    if (data.local?.role === 'general_manager') {
      setData(prev => ({...prev, loading: true}));
      try {
        const response = await PostAPI({
          operation: BRANCH_ENDPOINT,
          endpoint: 'deleteBranch',
          payload: {id: item.id},
        });
        if (response.status === 200) {
          ToastAndroid.show(
            `${item.name} successfully deleted`,
            ToastAndroid.SHORT,
          );
          setData(prev => ({
            ...prev,
            branch: prev.branch.filter(element => element.id !== item.id),
          }));
        }
      } catch (error) {
        ToastAndroid.show(`Failed to delete ${item.name}`, ToastAndroid.SHORT);
      } finally {
        setData(prev => ({...prev, loading: false}));
      }
    } else {
      ToastAndroid.show(
        `You don't have permission to delete`,
        ToastAndroid.SHORT,
      );
    }
  }

  function alertDelete(branch) {
    Alert.alert(
      'Delete Branch',
      `Delete ${branch.name} ?`,
      [{text: 'Cancel'}, {text: 'OK', onPress: () => handleDelete(branch)}],
      {cancelable: true},
    );
  }
  if (data.loading) {
    return <LoadingIndicator />;
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.whiteLayer}>
        <SearchBox search="Cari cabang ..." />
        <View style={{flex: 1, marginVertical: 10}}>
          {data.branch.length === 0 ? (
            <View style={styles.dataError}>
              <Store width={200} height={200} />
              <DataError data={data.error} />
            </View>
          ) : (
            <ListRow
              id={data.local.id}
              data={data.branch}
              onPress={item => navigation.navigate('Edit Cabang', {item})}
              onLongPress={item => alertDelete(item)}
            />
          )}
        </View>
      </View>
      {data.local.role === 'general_manager' ? (
        <BtnAdd onPress={() => navigation.navigate('Tambah Cabang')} />
      ) : null}
    </KeyboardAvoidingView>
  );
};

export default PilihCabang;

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
  ifError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  dataError: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
