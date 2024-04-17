import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import GetData from '../../../utils/getData';
import {useSelector} from 'react-redux';
import {EMPLOYEE_ENDPOINT} from '@env';
import {Colors} from '../../../utils/colors';
import {
  BtnAdd,
  DataError,
  ListColumn,
  ListRow,
  SearchBox,
} from '../../../components';
const PilihPegawai = ({navigation}) => {
  // const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const employee = useSelector(state => state.employee.allEmployee);
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
