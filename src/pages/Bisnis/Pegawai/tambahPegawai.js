import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Text} from 'react-native-paper';

import {EMPLOYEE_ENDPOINT} from '@env';
import {Colors} from '../../../utils/colors';
import {AddPhoto, ConstButton, FormInput} from '../../../components';
import {PostAPI} from '../../../api';
import {useNavigation} from '@react-navigation/native';

const TambahPegawai = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState({
    name: '',
    salary: '',
    bonus: '',
  });
  const [form, setForm] = useState({
    errorName: '',
    errorSalary: '',
    errorBonus: '',
    hasErrorName: false,
    hasErrorSalary: false,
    hasErrorBonus: false,
  });
  function resetFormError(params) {
    setForm(prev => ({
      ...prev,
      errorName: '',
      errorSalary: '',
      errorBonus: '',
      hasErrorName: false,
      hasErrorSalary: false,
      hasErrorBonus: false,
    }));
  }

  async function addEmployee(params) {
    setLoading(true);
    const payload = {
      ...employee,
      bonus: parseInt(employee.bonus.replace(/\./g, ''), 10),
      salary: parseInt(employee.salary.replace(/\./g, ''), 10),
    };
    resetFormError();
    try {
      const response = await PostAPI({
        operation: EMPLOYEE_ENDPOINT,
        endpoint: 'addEmployee',
        payload: payload,
      });
      if (response.status === 200) {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      const fullMessage = error.response?.data?.details;
      console.log('fullmessage: ', fullMessage);
      fullMessage.forEach(item => {
        if (item.includes('"name"')) {
          const error = 'name is required';
          setForm(prev => ({...prev, errorName: error, hasErrorName: true}));
        } else if (item.includes('"salary"')) {
          const error = 'salary is required';
          setForm(prev => ({
            ...prev,
            errorSalary: error,
            hasErrorSalary: true,
          }));
        } else if (item.includes('"bonus"')) {
          const error = 'bonus is required';
          setForm(prev => ({
            ...prev,
            errorBonus: error,
            hasErrorBonus: true,
          }));
        }
      });
    } finally {
      setLoading(false);
    }
  }
  function formatNumber(number) {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function formatMoney(text, field) {
    const rawText = text.replace(/\D/g, '');
    const formatedText = formatNumber(rawText);
    setEmployee({...employee, [field]: formatedText});
  }
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
              hasError={form.hasErrorName}
              error={form.errorName}
            />
            <FormInput
              label="Gaji Pegawai"
              placeholder="Masukkan gaji pegawai ..."
              keyboardType="numeric"
              left="cash"
              value={employee.salary}
              onChangeText={text => formatMoney(text, 'salary')}
              hasError={form.hasErrorSalary}
              error={form.errorSalary}
            />
            <FormInput
              label="Bonus Pegawai"
              placeholder="Masukkan bonus pegawai ..."
              keyboardType="numeric"
              left="percent"
              value={employee.bonus}
              onChangeText={text => formatMoney(text, 'bonus')}
              hasError={form.hasErrorBonus}
              error={form.errorBonus}
            />
          </View>
        </ScrollView>
        <View style={{flexDirection: 'row', columnGap: 10}}>
          <View style={{flex: 1}}>
            <ConstButton
              title="Tambah"
              onPress={() => addEmployee()}
              loading={loading}
            />
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
