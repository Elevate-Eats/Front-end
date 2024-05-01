import {Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useState} from 'react';
import {Colors} from '../../../utils/colors';
import Payment from '../../../assets/icons/payment-success.svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import FormatRP from '../../../utils/formatRP';
import FormatDateTime from '../../../utils/formatDateTime';
import {ConstButton} from '../../../components';

const DetailPembayaran = ({route}) => {
  const navigation = useNavigation();
  const {data} = route.params;
  //   console.log('{data}: ', data);
  const [visible, setVisible] = useState(true);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#eaeaea'}}>
      <View style={{flex: 1}}>
        <View style={styles.iconHeader}>
          <Payment width={250} height={250} />
          <Text variant="titleMedium" style={{fontSize: 20, marginTop: 10}}>
            {data.customername}
          </Text>
          <Text style={{fontWeight: '700', fontSize: 30}}>
            {FormatRP(data.totalprice)}
          </Text>
          <Text
            variant="titleMedium"
            style={{
              color: 'grey',
            }}>{`Payment Success on ${FormatDateTime(data.transactiondate).realDate} at ${FormatDateTime(data.transactiondate).realTime}`}</Text>
        </View>

        <View style={styles.transactionDetails}>
          <Pressable
            onPress={() => setVisible(!visible)}
            style={{
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              columnGap: 20,
            }}>
            <Icon name="alert-circle-outline" size={25} color={'#22bb33'} />
            <Text variant="titleMedium" style={{flex: 1}}>
              Transaction details
            </Text>
            <Icon
              name={visible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="grey"
            />
          </Pressable>
          {visible ? (
            <View style={{marginHorizontal: 25, rowGap: 15}}>
              <View style={styles.rowDetail}>
                <Text>No Transaksi</Text>
                <Text variant="titleMedium" style={{fontWeight: '700'}}>
                  {data.transactiondate}
                </Text>
              </View>
              <View style={styles.rowDetail}>
                <Text>Jenis Pembayaran</Text>
                <Text variant="titleMedium" style={{fontWeight: '700'}}>
                  {data.paymentmethod === 0 ? 'Cash' : 'Transfer'}
                </Text>
              </View>
              <View style={styles.rowDetail}>
                <Text>Status</Text>
                <Text variant="titleMedium" style={styles.lunas}>
                  {data.status === 0 ? 'Lunas' : 'Pending'}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
      <View style={{padding: 20, backgroundColor: 'white', rowGap: 10}}>
        <Pressable
          style={{
            alignItems: 'center',
            paddingVertical: 13,
            borderRadius: 5,
            borderWidth: 1.3,
            borderColor: Colors.btnColor,
          }}>
          <Text
            variant="titleMedium"
            style={{fontWeight: '700', color: Colors.btnColor}}>
            Cetak Struk
          </Text>
        </Pressable>
        <ConstButton
          title="Kembali Ke Dashboard"
          onPress={() => navigation.navigate('Dashboard')}
        />
      </View>
    </SafeAreaView>
  );
};

export default DetailPembayaran;

const styles = StyleSheet.create({
  iconHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#eaeaea',
    rowGap: 5,
  },
  lunas: {
    fontWeight: '700',
    borderWidth: 1.8,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderColor: '#22bb33',
    borderRadius: 5,
    color: '#22bb33',
    textAlign: 'center',
  },
  rowDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: 'white',
    elevation: 7,
  },
});
