import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useCallback, useState} from 'react';
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

const PilihCabang = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({
    branch: [],
    error: null,
    loading: false,
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

  async function handleDelete(item) {
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
          branch: prev.branch.filter(branchItem => branchItem.id !== item.id),
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
        <SearchBox search="Cari cabang ..." />
        <View style={{flex: 1, marginVertical: 10}}>
          {data.branch.length === 0 ? (
            <View style={styles.dataError}>
              <Store width={200} height={200} />
              <DataError data={data.error} />
            </View>
          ) : (
            <ListRow
              data={data.branch.sort((a, b) => a.name.localeCompare(b.name))}
              onPress={item => navigation.navigate('Edit Cabang', {item})}
              onLongPress={item => {
                Alert.alert(
                  'Branch Deleted',
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
      <BtnAdd onPress={() => navigation.navigate('Tambah Cabang')} />
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
