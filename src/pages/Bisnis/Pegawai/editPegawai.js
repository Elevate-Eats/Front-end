import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback, useState} from 'react';
import {Colors} from '../../../utils/colors';
import {
  AddPhoto,
  ConstButton,
  DeleteButton,
  FormInput,
  LoadingIndicator,
} from '../../../components';
import {useFocusEffect} from '@react-navigation/native';

import {EMPLOYEE_ENDPOINT} from '@env';
import PostData from '../../../utils/postData';

const EditPegawai = ({route, navigation}) => {
  const {item} = route.params;

  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const dataEmployee = await PostData({
            operation: EMPLOYEE_ENDPOINT,
            endpoint: 'showSingleEmployee',
            payload: {id: item.id},
          });
          setEmployee(dataEmployee.employeeData);
        } catch (error) {
          Alert.alert('Failed to Fetch Data !');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []),
  );

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

  async function updateEmployee(params) {
    const payloadUpdate = {
      id: item.id,
      name: employee.name,
      salary: employee.salary,
      bonus: employee.bonus,
    };

    try {
      const action = await PostData({
        operation: EMPLOYEE_ENDPOINT,
        endpoint: 'updateEmployee',
        payload: payloadUpdate,
      });
      Alert.alert(action.message, `${employee.name} successfully updated`, [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert('Failed to Update Employee');
    }
  }

  async function deleteEmployee(params) {
    async function handleDelete(params) {
      try {
        const action = await PostData({
          operation: EMPLOYEE_ENDPOINT,
          endpoint: 'deleteEmployee',
          payload: {id: item.id},
        });
        Alert.alert(action.message, `${employee.name} successfully deleted`, [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } catch (error) {
        Alert.alert('Failed to Delete Employee')
      }
    }

    Alert.alert(
      'Employee Deleted',
      `Delete ${employee.name} ?`,
      [{text: 'Cancel'}, {text: 'OK', onPress: handleDelete}],
      {cancelable: true},
    );
  }

  if (loading) {
    return <LoadingIndicator />;
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
              placeholder="masukkan nama pegawai ..."
              keyboardType="default"
              left="account"
              secureTextEntry={false}
              value={employee.name}
              onChangeText={text => setEmployee({...employee, name: text})}
            />
            <FormInput
              label="Gaji Pegawai"
              placeholder="masukkan gaji pegawai ..."
              keyboardType="numeric"
              left="cash"
              secureTextEntry={false}
              value={employee.salary ? formatRupiah(employee.salary) : ''}
              onChangeText={text =>
                setEmployee({...employee, salary: parseInt(text, 10 || 0)})
              }
            />
            <FormInput
              label="Bonus Pegawai"
              placeholder="masukkan bonus pegawai ..."
              keyboardType="numeric"
              left="percent"
              secureTextEntry={false}
              value={employee.bonus ? formatRupiah(employee.bonus) : ''}
              onChangeText={text =>
                setEmployee({...employee, bonus: parseInt(text, 10 || 0)})
              }
            />
          </View>
        </ScrollView>
        <View style={{flexDirection: 'row', columnGap: 10}}>
          <DeleteButton onPress={() => deleteEmployee()} />
          <View style={{flex: 1}}>
            <ConstButton title="Simpan" onPress={() => updateEmployee()} />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditPegawai;

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
