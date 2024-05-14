import {
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {RadioButton, Text} from 'react-native-paper';
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Colors} from '../../../utils/colors';
import {ConstButton, LoadingIndicator} from '../../../components';
import FormatRP from '../../../utils/formatRP';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import PostData from '../../../utils/postData';
import {TRANSACTION_ENDPOINT, API_URL, ANALYTICS_ENDPOINT} from '@env';

const Pembayaran = ({route}) => {
  const navigation = useNavigation();
  const data = route.params;
  console.log('data bottomSheet : ', data);
  const {totalprice} = route.params;
  // console.log('total price: ', totalprice);
  const {transactionId} = useSelector(state => state.transaction);
  const customer = useSelector(state => state.customer.customerInfo);
  console.log('ID: ', transactionId);
  console.log('customer: ', customer);
  console.log('data: ', data);
  const [checked, setChecked] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleConfirm(params) {
    if (checked === null || checked === undefined) {
      ToastAndroid.show('Pilih Metode Pembayaran !!', ToastAndroid.SHORT);
    } else {
      const prevData = data.data.filter(item => item.id === transactionId);
      const payloadUpdate = {
        ...prevData[0],
        paymentmethod: checked,
        status: 0,
        tableNumber: prevData[0].tablenumber,
        totalprice: data.totalprice,
      };
      const {companyid, tablenumber, ...payload} = payloadUpdate;
      console.log('payload: ', payload);
      // console.log('transactionid: ', transactionId);
      try {
        setLoading(true);
        const action = await PostData({
          operation: TRANSACTION_ENDPOINT,
          endpoint: 'updateTransaction',
          payload: payload,
        });
        const record = await PostData({
          operation: ANALYTICS_ENDPOINT,
          endpoint: 'recordTransaction',
          payload: {transactionId: transactionId},
        });
        if (action && record) {
          setLoading(false);
          // ToastAndroid.show('Transaksi berhasil', ToastAndroid.SHORT);
          navigation.navigate('Detail Pembayaran', {data: payload});
        }
      } catch (error) {
        ToastAndroid.show('Transaksi gagal !!!');
      } finally {
        setLoading(false);
      }
      // !-----------------------------------------
    }
  }
  // if (loading) {
  //   return <LoadingIndicator />;
  // }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.blueLayer}>
        <Text variant="titleMedium" style={{fontSize: 16}}>
          Total Tagihan
        </Text>
        <Text
          variant="titleMedium"
          style={{
            fontSize: 25,
            color: Colors.deleteColor,
            fontWeight: '700',
            // backgroundColor: 'red',
          }}>
          {FormatRP(data.totalprice)}
        </Text>
      </View>
      <View style={styles.whiteLayer}>
        <ScrollView>
          <View style={{padding: 15}}>
            <Text variant="titleMedium" style={{fontSize: 20}}>
              Metode Pembayaran
            </Text>

            <View style={{marginTop: 20, rowGap: 25}}>
              <View style={styles.payment}>
                <Icon name="cash-multiple" size={40} />
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() => setChecked(0)}>
                  <Text variant="titleSmall" style={styles.text}>
                    Cash
                  </Text>
                </TouchableOpacity>
                <RadioButton
                  value={0}
                  color={Colors.btnColor}
                  status={checked === 0 ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked(0);
                  }}
                />
              </View>
              <View style={styles.payment}>
                <Icon name="credit-card-outline" size={40} />
                <TouchableOpacity
                  style={{flex: 1}}
                  onPress={() => setChecked(1)}>
                  <Text variant="titleSmall" style={styles.text}>
                    Transfer
                  </Text>
                </TouchableOpacity>
                <RadioButton
                  value={1}
                  color={Colors.btnColor}
                  status={checked === 1 ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked(1);
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View>
          <ConstButton
            title="Konfirmasi"
            onPress={() => handleConfirm()}
            loading={loading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Pembayaran;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  blueLayer: {
    backgroundColor: Colors.secondaryColor,
    flex: 1 / 5,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 15,
  },
  whiteLayer: {
    backgroundColor: 'white',
    flex: 4 / 5,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 10,
    elevation: 1,
    padding: 10,
  },
  payment: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 15,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: 'grey',
  },
  text: {
    fontSize: 16,
    flex: 1,
    textAlignVertical: 'center',
  },
});
