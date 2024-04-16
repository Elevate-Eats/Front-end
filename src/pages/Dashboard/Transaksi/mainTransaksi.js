import {
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
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
import GetData from '../../../utils/getData';
import {MENU_BRANCH_ENDPOINT, TRANSACTION_ENDPOINT, ITEM_ENDPOINT} from '@env';

import {useSelector, useDispatch} from 'react-redux';
import {allMenu} from '../../../redux/menuSlice';
import {setCustomerInfo} from '../../../redux/customerSlice';
import getDataQuery from '../../../utils/getDataQuery';
import PostData from '../../../utils/postData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  setTransactionId,
  setTransactionList,
} from '../../../redux/transactionSlice';
import {addItem} from '../../../redux/cartSlice';
import {addTransaction as addTrans} from '../../../database/addTransactions';
import {showTransaction} from '../../../database/showTransaction';
import {showItems} from '../../../database/showItems';
import {asyncThunkCreator} from '@reduxjs/toolkit';

const MainTransaksi = ({navigation, route}) => {
  const prevData = route.params;
  // console.log('prevData dari pending: ', prevData);
  const dispatch = useDispatch();
  const selectBranch = useSelector(s => s.branch.selectedBranch);
  const transactionId = useSelector(s => s.transaction.transactionId);
  // const menuSlice = useSelector()
  const [status, setStatus] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [menu, setMenu] = useState({});
  const [allItems, setAllItems] = useState({});

  const [customer, setCustomer] = useState({
    name: prevData ? prevData.name : '',
    table: prevData ? '0' : '',
  });

  const [prompt, setPrompt] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        try {
          const data = await getDataQuery({
            operation: MENU_BRANCH_ENDPOINT,
            endpoint: 'showMenus',
            resultKey: 'menuData',
            query: `branchid=${selectBranch.id}`,
          });
          setMenu(data);
        } catch (error) {
          setError('Menu Not Found !');
        }
      }
      fetchData(transactionId);
    }, []),
  );

  useEffect(() => {
    if (customer.name && customer.table) {
      dispatch(setTransactionId(prevData.id));
      setPrompt(false); //default true
    } else {
      setPrompt(true);
    }
    // generateTransactionId();
  }, []);

  function generateTransactionId(params) {
    const now = new Date();
    const transactionId = now.toISOString();
    console.log(transactionId);
    return transactionId;
  }

  async function addTransaction(params) {
    const payloadAdd = {
      transactiondate: generateTransactionId(),
      discount: null,
      status: 1,
      paymentmethod: null,
      totalprice: null,
      branchid: selectBranch.id,
      customername: customer.name,
      tableNumber: parseInt(customer.table, 10),
    };
    try {
      const data = await PostData({
        operation: TRANSACTION_ENDPOINT,
        endpoint: 'addTransaction',
        payload: payloadAdd,
      });
      if (data && data.id) {
        const {tableNumber, ...restOfPayloadAdd} = payloadAdd;
        const payload = {
          ...restOfPayloadAdd, // spread the remaining properties of payloadAdd
          tablenumber: tableNumber, // add the renamed key with its value
          id: data.id,
        };
        dispatch(setTransactionId(parseInt(data.id, 10)));
        dispatch(setCustomerInfo(customer));
        dispatch(setTransactionList(payloadAdd));
        setPrompt(false);
        await addTrans(payload);
        // const mytrans = await showTransaction(); // Ensuring this is only called if data.id is valid
        // console.log('my Trans: ', mytrans);
      } else {
        console.error('Invalid transaction data received:', data);
      }
    } catch (error) {
      console.error('Error during transaction addition:', error);
    }
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
                        ? 'Masukkan nama customer'
                        : 'Masukkan nomor meja';
                      Alert.alert(
                        `Failed !`,
                        errorMessage,
                        [{text: 'OK', onPress: () => setPrompt(true)}],
                        {cancelable: false},
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
                <DataError data={error} />
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
        <ConstButton onPress={() => setStatus(true)} title="Checkout" />
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
});
