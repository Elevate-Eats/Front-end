import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import GetData from '../../../utils/getData';

import {EMPLOYEE_ENDPOINT} from '@env';
import {Colors} from '../../../utils/colors';
import {
  BtnAdd,
  DataError,
  ListColumn,
  ListRow,
  SearchBox,
} from '../../../components';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';

const PilihPegawai = ({navigation}) => {
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const dataEmployee = await GetData({
            operation: EMPLOYEE_ENDPOINT,
            endpoint: 'showEmployees',
            resultKey: 'employeeData',
          });
          setEmployee(dataEmployee);
        } catch (error) {
          setError('Employee Not Found !');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []),
  );
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.whiteLayer}>
        <SearchBox search="Cari pegawai ..." />
        <View style={{flex: 1, marginVertical: 10}}>
          {error ? (
            <DataError data={error} />
          ) : (
            <ListColumn
              data={employee}
              onPress={item => navigation.navigate('Edit Pegawai', {item})}
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
});
