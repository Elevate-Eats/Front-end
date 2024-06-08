import {KeyboardAvoidingView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import GetData from '../../../utils/getData';
import {MANAGER_ENDPOINT} from '@env';
import {
  BtnAdd,
  DataError,
  ListColumn,
  ListRow,
  LoadingIndicator,
  SearchBox,
} from '../../../components';
import {Colors} from '../../../utils/colors';
import Store from '../../../assets/icons/store.svg';

const PilihManager = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({
    manager: [],
    loading: false,
    error: null,
  });

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        setData(prev => ({
          ...prev,
          loading: true,
        }));
        try {
          const response = await GetData({
            operation: MANAGER_ENDPOINT,
            endpoint: 'showManagers',
            resultKey: 'managerData',
          });
          if (response) {
            setData(prev => ({...prev, manager: response}));
          }
        } catch (error) {
          setData(prev => ({
            ...prev,
            error: 'Manager not found',
            manager: [],
          }));
        } finally {
          setData(prev => ({
            ...prev,
            loading: false,
          }));
        }
      }
      fetchData();
    }, []),
  );

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
            // <ListRow
            //   data={data.manager}
            //   onPress={item => navigation.navigate('Edit Manager', {item})}
            // />
            <ListColumn
              data={data.manager}
              onPress={item => navigation.navigate('Edit Manager', {item})}
            />
          )}
        </View>
      </View>
      <BtnAdd onPress={() => navigation.navigate('Tambah Manager')} />
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
