import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../../../utils/colors';
import Expense from '../../../assets/icons/cash-out.svg';
import {ConstButton, FormInput} from '../../../components';
import {EXPENSE_ENDPOINT} from '@env';
import FormatDateToISO from '../../../utils/formatDateToIso';
import FormatDateTime from '../../../utils/formatDateTime';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {PostAPI} from '../../../api';

const EditExpense = ({route}) => {
  const navigation = useNavigation();
  const {data} = route.params;
  const [expense, setExpense] = useState(data);
  const [loading, setLoading] = useState(false);

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
      hasErrorPrice: false,
      hasErrorNotes: false,
      hasErrorCategory: false,
    }));
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
  function formatNumber(number) {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  function formatMoney(text, field) {
    const rawText = text.replace(/\D/g, '');
    const formatedText = formatNumber(rawText);
    setExpense({...expense, [field]: formatedText});
  }

  async function handleUpdate(params) {
    resetFormError();
    const payloadUpdate = {
      ...params,
      total: parseInt(params.price.replace(/\./g, ''), 10) * params.count,
      date: FormatDateToISO(FormatDateTime(params.date).realDate),
      branchId: params.branchid.toString(),
      price: parseInt(params.price.replace(/\./g, ''), 10),
    };
    const {branchid, ...payload} = payloadUpdate;
    try {
      setLoading(true);
      const response = await PostAPI({
        operation: EXPENSE_ENDPOINT,
        endpoint: 'updateExpense',
        payload: payload,
      });
      if (response.status === 200) {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      const fullMessage = error.response?.data?.details;
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
  }

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        try {
          setLoading(true);
          const response = await PostAPI({
            operation: EXPENSE_ENDPOINT,
            endpoint: 'showSingleExpense',
            payload: {id: data.id},
          });
          if (response.status === 200) {
            const expenseData = response.data.expense;
            setExpense({
              ...expenseData,
              price: formatRupiah(expenseData.price),
            });
            setLoading(false);
          }
        } catch (error) {
          console.log('error: ', error.response);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, [data.id]),
  );

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
          onPress={() => handleUpdate(expense)}
          title="Update Catatan Pengeluaran"
        />
      </View>
    </SafeAreaView>
  );
};

export default EditExpense;

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
