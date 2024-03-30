import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Text} from 'react-native-paper';

import {EMPLOYEE_ENDPOINT} from '@env';
import PostData from '../../../utils/postData';
import {CollapsedItem} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import {Colors} from '../../../utils/colors';
import {
  AddPhoto,
  ConstButton,
  DeleteButton,
  FormInput,
} from '../../../components';

const TambahPegawai = ({navigation}) => {
  const [employee, setEmployee] = useState({
    name: '',
    salary: '',
    bonus: '',
  });

  async function addEmployee(params) {
    try {
      const action = await PostData({
        operation: EMPLOYEE_ENDPOINT,
        endpoint: 'addEmployee',
        payload: employee,
      });
      Alert.alert(action.message, `${employee.name} successfully added`, [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert('Failed to Add Employee');
    }
  }
  const formatRupiah = angka => {
    let number_string = angka.toString(),
      split = number_string.split(','),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/g);

    if (ribuan) {
      let separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    return rupiah;
  };
  return (
    <KeyboardAvoidingView enabled style={styles.container}>
      <View style={styles.whiteLayer}>
        <ScrollView>
          <AddPhoto icon="person" />
          <View style={{marginTop: 30}}>
            <Text variant="titleLarge" style={{fontWeight: '700'}}>
              Informasi Pegawai
            </Text>

            <FormInput
              label="Nama Pegawai"
              placeholder="Masukkan nama pegawai ..."
              keyboardType="default"
              left="account"
              value={employee.name}
              onChangeText={text => setEmployee({...employee, name: text})}
            />
            <FormInput
              label="Gaji Pegawai"
              placeholder="Masukkan gaji pegawai ..."
              keyboardType="numeric"
              left="cash"
              value={formatRupiah(employee.salary)}
              onChangeText={text =>
                setEmployee({...employee, salary: parseInt(text, 10 || 0)})
              }
            />
            <FormInput
              label="Bonus Pegawai"
              placeholder="Masukkan bonus pegawai ..."
              keyboardType="numeric"
              left="percent"
              value={formatRupiah(employee.bonus)}
              onChangeText={text =>
                setEmployee({...employee, bonus: parseInt(text, 10 || 0)})
              }
            />
          </View>
        </ScrollView>
        <View style={{flexDirection: 'row', columnGap: 10}}>
          <View style={{flex: 1}}>
            <ConstButton title="Tambah" onPress={() => addEmployee()} />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default TambahPegawai;

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
