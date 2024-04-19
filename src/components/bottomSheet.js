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
import {allItems as allitem} from '../redux/allItems';
import {red} from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

const BottomSheet = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const menuCompany = useSelector(s => s.menu.allMenu);
  const transactionId = useSelector(state => state.transaction.transactionId); // Directly from state
  const allTransaction = useSelector(
    state => state.showTransaction.allTransaction,
  );
  const ALITEM = useSelector(state => state.allItems.allItems);
  const table = useSelector(state => state.customer.customerInfo);
  const cartSlice = useSelector(state => state.cart.items); //! Redux
  const itemsInfo = useSelector(state => state.pcs.itemsInfo); // ! item backend ke redux
  console.log('cartSLice: ', cartSlice);
  console.log('item Info: ', itemsInfo);
  console.log('ALLITEM: ', ALITEM)
  const [selectedItems, setSelectedItems] = useState([]); // Backend
  const [combined, setCombined] = useState([]);
  const [combine, setCombine] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState({
    button: true,
    disc: true,
  });

  // console.log('all Trans: ', allTransaction);
  const filtered = allTransaction.filter(item => item.id === transactionId);

  useEffect(() => {
    let data;
    async function fetchData(params) {
      if (transactionId) {
        setLoading(true);
        try {
          data = await getDataQuery({
            operation: ITEM_ENDPOINT,
            endpoint: 'showItems',
            resultKey: 'itemsData',
            query: `transactionId=${transactionId}`,
          });
          dispatch(allitem(data.itemData));
          setSelectedItems(data.itemData);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [dispatch]);

  function mergeCart(backEnd, redux) {
    // const transactionId = Object.keys(backEnd) || Object.keys(redux);
    const combinedData = [
      ...(backEnd[transactionId.toString()] || []),
      ...(redux[transactionId.toString()] || []),
    ];

    const mergeResult = combinedData.reduce((sum, item) => {
      const existingItem = sum.find(
        i => i.menuid === item.menuid || i.menuId === item.menuId,
      );
      if (existingItem) {
        existingItem.count += item.count;
        existingItem.totalprice += item.totalprice;
      } else {
        sum.push({...item});
      }
      return sum;
    }, []);
    return {[transactionId]: mergeResult};
  }
  const hasilmerge = mergeCart(itemsInfo, cartSlice);
  console.log('hasil :', hasilmerge);

  const slide = useRef(new Animated.Value(700)).current;

  async function handlePay(params) {
    console.log(menuCompany);
    const payloadUpdate = {};
  }

  async function updateItems(selectedItems) {
    // console.log('params: ', params);
    const items = [
      {
        id: 1,
        count: 3,
        price: 5000,
        totalprice: 15000,
        menuid: 3,
        transactionId: 4,
        category: 'Makanan',
        pricingcategory: 'base',
      },
      {
        id: 2,
        count: 2,
        price: 5000,
        totalprice: 10000,
        menuid: 4,
        transactionId: 4,
        category: 'Makanan',
        pricingcategory: 'base',
      },
    ];

    const payload = [
      {
        id: 2,
        count: 6,
        price: 5000,
        totalprice: 30000,
        menuid: 4,
        transactionId: 4,
        category: 'Menu Utama',
        pricingcategory: 'base',
      },
      {
        id: 1,
        count: 3,
        price: 5000,
        totalprice: 15000,
        menuid: 3,
        transactionId: 4,
        category: 'Menu Utama',
        pricingcategory: 'base',
      },
    ];
    // console.log(items);
    function updateArray(backEnd, payload) {
      const itemMap = new Map(backEnd.map(item => [item.id, item]));

      payload.forEach(update => {
        const item = itemMap.get(update.id);
        if (item) {
          itemMap.set(update.id, {...item, ...update});
        } else {
          itemMap.set(update.id, update);
        }
      });

      return Array.from(itemMap.values());
    }
    const result = updateArray(items, payload);
    console.log('result: ', result);
  }

  async function addItems(params) {
    // console.log('ADDITEMS: --->: ', params);
    const payloadAdd = params.map(({id, name, disc, ...rest}) => rest);
    console.log('ADDITEMS2: -->: ', payloadAdd);
    try {
      setLoading(true);
      const action = await PostData({
        operation: ITEM_ENDPOINT,
        endpoint: 'addItems',
        payload: payloadAdd,
      });
      if (action) {
        setLoading(false);
        ToastAndroid.show(action.message, ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error add Items" ', error);
    } finally {
      setLoading(false);
    }
  }
  async function updateTransaction(transaction) {
    const filtered = transaction.filter(item => item.id === transactionId);
    const payloadUpdate = {
      ...filtered[0],
      discount: calculateDiscount(
        selectedItems.length > 0
          ? combined
          : cartSlice[transactionId.toString()],
      ),
      totalprice: calculateSubtotal(
        selectedItems.length > 0
          ? combined
          : cartSlice[transactionId.toString()],
      ),
      tableNumber: table.table,
    };
    console.log(payloadUpdate);
    try {
      setLoading(true);
      const action = await PostData({
        operation: TRANSACTION_ENDPOINT,
        endpoint: 'updateTransaction',
        payload: payloadUpdate,
      });
      if (action) {
        setLoading(false);
        ToastAndroid.show(action.message, ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error UpdateTrans: ', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(params) {
    console.log('==== Handle Save ====');
    console.log('Param: ', params)
    console.log('cartSlice: ', cartSlice[transactionId.toString()])
    console.log('itemInfo: ', itemsInfo)
    // if (cartSlice[transactionId.toString()].length > 0) {
    //   console.log('IF cartSLice');
    //   // console.log(cartSlice[transactionId.toString()]);
    //   await addItems(cartSlice[transactionId.toString()]);
    // } else if (selectedItems.length > 0) {
    //   console.log('IF select');
    //   await updateItems(selectedItems);
    // }
    // await updateTransaction(allTransaction);
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
              {mergeCart(itemsInfo, cartSlice)[transactionId.toString()] 
              ? mergeCart(itemsInfo, cartSlice)[transactionId.toString()].length 
              : 0} produk
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
          data={mergeCart(itemsInfo, cartSlice)[transactionId.toString()]}
          keyExtractor={item => (item.id? item.id: item.menuid).toString()}
          renderItem={({item}) => {
            return(
              <ScrollView>
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
                      {item.disc ? (
                        <View>
                          <Text style={{color: 'rgba(0,0,0,0.4)'}}>
                            Diskon (-
                            {FormatRP(item.disc)})
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </TouchableOpacity>
              </ScrollView>
            )
          }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Text variant="titleMedium" style={{fontWeight: '700'}}>
              {`Subtotal (${mergeCart(itemsInfo, cartSlice)[transactionId].length})`}
            </Text>
            <Text variant="titleMedium">
              {FormatRP( calculateSubtotal(mergeCart(itemsInfo, cartSlice)[transactionId.toString()]))}
            </Text>
          </View>

          <View style={{flexDirection: 'row', columnGap: 10}}>
            <TouchableOpacity
              onPress={() => handleSave(mergeCart(itemsInfo, cartSlice)[transactionId.toString()])}
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
                onPress={handlePay}
                title={
                  `Bayar = ${FormatRP( calculateSubtotal(mergeCart(itemsInfo, cartSlice)[transactionId.toString()]))}`
                }
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
