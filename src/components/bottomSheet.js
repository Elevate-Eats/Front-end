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
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sale from '../assets/icons/sale.svg';
import NoData from '../assets/icons/noData.svg';
import Edit from '../assets/icons/square-edit-outline.svg';
import {useSelector} from 'react-redux';
import FormatRP from '../utils/formatRP';
import ConstButton from './btn';
import {Colors} from '../utils/colors';
import PostData from '../utils/postData';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ITEM_ENDPOINT, API_URL} from '@env';
import {saveItem} from '../redux/cartSlice';
import {useDispatch} from 'react-redux';

const BottomSheet = props => {
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  console.log(cartItems);
  // console.log('cart: ', cartItems);
  const [subtotal, setSubtotal] = useState('');
  const [disabled, setDisabled] = useState({
    button: true,
    disc: true,
  });
  const slide = useRef(new Animated.Value(700)).current;

  // console.log('noName: ', payloadItems);

  async function handlePay(params) {
    const payloadItems = cartItems.map(({name, disc, ...e}) => e);
    // console.log(JSON.stringify(payloadItems));
    try {
      const token = await AsyncStorage.getItem('userToken');
      // console.log(token);
      const res = await axios.post(
        `${API_URL}/${ITEM_ENDPOINT}/addItems`,
        JSON.stringify(payloadItems),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res);
    } catch (error) {
      console.log('err: ', error);
    }
  }

  function handleSave(params) {}

  function calculateSubtotal(items) {
    useEffect(() => {
      const total = cartItems.reduce(
        (acc, i) => acc + (i.count * i.price - i.disc),
        0,
      );
      setSubtotal(total);
    }, [items]);
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
      button: cartItems.length === 0,
    });
  }, [cartItems]);

  return (
    <Pressable onPress={closeModal} style={styles.backdrop}>
      <Pressable style={{width: '100%', height: '100%'}}>
        <Animated.View
          style={[styles.bottomSheet, {transform: [{translateY: slide}]}]}>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 10,
            }}>
            <Text variant="titleMedium" style={{flex: 1, fontSize: 18}}>
              {cartItems.length} produk
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

          {cartItems.length ? (
            <FlatList
              scrollToOverflowEnabled
              contentContainerStyle={{flexGrow: 1}}
              data={cartItems}
              keyExtractor={item => item.menuId.toString()}
              renderItem={({item}) => {
                return (
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
                        {FormatRP(item.totalPrice)}
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
                );
              }}
            />
          ) : (
            <View style={styles.noData}>
              <NoData width={250} height={250} fill={'grey'} />
              <Text variant="headlineMedium">No Data</Text>
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
                title={`Bayar ${FormatRP(calculateSubtotal(cartItems))}`}
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
