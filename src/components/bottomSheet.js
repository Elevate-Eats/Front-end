import {
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
  Animated,
  Image,
  FlatList,
  ScrollView,
  ToastAndroid,
  Alert,
  TouchableOpacityComponent,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text, useTheme} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sale from '../assets/icons/sale.svg';
import NoData from '../assets/icons/noData.svg';
import Edit from '../assets/icons/square-edit-outline.svg';
import {useSelector} from 'react-redux';
import FormatRP from '../utils/formatRP';
import ConstButton from './btn';
import {Colors} from '../utils/colors';
import PostData from '../utils/postData';
import {ITEM_ENDPOINT, API_URL, TRANSACTION_ENDPOINT} from '@env';
import {useDispatch} from 'react-redux';
import getDataQuery from '../utils/getDataQuery';
import {clearReduxItems} from '../redux/cartSlice';

const BottomSheet = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const menuCompany = useSelector(s => s.menu.allMenu);
  const transactionId = useSelector(state => state.transaction.transactionId); // Directly from state
  const selectedBranch = useSelector(state => state.branch.selectedBranch);
  const customer = useSelector(state => state.customer.customerInfo);
  const reduxItems = useSelector(state => state.cart.reduxItems); //! Redux
  const backendItems = useSelector(state => state.cart.backendItems); // !Backend
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState([]);

  // console.log('all Trans: ', allTransaction);
  function mergeCart(backEnd, redux) {
    const combinedData = [
      ...(backEnd[transactionId.toString()] || []),
      ...(redux[transactionId.toString()] || []),
    ];

    const mergeResult = combinedData.reduce((sum, item) => {
      const existing = sum.find(
        i => i.menuid === item.menuid || i.menuId === item.menuid,
      );

      if (existing) {
        (existing.count += item.count),
          (existing.totalprice += item.totalprice);
      } else {
        sum.push({...item});
      }
      return sum;
    }, []);
    return {[transactionId]: mergeResult};
  }
  const hasilmerge = mergeCart(backendItems, reduxItems);
  console.log('hasil :', hasilmerge);
  console.log('CUSTOMER: ', customer);

  const slide = useRef(new Animated.Value(700)).current;

  async function handlePay(params) {
    // console.log('selected: ', selectedTransaction.transactions);
    await handleSave();
    navigation.navigate('Pembayaran', {
      data: selectedTransaction,
      totalprice: calculateSubtotal(
        mergeCart(backendItems, reduxItems)[transactionId],
      ),
    });
  }

  async function updateItems(params) {
    console.log('params Update: ', params);
    const payload = params
      .map(item => ({
        ...item,
        totalPrice: item.totalprice,
      }))
      .map(
        ({category, disc, menuid, name, transactionId, totalprice, ...rest}) =>
          rest,
      );
    console.log('payload: ', payload);

    try {
      setLoading(true);
      const action = await PostData({
        operation: ITEM_ENDPOINT,
        endpoint: 'updateItems',
        payload: payload,
      });
      if (action) {
        setLoading(false);
        // ToastAndroid.show(action.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('Error Updating Items: ', error);
    } finally {
      setLoading(false);
    }
  }

  async function addItems(params) {
    const payload = params
      .map(item => ({
        ...item,
        menuId: item.menuid,
        totalPrice: item.totalprice - item.disc,
        pricingCategory: item.pricingcategory,
      }))
      .map(
        ({name, disc, menuid, totalprice, pricingcategory, ...rest}) => rest,
      );

    console.log('payload: ', payload);
    try {
      setLoading(true);
      const action = await PostData({
        operation: ITEM_ENDPOINT,
        endpoint: 'addItems',
        payload: payload,
      });
      if (action) {
        setLoading(false);
      }
    } catch (error) {
      console.log('Error add Items" ', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateTransaction(params) {
    const filtered = selectedTransaction.filter(
      item => item.id === transactionId,
    );
    // console.log('filtered: ', selectedTransaction);
    const payloadUpdate = {
      ...filtered[0],
      tableNumber: filtered[0].tablenumber,
      totalprice: calculateSubtotal(params),
    };
    const {tablenumber, companyid, ...payload} = payloadUpdate;
    // console.log('payload: ', payload);
    try {
      setLoading(true);
      const action = await PostData({
        operation: TRANSACTION_ENDPOINT,
        endpoint: 'updateTransaction',
        payload: payload,
      });
      if (action) {
        setLoading(false);
        ToastAndroid.show(action.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('Error UpdateTrans: ', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(params) {
    const withId = mergeCart(backendItems, reduxItems)[
      transactionId.toString()
    ].filter(item => item.hasOwnProperty('id'));

    const withoutId = mergeCart(backendItems, reduxItems)[
      transactionId.toString()
    ].filter(item => !item.hasOwnProperty('id'));

    // console.log('================================');
    // console.log('with id: ', withId);
    // console.log('without id: ', withoutId);
    // console.log('================================');

    // await addItems(withoutId);
    // await updateItems(withId);
    // console.log(withId.length);
    // console.log(withoutId.length);
    // await updateTransaction(
    //   mergeCart(backendItems, reduxItems)[transactionId.toString()],
    // );

    try {
      setLoading(true);
      if (withoutId.length > 0) {
        console.log('==IF AddItems==');
        await addItems(withoutId);
      }

      if (withId.length > 0) {
        console.log('==IF UpdateItems==');
        await updateItems(withId);
      }

      if (withId.length > 0 || withoutId.length > 0) {
        console.log('==IF UpdateTrans==');
        await updateTransaction(
          mergeCart(backendItems, reduxItems)[transactionId.toString()],
        );
      }
      dispatch(clearReduxItems());
      ToastAndroid.show('Items saved successfully', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.log('Error save', error);
      // ToastAndroid.show('Items failed to save', ToastAndroid.SHORT);
    }

    // ! ----------------------------------------------------------
  }

  function calculateSubtotal(params) {
    return params.reduce((sum, item) => sum + item.totalprice, 0);
  }
  function calculateDiscount(params) {
    return params.reduce((sum, item) => sum + item.disc, 0);
  }

  function slideUp(params) {
    Animated.timing(slide, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }

  function slideDown(params) {
    Animated.timing(slide, {
      toValue: 1000,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }

  function closeModal(params) {
    slideDown();
    setTimeout(() => {
      props.condition(false);
    }, 400);
  }

  useEffect(() => {
    slideUp();
    async function fetchData(params) {
      try {
        const action = await getDataQuery({
          operation: TRANSACTION_ENDPOINT,
          endpoint: 'showTransactions',
          resultKey: 'transactions',
          query: `branch=${selectedBranch.id}&search=${customer.name}`,
        });
        setSelectedTransaction(action);
      } catch (error) {}
    }
    fetchData();
  }, []);

  return (
    <Pressable onPress={closeModal} style={styles.backdrop}>
      <Pressable style={{width: '100%', height: '99%'}}>
        <Animated.View
          style={[styles.bottomSheet, {transform: [{translateY: slide}]}]}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 10,
            }}>
            <Text variant="titleMedium" style={{flex: 1, fontSize: 18}}>
              {mergeCart(backendItems, reduxItems)[transactionId.toString()]
                ? mergeCart(backendItems, reduxItems)[transactionId.toString()]
                    .length
                : 0}{' '}
              produk
            </Text>
            <View style={{flexDirection: 'row', columnGap: 20}}>
              <TouchableOpacity>
                <Sale width={25} height={25} fill={'grey'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Edit width={25} height={25} fill={'grey'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={25} />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={mergeCart(backendItems, reduxItems)[transactionId.toString()]}
            keyExtractor={item => (item.id ? item.id : item.menuid).toString()}
            renderItem={({item}) => {
              return (
                // <ScrollView>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Detail Items Cart', {item})
                  }>
                  <View style={styles.cartItem}>
                    <Text variant="titleMedium" style={{fontWeight: '700'}}>
                      {item.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text>
                        {FormatRP(item.price)} x {item.count}
                      </Text>
                      <Text style={{fontWeight: '700', fontSize: 18}}>
                        {item.disc
                          ? FormatRP(item.totalprice - item.disc)
                          : FormatRP(item.totalprice)}
                      </Text>
                    </View>
                    {
                      <View>
                        {item.hasOwnProperty('disc') ? (
                          <Text>Diskon (- {FormatRP(item.disc)})</Text>
                        ) : (
                          <Text>
                            Diskon(-
                            {FormatRP(
                              item.totalprice - item.price * item.count,
                            )}
                            )
                          </Text>
                        )}
                      </View>
                    }
                  </View>
                </TouchableOpacity>
                // </ScrollView>
              );
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Text variant="titleMedium" style={{fontWeight: '700'}}>
              {`Subtotal (${mergeCart(backendItems, reduxItems)[transactionId].length})`}
            </Text>
            <Text variant="titleMedium" style={{fontWeight: '700'}}>
              {FormatRP(
                calculateSubtotal(
                  mergeCart(backendItems, reduxItems)[transactionId.toString()],
                ),
              )}
            </Text>
          </View>

          <View style={{flexDirection: 'row', columnGap: 10}}>
            <TouchableOpacity
              onPress={() => handleSave(mergeCart(backendItems, reduxItems))}
              style={
                mergeCart(backendItems, reduxItems)
                  ? [styles.simpan, {borderColor: Colors.btnColor}]
                  : [styles.simpan, {borderColor: 'rgba(0,0,0,0.4)'}]
              }
              disabled={mergeCart(backendItems, reduxItems) ? false : true}>
              <Text
                style={
                  mergeCart(backendItems, reduxItems)
                    ? [styles.texSimpan, {color: Colors.btnColor}]
                    : [styles.simpan, {borderColor: 'rgba(0,0,0,0.4)'}]
                }>
                Simpan
              </Text>
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <ConstButton
                loading={loading}
                disabled={mergeCart(backendItems, reduxItems) ? false : true}
                onPress={handlePay}
                title={`Bayar = ${FormatRP(
                  calculateSubtotal(
                    mergeCart(backendItems, reduxItems)[
                      transactionId.toString()
                    ],
                  ),
                )}`}
              />
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Pressable>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  noData: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 10,
  },
  cartItem: {
    rowGap: 3,
    marginHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
  },
  simpan: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  simpanDisable: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  texSimpan: {
    fontWeight: '700',
    fontSize: 16,
  },
});
