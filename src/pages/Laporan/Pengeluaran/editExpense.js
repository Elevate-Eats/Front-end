import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useState} from 'react';
import {Colors} from '../../../utils/colors';
import Expense from '../../../assets/icons/cash-out.svg';
import {ConstButton, FormInput} from '../../../components';
import PostData from '../../../utils/postData';
import {EXPENSE_ENDPOINT} from '@env';
import FormatDateToISO from '../../../utils/formatDateToIso';
import FormatDateTime from '../../../utils/formatDateTime';
import {useNavigation} from '@react-navigation/native';

const EditExpense = ({route}) => {
  const navigation = useNavigation();
  const {data} = route.params;
  const [expense, setExpense] = useState(data);
  const [loading, setLoading] = useState(false);

  async function handleUpdate(params) {
    const payloadUpdate = {
      ...params,
      total: params.price * params.count,
      date: FormatDateToISO(FormatDateTime(params.date).realDate),
      branchId: params.branchid.toString(),
    };
    const {branchid, ...payload} = payloadUpdate;
    try {
      setLoading(true);
      const action = await PostData({
        operation: EXPENSE_ENDPOINT,
        endpoint: 'updateExpense',
        payload: payload,
      });
      if (action) {
        ToastAndroid.show(action.message, ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      ToastAndroid.show('Failed to Update Expense', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
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
            />
            <FormInput
              label="Harga satuan"
              placeholder="Masukkan harga satuan ..."
              keyboardType="numeric"
              left="cash"
              value={expense.price ? expense.price.toString() : ''}
              onChangeText={text =>
                setExpense({...expense, price: parseInt(text, 10 || 0)})
              }
            />
            <FormInput
              label="Catatan"
              placeholder="Masukkan catatan pengeluaran ..."
              keyboardType="default"
              left="note-outline"
              value={expense.notes}
              onChangeText={text => setExpense({...expense, notes: text})}
            />
            <FormInput
              label="Kategori"
              placeholder="Masukkan kategori pengeluaran ..."
              keyboardType="default"
              left="shape-outline"
              value={expense.category}
              onChangeText={text => setExpense({...expense, category: text})}
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
