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
import axios, {all} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ITEM_ENDPOINT, API_URL, TRANSACTION_ENDPOINT} from '@env';
import {useDispatch} from 'react-redux';
import getDataQuery from '../utils/getDataQuery';
import {addItem} from '../redux/cartSlice';
import {err} from 'react-native-svg';
import {showItems} from '../database/showItems';
import LoadingIndicator from './loadingIndicator';
import {allMenu} from '../redux/menuSlice';

const BottomSheet = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const branch = useSelector(state => state.branch.selectedBranch);
  const customer = useSelector(state => state.customer.customerInfo);
  const menuCompany = useSelector(s => s.menu.allMenu);
  const transactionId = useSelector(state => state.transaction.transactionId); // Directly from state
  const cartItems = useSelector(state => state.cart.items);
  const newItems = useSelector(state => state.cart.newItems);
  const [cart, setCart] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [single, setSingle] = useState({});
  const [subtotal, setSubtotal] = useState('');
  const [combine, setCombine] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState({
    button: true,
    disc: true,
  });
  useEffect(() => {
    async function showSingle(params) {
      const data = await PostData({
        operation: TRANSACTION_ENDPOINT,
        endpoint: 'showSingleTransaction',
        payload: {id: transactionId},
      });
      setSingle(data.transactionData);
    }
    showSingle();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (transactionId) {
        setLoading(true);
        try {
          const itemsPromise = getDataQuery({
            operation: ITEM_ENDPOINT,
            endpoint: 'showItems',
            resultKey: 'itemData',
            query: `transactionId=${transactionId}`,
          });
          const cartItemsPromise = showItems(transactionId);

          const [items, cartItems] = await Promise.all([
            itemsPromise,
            cartItemsPromise,
          ]);

          setAllItems(items || []);
          setCart(cartItems || []);
        } catch (error) {
          ToastAndroid.show('Failed to Fetch Data', ToastAndroid.SHORT);
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('Transaction ID is not available');
      }
    }

    fetchData();
  }, [transactionId]);

  useEffect(() => {
    const combinedData = combineItems(cart, allItems, menuCompany);
    setCombine(combinedData);
  }, [cart, allItems, menuCompany]);

  function combineItems(backendData, localData, menuCompany) {
    const combined = new Map();
    const menuMap = new Map(menuCompany.map(item => [item.id, item.name]));

    backendData.forEach(item => {
      const key = `${item.menuid}-${item.transactionId}`;
      combined.set(key, {...item, name: menuMap.get(item.menuid) || item.name});
    });

    localData.forEach(item => {
      const key = `${item.menuid}-${item.transactionid}`; // Pastikan key sesuai
      if (combined.has(key)) {
        // Jika sudah ada, kita update dengan data dari local yang mungkin memiliki informasi tambahan
        const existingItem = combined.get(key);
        combined.set(key, {
          ...existingItem,
          ...item,
          name: menuMap.get(item.menuid) || item.name,
        });
      } else {
        // Jika tidak ada, tambahkan sebagai item baru
        combined.set(key, {
          ...item,
          name: menuMap.get(item.menuid) || item.name,
        });
      }
    });

    // Ubah map kembali menjadi array
    return Array.from(combined.values());
  }
  // console.log('menuCompany: ', menuCompany);
  console.log('DB: ', cart);
  console.log('backEnd: ', allItems);
  console.log('combined: ', combine);

  const slide = useRef(new Animated.Value(700)).current;

  function handlePay(params) {
    console.log('isi cartItems: ', cartItems);
    navigation.navigate('Pembayaran', {
      data: combine,
    });
  }

  async function updateItems(params) {
    // console.log('<---DATA--->');
    // console.log('Params Update Items: ', params);
    const payloadUpdateItems = params.map(item => ({
      id: item.id,
      count: item.count,
      pricingcategory: item.pricingcategory,
      price: item.price,
      totalPrice: item.totalprice,
    }));
    console.log('UPDATE ITEMS ---> : ', payloadUpdateItems);
    try {
      const action = await PostData({
        operation: ITEM_ENDPOINT,
        endpoint: 'updateItems',
        payload: payloadUpdateItems,
      });
      console.log(action.message);
      ToastAndroid.show(action.message, ToastAndroid.SHORT);
    } catch (error) {
      console.log('error Update ITEMS: ', error);
    }
  }

  async function addItems(params) {
    // console.log('params addItems: ', params);
    const payloadAddItems = params.map(({name, discount, id, ...rest}) => rest);
    // console.log('Payload Add Items: ', payloadAddItems);
    const initial = payloadAddItems.map(item => ({
      ...item,
      pricingCategory: item.pricingcategory,
      menuId: item.menuid,
      totalPrice: item.totalprice,
      transactionId: payloadAddItems[0].transactionid,
    }));
    // console.log('initial: ', initial);
    const payloadAdd = initial.map(item => {
      const {transactionid, menuid, pricingcategory, totalprice, ...rest} =
        item;
      return rest;
    });
    // console.log('ADD ITEMS');
    console.log('ADDITEMS: --->: ', payloadAdd);
    try {
      const action = await PostData({
        operation: ITEM_ENDPOINT,
        endpoint: 'addItems',
        payload: payloadAdd,
      });
      ToastAndroid.show(action.message, ToastAndroid.SHORT);
    } catch (error) {
      console.log('Error add Items" ', error);
    }
  }
  async function updateTransaction(params) {
    function Calculate(params) {
      const totals = combine.reduce(
        (acc, i) => {
          (acc.totalPrice += i.totalprice), (acc.discount += i.discount);
          return acc;
        },
        {totalPrice: 0, discount: 0},
      );
      return totals;
    }
    const {totalPrice, totalDiscount} = Calculate();
    const initialPayload = {
      ...single,
      id: transactionId,
      discount: totalDiscount ? totalDiscount : 0,
      paymentmethod: 0,
      totalprice: totalPrice,
      tableNumber: single.tablenumber,
      tablenumber: single.tablenumber,
    };
    // console.log('inital payload: ', initialPayload);
    const {tablenumber, ...payloadUpdateTransaction} = initialPayload;
    // console.log('UPDATE TRANS');
    console.log('UPDATE TRANS --->: ', payloadUpdateTransaction);
    try {
      const action = await PostData({
        operation: TRANSACTION_ENDPOINT,
        endpoint: 'updateTransaction',
        payload: payloadUpdateTransaction,
      });
      console.log(action.message, 'update Transaction');
    } catch (error) {
      console.log('Error UpdateTrans: ', error);
    }
  }

  async function handleSave(params) {
    console.log('==== Handle Save ====');
    // console.log('combine save: ', params);

    const itemsToAdd = combine.filter(
      item => item.id === null || item.id === undefined,
    );
    const itemsToUpdate = combine.filter(
      item => item.id !== null || item.id !== undefined,
    );

    // console.log('item to add: ', itemsToAdd);
    if (itemsToAdd.length > 0) {
      await addItems(itemsToAdd);
    }
    if (itemsToUpdate > 0) {
      await updateItems(itemsToUpdate);
    }

    await updateTransaction(combine);
    navigation.goBack();
    // updateItems(itemsToUpdate);
  }

  function calculateSubtotal(params) {
    useEffect(() => {
      const total = combine.reduce(
        (acc, i) => acc + (i.count * i.price - i.discount),
        0,
      );
      setSubtotal(total);
    }, [combine]);
    return subtotal;
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
    // setDisabled(cartItems.length === 0);
    setDisabled({
      ...disabled,
      button: combine.length === undefined ? combine : null,
    });
  }, [combine]);

  return (
    <Pressable onPress={closeModal} style={styles.backdrop}>
      <Pressable style={{width: '100%', height: '99.9%'}}>
        <Animated.View
          style={[styles.bottomSheet, {transform: [{translateY: slide}]}]}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 10,
            }}>
            <Text variant="titleMedium" style={{flex: 1, fontSize: 18}}>
              {combine ? combine.length : '0'} produk
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

          {combine.length > 0 ? (
            <FlatList
              data={combine}
              keyExtractor={item => (item.id || item.menuid).toString()}
              renderItem={({item}) => {
                return (
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
                          {FormatRP(item.totalprice || item.totalprice)}
                        </Text>
                      </View>
                      {item.discount ? (
                        <View>
                          <Text style={{color: 'rgba(0,0,0,0.4)'}}>
                            Diskon (-
                            {FormatRP(item.discount)})
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <View style={styles.noData}>
              <NoData width={250} height={250} />
              <Text variant="headlineSmall">No items for this order</Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Text variant="titleMedium" style={{fontWeight: '700'}}>
              Subtotal
            </Text>
            <Text variant="titleMedium">{FormatRP(subtotal)}</Text>
          </View>

          <View style={{flexDirection: 'row', columnGap: 10}}>
            <TouchableOpacity
              onPress={() => handleSave(combine)}
              style={
                disabled.button
                  ? [styles.simpan, {borderColor: 'rgba(0,0,0,0.4)'}]
                  : [styles.simpan, {borderColor: Colors.btnColor}]
              }
              disabled={disabled.button}>
              <Text
                style={
                  disabled.button
                    ? [styles.texSimpan, {color: 'rgba(0,0,0,0.4)'}]
                    : [styles.texSimpan, {color: Colors.btnColor}]
                }>
                Simpan
              </Text>
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <ConstButton
                disabled={disabled.button}
                title={`Bayar ${FormatRP(calculateSubtotal(combine))}`}
                onPress={handlePay}
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
