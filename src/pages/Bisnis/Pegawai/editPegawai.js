import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
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
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {EMPLOYEE_ENDPOINT} from '@env';
import {PostAPI} from '../../../api';

const EditPegawai = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {item} = route.params;

  const [data, setData] = useState({
    employee: [],
    loading: false,
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

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setData(prev => ({...prev, loading: true}));
        try {
          const response = await PostAPI({
            operation: EMPLOYEE_ENDPOINT,
            endpoint: 'showSingleEmployee',
            payload: {id: item.id},
          });
          if (response.status === 200) {
            const employeeData = response.data.employeeData;
            setData({
              employee: {
                ...employeeData,
                salary: formatRupiah(employeeData.salary),
                bonus: formatRupiah(employeeData.bonus),
              },
              loading: false,
            });
          }
        } catch (error) {
        } finally {
          setData(prev => ({...prev, loading: false}));
        }
      };
      fetchData();
    }, [item.id]),
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

  function formatNumber(number) {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function formatMoney(text, field) {
    const rawText = text.replace(/\D/g, '');
    const formatedText = formatNumber(rawText);
    setData(prev => ({
      ...prev,
      employee: {
        ...prev.employee,
        [field]: formatedText,
      },
    }));
  }

  async function updateEmployee(params) {
    resetFormError();
    setData(prev => ({...prev, loading: true}));
    const payload = {
      id: item.id,
      name: data.employee.name,
      salary: parseInt(data.employee.salary.replace(/\./g, ''), 10),
      bonus: parseInt(data.employee.bonus.replace(/\./g, ''), 10),
    };
    try {
      const response = await PostAPI({
        operation: EMPLOYEE_ENDPOINT,
        endpoint: 'updateEmployee',
        payload: payload,
      });
      if (response.status === 200) {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      const fullMessage = error.response?.data?.details;
      // console.log('full: ', fullMessage);
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
      setData(prev => ({...prev, loading: false}));
    }
  }

  async function deleteEmployee(params) {
    async function handleDelete(params) {
      try {
        setData(prev => ({...prev, loading: true}));
        const response = await PostAPI({
          operation: EMPLOYEE_ENDPOINT,
          endpoint: 'deleteEmployee',
          payload: {id: item.id},
        });
        if (response.status === 200) {
          ToastAndroid.show(
            `${data.employee.name} successfully deleted`,
            ToastAndroid.SHORT,
          );
          navigation.goBack();
        }
      } catch (error) {
        ToastAndroid.show(
          `Failed to delete ${data.employee.name}`,
          ToastAndroid.SHORT,
        );
      } finally {
        setData(prev => ({...prev, loading: false}));
      }
    }
    Alert.alert(
      'Employee Deleted',
      `Delete ${data.employee.name} ?`,
      [{text: 'Cancel'}, {text: 'OK', onPress: handleDelete}],
      {cancelable: true},
    );
  }

  if (data.loading) {
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
              value={data.employee.name}
              onChangeText={text =>
                setData(prev => ({
                  ...prev,
                  employee: {...prev.employee, name: text},
                }))
              }
              hasError={form.hasErrorName}
              error={form.errorName}
            />
            <FormInput
              label="Gaji Pegawai"
              placeholder="masukkan gaji pegawai ..."
              keyboardType="numeric"
              left="cash"
              secureTextEntry={false}
              value={data.employee.salary}
              onChangeText={text => formatMoney(text, 'salary')}
              hasError={form.hasErrorSalary}
              error={form.errorSalary}
            />
            <FormInput
              label="Bonus Pegawai"
              placeholder="masukkan bonus pegawai ..."
              keyboardType="numeric"
              left="percent"
              secureTextEntry={false}
              value={data.employee.bonus}
              onChangeText={text => formatMoney(text, 'bonus')}
              hasError={form.hasErrorBonus}
              error={form.errorBonus}
            />
          </View>
        </ScrollView>
        <View style={{flexDirection: 'row', columnGap: 10}}>
          <DeleteButton onPress={() => deleteEmployee()} />
          <View style={{flex: 1}}>
            <ConstButton
              title="Simpan"
              onPress={() => updateEmployee()}
              loading={data.loading}
            />
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
