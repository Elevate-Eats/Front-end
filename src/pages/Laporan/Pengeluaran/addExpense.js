import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useState} from 'react';
import {Colors} from '../../../utils/colors';
import Expense from '../../../assets/icons/cash-out.svg';
import {ConstButton, FormInput} from '../../../components';
import PostData from '../../../utils/postData';
import {EXPENSE_ENDPOINT} from '@env';
import {useNavigation, useRoute} from '@react-navigation/native';
import FormatDateTime from '../../../utils/formatDateTime';
import FormatDateToISO from '../../../utils/formatDateToIso';
import {PostAPI} from '../../../api';

const AddExpense = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params;
  const date = FormatDateToISO(FormatDateTime(data.date).realDate);
  //   console.log('data: ', data);
  const [loading, setLoading] = useState(false);
  const [expense, setExpense] = useState({
    name: '',
    count: '',
    price: '',
    total: '',
    date: date,
    notes: '',
    category: '',
    branchId: data.branchId.toString(),
  });

  const [form, setForm] = useState({
    errorName: '',
    errorCount: '',
    errorPrice: '',
    errorNotes: '',
    errorCategory: '',
    hasErrorName: false,
    hasErrorCount: false,
    hasErrorPrice: false,
    hasErrorNotes: false,
    hasErrorCategory: false,
  });

  function resetFormError(params) {
    setForm(prev => ({
      ...prev,
      errorName: '',
      errorCount: '',
      errorPrice: '',
      errorNotes: '',
      errorCategory: '',
      hasErrorName: false,
      hasErrorCount: false,
      hasErrorCategory: false,
    }));
  }

  function formatNumber(number) {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function formatMoney(text, field) {
    const rawText = text.replace(/\D/g, '');
    const formatedText = formatNumber(rawText);
    setExpense({...expense, [field]: formatedText});
  }
  async function handleAdd(params) {
    resetFormError();
    const payload = {
      ...params,
      total: params.count * parseInt(expense.price.replace(/\./g, ''), 10),
      price: parseInt(expense.price.replace(/\./g, ''), 10),
    };
    try {
      setLoading(true);
      const response = await PostAPI({
        operation: EXPENSE_ENDPOINT,
        endpoint: 'addExpense',
        payload: payload,
      });
      if (response.status === 200) {
        ToastAndroid.show(`${response.data.message}`, ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      const fullMessage = error.response?.data?.details;
      console.log('fullMessage: ', fullMessage);
      fullMessage.forEach(item => {
        if (item.includes('"name"')) {
          const error = 'name is required';
          setForm(prev => ({...prev, errorName: error, hasErrorName: true}));
        } else if (item.includes('"count"')) {
          const error = 'count is required';
          setForm(prev => ({...prev, errorCount: error, hasErrorCount: true}));
        } else if (item.includes('"price"')) {
          const error = 'price is required';
          setForm(prev => ({...prev, errorPrice: error, hasErrorPrice: true}));
        } else if (item.includes('"notes"')) {
          const error = 'notes is required';
          setForm(prev => ({...prev, errorNotes: error, hasErrorNotes: true}));
        } else if (item.includes('"category"')) {
          const error = 'category is required';
          setForm(prev => ({
            ...prev,
            errorCategory: error,
            hasErrorCategory: true,
          }));
        }
      });
    } finally {
      setLoading(false);
    }
    // console.log('payload: ', payload);
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.whiteLayer}>
        <ScrollView>
          <View style={{alignItems: 'center', paddingVertical: 20}}>
            <Expense width={120} height={120} />
          </View>
          <View style={{marginVertical: 30}}>
            <Text variant="titleLarge" style={{fontWeight: '600'}}>
              Informasi Pengeluaran
            </Text>
            <FormInput
              label="Nama Pengeluaran"
              placeholder="Masukkan nama pengeluaran ..."
              keyboardType="default"
              left="bank-transfer-out"
              value={expense.name}
              onChangeText={text => setExpense({...expense, name: text})}
              hasError={form.hasErrorName}
              error={form.errorName}
            />
            <FormInput
              label="Banyak pengeluaran"
              placeholder="Masukkan banyak pengeluaran ..."
              keyboardType="numeric"
              left="counter"
              value={expense.count ? expense.count.toString() : ''}
              onChangeText={text =>
                setExpense({...expense, count: parseInt(text, 10 || 0)})
              }
              hasError={form.hasErrorCount}
              error={form.errorCount}
            />
            <FormInput
              label="Harga satuan"
              placeholder="Masukkan harga satuan ..."
              keyboardType="numeric"
              left="cash"
              value={expense.price}
              onChangeText={text => formatMoney(text, 'price')}
              hasError={form.hasErrorPrice}
              error={form.errorPrice}
            />
            <FormInput
              label="Catatan"
              placeholder="Masukkan catatan pengeluaran ..."
              keyboardType="default"
              left="note-outline"
              value={expense.notes}
              onChangeText={text => setExpense({...expense, notes: text})}
              hasError={form.hasErrorNotes}
              error={form.errorNotes}
            />
            <FormInput
              label="Kategori"
              placeholder="Masukkan kategori pengeluaran ..."
              keyboardType="default"
              left="shape-outline"
              value={expense.category}
              onChangeText={text => setExpense({...expense, category: text})}
              hasError={form.hasErrorCategory}
              error={form.errorCategory}
            />
          </View>
        </ScrollView>
        <ConstButton
          loading={loading}
          onPress={() => handleAdd(expense)}
          title="Tambah Catatan Pengeluaran"
        />
      </View>
    </SafeAreaView>
  );
};

export default AddExpense;

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
