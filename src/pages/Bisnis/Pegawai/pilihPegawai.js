import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import GetData from '../../../utils/getData';
import {EMPLOYEE_ENDPOINT} from '@env';
import {Colors} from '../../../utils/colors';
import {
  BtnAdd,
  DataError,
  ListColumn,
  LoadingIndicator,
  SearchBox,
} from '../../../components';
import Employee from '../../../assets/icons/employee.svg';
import {GetAPI, PostAPI} from '../../../api';
const PilihPegawai = ({navigation}) => {
  const [data, setData] = useState({
    employee: [],
    loading: false,
    error: null,
  });
  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        setData(prev => ({...prev, loading: true}));
        try {
          const response = await GetAPI({
            operation: EMPLOYEE_ENDPOINT,
            endpoint: 'showEmployees',
          });
          if (response.status === 200) {
            setData(prev => ({...prev, employee: response.data.employeeData}));
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
        operation: EMPLOYEE_ENDPOINT,
        endpoint: 'deleteEmployee',
        payload: {id: item.id},
      });
      if (response.status === 200) {
        ToastAndroid.show(
          `${item.name} successfully deleted`,
          ToastAndroid.SHORT,
        );
        setData(prev => ({
          ...prev,
          employee: prev.employee.filter(element => element.id !== item.id),
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
        <SearchBox search="Cari pegawai ..." />
        <View style={{flex: 1, marginVertical: 10}}>
          {data.employee.length === 0 ? (
            <View style={styles.dataError}>
              <Employee width={200} height={200} />
              <DataError data={data.error} />
            </View>
          ) : (
            <ListColumn
              data={data.employee.sort((a, b) => a.name.localeCompare(b.name))}
              onPress={item => navigation.navigate('Edit Pegawai', {item})}
              onLongPress={item => {
                Alert.alert(
                  'Delete Employee',
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
      <BtnAdd onPress={() => navigation.navigate('Tambah Pegawai')} />
    </KeyboardAvoidingView>
  );
};

export default PilihPegawai;

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
