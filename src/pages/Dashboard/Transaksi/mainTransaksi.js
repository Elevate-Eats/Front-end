import {
  Modal,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {
  BottomSheet,
  ConstButton,
  DataError,
  FormInput,
  ListTransaction,
  SearchBox,
} from '../../../components';
import {Colors} from '../../../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MENU_BRANCH_ENDPOINT, TRANSACTION_ENDPOINT, ITEM_ENDPOINT} from '@env';

import {useSelector, useDispatch} from 'react-redux';
import {setCustomerInfo} from '../../../redux/customerSlice';
import getDataQuery from '../../../utils/getDataQuery';
import PostData from '../../../utils/postData';
import {setTransactionId} from '../../../redux/transactionSlice';
import {GetQueryAPI} from '../../../api';
import {addItem} from '../../../redux/cartSlice';
const MainTransaksi = ({navigation, route}) => {
  const prevData = route.params;
  const dispatch = useDispatch();
  const selectBranch = useSelector(s => s.branch.selectedBranch);
  const transactionId = useSelector(s => s.transaction.transactionId);
  const reduxItems = useSelector(state => state.cart.reduxItems); // !redux
  const backendItems = useSelector(state => state.cart.backendItems); // !backend
  const [data, setData] = useState({
    loading: false,
    query: '',
    error: null,
    menu: [],
    visible: true,
    item: [],
  });
  const [status, setStatus] = useState(false);

  const [customer, setCustomer] = useState({
    name: prevData ? prevData.name : '',
    table: prevData ? prevData.table : '',
  });

  useEffect(() => {
    if (customer.name && customer.table) {
      dispatch(setTransactionId(prevData ? prevData.id : null));
      setData(prev => ({...prev, visible: false}));
      async function fetchItemData(params) {
        try {
          const response = await GetQueryAPI({
            operation: ITEM_ENDPOINT,
            endpoint: 'showItems',
            query: `transactionId=${prevData.id}`,
          });
          if (response.status === 200) {
            // console.log('respon: ', response.data.itemData);
            console.log('respon: ', response.status);
            setData(prev => ({...prev, item: response.data.itemData}));
          }
        } catch (error) {
          console.log('error items: ', error.response.status);
          setData(prev => ({...prev, item: []}));
        }
      }
      fetchItemData();
    } else {
      setData(prev => ({...prev, visible: true}));
    }
  }, []);

  useEffect(() => {
    async function fetchData(params) {
      setData(prev => ({...prev, loading: true}));
      try {
        const response = await getDataQuery({
          operation: MENU_BRANCH_ENDPOINT,
          endpoint: 'showMenus',
          resultKey: 'menuData',
          query: `branchid=${selectBranch.id}`,
        });
        if (response) {
          setData(prev => ({...prev, menu: response}));
        }
      } catch (error) {
        setData(prev => ({...prev, menu: [], error: 'Menu not found'}));
      } finally {
        setData(prev => ({...prev, loading: false}));
      }
    }
    fetchData();
  }, [selectBranch?.id]);

  async function addTransaction() {
    const now = new Date();
    const payload = {
      transactiondate: now.toISOString(),
      branchid: selectBranch.id,
      discount: 0,
      status: 1,
      paymentmethod: 0,
      totalprice: 0,
      branchid: selectBranch.id,
      customername: customer.name,
      tableNumber: customer.table,
    };
    if (
      (customer.name === null || customer.name === undefined) &&
      (customer.table === null || customer.table === undefined)
    ) {
      ToastAndroid.show('isi nama customer dan nomor meja', ToastAndroid.SHORT);
    } else {
      try {
        setData(prev => ({...prev, loading: true}));
        const response = await PostData({
          operation: TRANSACTION_ENDPOINT,
          endpoint: 'addTransaction',
          payload: payload,
        });
        if (response) {
          ToastAndroid.show(response.message, ToastAndroid.SHORT);
          dispatch(setTransactionId(parseInt(response.id, 10)));
          dispatch(setCustomerInfo(customer));
          setData(prev => ({...prev, visible: false}));
        }
      } catch (error) {
        ToastAndroid.show('Error to add transactions', ToastAndroid.SHORT);
      } finally {
        setData(prev => ({...prev, loading: true}));
      }
    }
  }

  function openPrompt(params) {
    return (
      <SafeAreaView>
        <Modal
          animationType="slide"
          transparent={false}
          visible={data.visible}
          onRequestClose={() => navigation.goBack()}>
          <SafeAreaView style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                variant="titleMedium"
                style={{alignSelf: 'center', textAlign: 'center'}}>
                Masukkan nama customer dan nomor meja terlebih dahulu ...
              </Text>
              <FormInput
                left="card-account-details-outline"
                label="Nama customer"
                placeholder="Nama"
                value={customer.name}
                onChangeText={text => setCustomer({...customer, name: text})}
                keyboardType="default"
              />
              <FormInput
                left="table-furniture"
                label="Nomor meja"
                placeholder="Meja"
                value={customer.table ? customer.table.toString() : ''}
                onChangeText={text =>
                  setCustomer({...customer, table: parseInt(text, 10 || 0)})
                }
                keyboardType="numeric"
              />
              <View style={{marginTop: 25}}>
                <ConstButton
                  loading={data.loading}
                  title="Submit"
                  onPress={() => addTransaction()}
                />
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.whiteLayer}>
        {openPrompt()}
        <View style={{flex: 1}}>
          <View style={styles.wrapSearch}>
            <View style={{flex: 1}}>
              <SearchBox
                search="Cari produk ..."
                value={data.query}
                onChangeText={text => setQuery(text)}
              />
            </View>
            <TouchableOpacity style={styles.receipt}>
              <Ionicons name="cart-outline" size={28} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, marginVertical: 10}}>
            {!data.menu ? (
              <View style={styles.dataError}>
                <DataError data={data.error} />
              </View>
            ) : (
              <ListTransaction
                data={data.menu}
                onPress={item => {
                  navigation.navigate('Detail Transaksi', {item});
                }}
              />
            )}
          </View>
        </View>

        <ConstButton
          onPress={() => {
            setStatus(true);
            dispatch(setCustomerInfo(prevData.name ? prevData : customer));
          }}
          title="Checkout"
          disabled={
            reduxItems[transactionId] || backendItems[transactionId]
              ? false
              : true
          }
        />
      </View>
      {status && (
        <BottomSheet condition={setStatus} transactionId={transactionId} />
      )}
    </View>
  );
};
export default MainTransaksi;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  whiteLayer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    elevation: 1,
    padding: 10,
  },
  wrapSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  receipt: {
    backgroundColor: '#e8e8e8',
    padding: 14,
    borderRadius: 5,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 10,
  },
  dataError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
