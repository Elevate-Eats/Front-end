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
import {ConstButton} from '../../../components';
import FormatRP from '../../../utils/formatRP';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import PostData from '../../../utils/postData';
import {TRANSACTION_ENDPOINT} from '@env';
import {combineReducers} from 'redux';

const Pembayaran = ({route}) => {
  const navigation = useNavigation();
  const {data} = route.params;
  // console.log('data: ', data);
  const {transactionId} = useSelector(state => state.transaction);
  // console.log('ID: ', transactionId);
  const [singleTrans, setSingleTrans] = useState({});
  const [total, setTotal] = useState(0);
  const [checked, setChecked] = useState(null);
  useEffect(() => {
    const total = data.reduce((acc, item) => acc + item.totalprice, 0);
    setTotal(total);
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        try {
          const data = await PostData({
            operation: TRANSACTION_ENDPOINT,
            endpoint: 'showSingleTransaction',
            payload: {id: transactionId},
          });
          // console.log('data: ', data.transactionData);
          setSingleTrans(data.transactionData);
        } catch (error) {}
      }
      fetchData();
    }, []),
  );

  async function handleConfirm(params) {
    if (checked === null || checked === undefined) {
      ToastAndroid.show('Pilih Metode Pembayaran !!', ToastAndroid.SHORT);
      ToastAndroid.showWithGravity(
        'Pilih Metode Pembayaran',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      const initial = {
        ...singleTrans,
        id: transactionId,
        paymentmethod: checked,
        status: 0,
        tableNumber: singleTrans.tablenumber,
      };
      console.log('Init: ', initial);
      const {tablenumber, ...payloadUpdateTransaction} = initial;
      console.log('Init: ', payloadUpdateTransaction);

      // ToastAndroid.show('Pembayaran Berhasil !!', ToastAndroid.SHORT);
      try {
        const data = await PostData({
          operation: TRANSACTION_ENDPOINT,
          endpoint: 'updateTransaction',
          payload: payloadUpdateTransaction,
        });
        console.log(data);
        ToastAndroid.show('Pembayaran Berhasil !!', ToastAndroid.SHORT);
        navigation.navigate('Dashboard');
      } catch (error) {
        console.log('error Update Transaction');
      }
    }
  }

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
          {FormatRP(total)}
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
          <ConstButton title="Konfirmasi" onPress={() => handleConfirm()} />
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
