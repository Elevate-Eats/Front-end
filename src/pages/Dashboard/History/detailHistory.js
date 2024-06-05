import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Appbar, Text} from 'react-native-paper';
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import getDataQuery from '../../../utils/getDataQuery';
import {ITEM_ENDPOINT} from '@env';
import {ConstButton, LoadingIndicator} from '../../../components';
import {useSelector} from 'react-redux';
import FormatDateTime from '../../../utils/formatDateTime';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FormatRP from '../../../utils/formatRP';
import {Colors} from '../../../utils/colors';
import Share from '../../../assets/icons/share-outline.svg';

const DetailHistory = ({route}) => {
  const navigation = useNavigation();
  const {data} = route.params;
  console.log('data:', data);
  console.log('date: ', FormatDateTime(data.transactiondate).realDate);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const branch = useSelector(state => state.branch.allBranch);
  const menuCompany = useSelector(state => state.menu.allMenu);

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        setLoading(true);
        try {
          const action = await getDataQuery({
            operation: ITEM_ENDPOINT,
            endpoint: 'showItems',
            resultKey: 'itemData',
            query: `transactionId=${data.id}`,
          });
          if (action) {
            setItems(action);
          }
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, []),
  );

  const menuMap = new Map(menuCompany.map(item => [item.id, item.name]));
  const updatedItems = Object.values(items).map(item => ({
    ...item,
    name: menuMap.get(item.menuid) || 'Unknown',
  }));

  function calculateSubtotal(params) {
    return params.reduce((sum, item) => sum + item.totalprice, 0);
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={25} color="black" />
          </TouchableOpacity>
          <Text
            variant="titleMedium"
            style={{color: 'black', fontWeight: '700'}}>
            {data.transactiondate}
          </Text>
        </View>
      </View>

      <View style={{flex: 1}}>
        <View
          style={[
            styles.detailTransaksi,
            {borderBottomWidth: 0.25, paddingVertical: 20},
          ]}>
          <Text variant="titleMedium">Customer Name</Text>
          <Text variant="titleMedium" style={{fontWeight: '700', fontSize: 18}}>
            {data.customername}
          </Text>
        </View>

        <View style={{padding: 20, rowGap: 4}}>
          <View style={styles.rowTransaction}>
            <Text>Jenis Pembayaran</Text>
            <Text variant="titleMedium" style={{fontWeight: '700'}}>
              {data.paymentmethod === '0' ? 'Cash' : 'Transfer'}
            </Text>
          </View>
          <View style={styles.rowTransaction}>
            <Text>Nama Cabang</Text>
            <Text variant="titleMedium" style={{fontWeight: '700'}}>
              {branch.filter(item => item.id === data.branchid)[0].name}
            </Text>
          </View>
          <View style={styles.rowTransaction}>
            <Text>Tanggal Transaksi</Text>
            <Text variant="titleMedium" style={{fontWeight: '700'}}>
              {FormatDateTime(data.transactiondate).realDate}
            </Text>
          </View>
          <View style={styles.rowTransaction}>
            <Text>Waktu Transaksi</Text>
            <Text variant="titleMedium" style={{fontWeight: '700'}}>
              {FormatDateTime(data.transactiondate).realTime}
            </Text>
          </View>
        </View>
        <View style={{marginHorizontal: 20, marginBottom: 10, gap: 10}}>
          <ConstButton title="Cetak Struk" />
          <TouchableOpacity style={styles.shareButton}>
            <Share />
            <Text variant="titleMedium">Bagikan</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        <Pressable
          style={styles.detailPembelian}
          onPress={() => {
            setVisible(!visible);
          }}>
          <Text variant="titleMedium">Detail Pembelian</Text>
          <Icon
            name={visible ? 'chevron-up' : 'chevron-down'}
            size={25}
            color="black"
          />
        </Pressable>
        {visible ? (
          <View style={{flex: 1}}>
            <FlatList
              nestedScrollEnabled
              data={updatedItems}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                if (loading) {
                  return <LoadingIndicator />;
                }
                return (
                  <View
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      backgroundColor:
                        item.id % 2 !== 0 ? 'transparent' : 'rgba(0,0,0,0.05)',
                    }}>
                    <Text
                      variant="titleMedium"
                      style={{fontSize: 14, fontWeight: '700'}}>
                      {item.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                        }}>{`${FormatRP(item.price)} x ${item.count}`}</Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '700',
                        }}>
                        {FormatRP(item.totalprice)}
                      </Text>
                    </View>
                  </View>
                );
              }}
            />
            <View style={styles.line} />
            <View
              style={{
                padding: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                variant="titleMedium"
                style={{
                  fontSize: 14,
                }}>{`Total (${updatedItems.length} produk)`}</Text>
              <Text
                variant="titleMedium"
                style={{fontWeight: '700', fontSize: 14}}>
                {FormatRP(calculateSubtotal(updatedItems))}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default DetailHistory;

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingVertical: 20,
    elevation: 5,
    zIndex: 888,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 16,
  },
  detailTransaksi: {
    paddingHorizontal: 20,
    borderColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailPembelian: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTransaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separator: {
    width: '100%',
    height: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  line: {
    width: '100%',
    height: 0.5,
    backgroundColor: 'grey',
    marginTop: 10,
  },
  btn: {
    backgroundColor: Colors.btnColor,
    width: 55,
    height: 55,
    borderRadius: 50,
    position: 'absolute',
    bottom: 25,
    right: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 7,
    zIndex: 999,
  },
  shareButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    columnGap: 10,
  },
});
