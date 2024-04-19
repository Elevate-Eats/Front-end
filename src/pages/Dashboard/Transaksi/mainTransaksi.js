import {
  Modal,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback, useEffect, useState} from 'react';
import {
  BottomSheet,
  ConstButton,
  DataError,
  FormInput,
  ListTransaction,
  LoadingIndicator,
  SearchBox,
} from '../../../components';
import {Colors} from '../../../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import {MENU_BRANCH_ENDPOINT, TRANSACTION_ENDPOINT, ITEM_ENDPOINT} from '@env';

import {useSelector, useDispatch} from 'react-redux';
import {setCustomerInfo} from '../../../redux/customerSlice';
import getDataQuery from '../../../utils/getDataQuery';
import PostData from '../../../utils/postData';
import {
  setTransactionId,
  setTransactionList,
} from '../../../redux/transactionSlice';
const MainTransaksi = ({navigation, route}) => {
  const prevData = route.params;
  console.log('prev: ', prevData);
  const dispatch = useDispatch();
  const selectBranch = useSelector(s => s.branch.selectedBranch);
  const transactionId = useSelector(s => s.transaction.transactionId);
  const itemsInfo = useSelector(state => state.pcs.itemsInfo); // ! item backend
  const cartSlice = useSelector(state => state.cart.items);
  console.log('item ifno: ', itemsInfo);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [menu, setMenu] = useState({});

  const [customer, setCustomer] = useState({
    name: prevData ? prevData.name : '',
    table: prevData ? '0' : '',
  });

  const [disabled, setDisabled] = useState(true);

  const [prompt, setPrompt] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const promises = [
            getDataQuery({
              operation: MENU_BRANCH_ENDPOINT,
              endpoint: 'showMenus',
              resultKey: 'menuData',
              query: `branchid=${selectBranch.id}`,
            }),
            getDataQuery({
              operation: ITEM_ENDPOINT,
              endpoint: 'showItems',
              resultKey: 'itemData',
              query: `transactionId=${transactionId}`,
            }),
          ];
          const [menuBranch, items] = await Promise.all(promises);
          if (menuBranch && items) {
            setMenu(menuBranch);
          }
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [dispatch]),
  );

  useEffect(() => {
    if (customer.name && customer.table) {
      dispatch(setTransactionId(prevData ? prevData.id : null));
      setPrompt(false); //default true
    } else {
      setPrompt(true);
    }
  }, []);

  function transactionDate(params) {
    const now = new Date();
    const transactionId = now.toISOString();
    return transactionId;
  }

  async function addTransaction(params) {
    const payloadAdd = {
      transactiondate: transactionDate(),
      discount: 0,
      status: 1,
      paymentmethod: null,
      totalprice: 0,
      branchid: selectBranch.id,
      customername: customer.name,
      tableNumber: parseInt(customer.table, 10),
    };
    console.log(payloadAdd);
    try {
      setLoading(true);
      const data = await PostData({
        operation: TRANSACTION_ENDPOINT,
        endpoint: 'addTransaction',
        payload: payloadAdd,
      });
      if (data) {
        dispatch(setTransactionId(parseInt(data.id, 10)));
        dispatch(setCustomerInfo(customer));
        dispatch(setTransactionList(payloadAdd));
        setPrompt(false);
      }
    } catch (error) {
      console.log('Error during transaction addition:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  function openPrompt(params) {
    return (
      <SafeAreaView>
        <Modal
          animationType="slide"
          transparent={false}
          visible={prompt}
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
                  title="Submit"
                  onPress={async () => {
                    if (!customer.name || !customer.table) {
                      //edit
                      let errorMessage = customer.name
                        ? 'Masukkan Nomor Meja'
                        : 'Masukkan Nama Customer';
                      ToastAndroid.showWithGravity(
                        errorMessage,
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                      );
                    } else {
                      await addTransaction();
                    }
                  }}
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
        {openPrompt(prompt)}
        {/* ////////////////// */}
        {customer.name && customer.table ? ( // edit
          <View style={{flex: 1}}>
            <View style={styles.wrapSearch}>
              <View style={{flex: 1}}>
                <SearchBox
                  search="Cari produk ..."
                  value={query}
                  onChangeText={text => setQuery(text)}
                />
              </View>
              <TouchableOpacity style={styles.receipt}>
                <Ionicons name="options" size={28} />
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, marginVertical: 10}}>
              {!menu ? (
                <View style={styles.dataError}>
                  <DataError data={error} />
                </View>
              ) : (
                <ListTransaction
                  data={menu}
                  onPress={item => {
                    navigation.navigate('Detail Transaksi', {item});
                  }}
                />
              )}
            </View>
          </View>
        ) : null}
        <ConstButton
          onPress={() => setStatus(true)}
          title="Checkout"
          // disabled={cartSlice[transactionId] ? !disabled : disabled}
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
