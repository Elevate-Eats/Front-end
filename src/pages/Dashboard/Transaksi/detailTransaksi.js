import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Appbar, RadioButton, Text, TextInput} from 'react-native-paper';
import {Colors} from '../../../utils/colors';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import PostData from '../../../utils/postData';
import {MENU_COMPANY_ENDPOINT, MENU_BRANCH_ENDPOINT} from '@env';
import {ConstButton} from '../../../components';
import FormatRP from '../../../utils/formatRP';
import {useDispatch} from 'react-redux';
import cartSlice, {addItem} from '../../../redux/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const DetailTransaksi = ({route, navigation}) => {
  const {item} = route.params;
  console.log('item: ', item);
  const customer = useSelector(s => s.customer.customerInfo);
  const transaction = useSelector(s => s.transaction.transactionId);
  const dispatch = useDispatch();

  const [checked, setChecked] = useState({
    price: null,
    disc: null,
  });

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        try {
          const data = await PostData({
            operation: MENU_BRANCH_ENDPOINT,
            endpoint: 'showSingleMenu',
            payload: {menuId: item.menuid, branchId: item.branchid},
          });
          console.log(data.menuData);
          setMenu(data.menuData);
        } catch (error) {}
      }
      fetchData();
    }, []),
  );
  const [menu, setMenu] = useState({});
  const [count, setCount] = useState(0);
  const [product, setProduct] = useState({
    count: count,
    menuId: item.menuid,
    pricingCategory: '',
    transactionId: transaction,
    price: checked.price,
    totalPrice: 0,
    category: item.category,
    name: item.name,
    disc: 0,
  });

  useEffect(() => {
    const totalPrice = product.price * product.count - product.disc;
    setProduct(e => ({
      ...e,
      totalPrice: totalPrice,
    }));
  }, [product.price, product.count, product.disc]);

  function handleCart(params) {
    if (product.count <= 0 || product.price === null) {
      return Alert.alert(
        'Failed to Add Menu',
        'Tambahkan jumlah barang atau harga',
      );
    } else {
      dispatch(addItem(product));
      ToastAndroid.show(
        `${product.name} successfully added to cart`,
        ToastAndroid.SHORT,
      );
      navigation.navigate('Transaksi');
      // console.log(product);
    }
  }
  function countAdd() {
    setCount(prev => {
      setProduct({...product, count: prev + 1});
      return prev + 1;
    });
  }
  function countSub() {
    if (count > 0) {
      setCount(prev => {
        setProduct({...product, count: prev - 1});
        return prev - 1;
      });
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
      <Appbar.Header mode="small" style={styles.appHeader}>
        <Appbar.Action
          icon={'window-close'}
          onPress={() => navigation.goBack()}
          color={Colors.deleteColor}
        />
        <Appbar.Content
          title={`${item.name}, ${item.category}`}
          color={'black'}
          titleStyle={{fontWeight: '700', fontSize: 18}}
        />
      </Appbar.Header>
      <View style={styles.whiteLayer}>
        <ScrollView>
          <View style={styles.wrapIcon}>
            <View style={styles.icon}>
              <Ionicons name="fast-food" size={50} />
            </View>
          </View>

          <View style={{marginVertical: 10, padding: 10}}>
            <Text variant="titleMedium" style={{fontSize: 18}}>
              Harga
            </Text>
            <View style={styles.harga}>
              <RadioButton
                value={item.baseprice}
                color={Colors.btnColor}
                status={
                  checked.price === item.baseprice ? 'checked' : 'unchecked'
                }
                onPress={() => {
                  setChecked({...checked, price: item.baseprice}),
                    setProduct({
                      ...product,
                      price: item.baseprice,
                      pricingCategory: 'base',
                    });
                }}
              />
              <View>
                <Text variant="titleMedium">Reguler</Text>
                <Text
                  variant="titleSmall"
                  style={{
                    color: 'rgba(0,0,0,0.4)',
                  }}>{`Rp. ${item.baseprice}`}</Text>
              </View>
            </View>

            <View style={styles.harga}>
              <RadioButton
                value={item.baseonlineprice}
                color={Colors.btnColor}
                status={
                  checked.price === item.baseonlineprice
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => {
                  setChecked({...checked, price: item.baseonlineprice}),
                    setProduct({
                      ...product,
                      price: item.baseonlineprice,
                      pricingCategory: 'online',
                    });
                }}
              />
              <View>
                <Text variant="titleMedium">Online</Text>
                <Text
                  variant="titleSmall"
                  style={{
                    color: 'rgba(0,0,0,0.4)',
                  }}>{`Rp. ${item.baseonlineprice}`}</Text>
              </View>
            </View>
          </View>
          <View style={styles.separator} />

          <View style={{marginVertical: 10, padding: 10}}>
            <Text variant="titleMedium" style={{fontSize: 18}}>
              Diskon
            </Text>
            <View style={styles.harga}>
              <RadioButton
                value="No"
                color={Colors.btnColor}
                status={checked.disc === 'No' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked({...checked, disc: 'No'});
                }}
              />
              <Text variant="titleMedium">Tanpa Diskon</Text>
            </View>
            <View style={styles.harga}>
              <RadioButton
                value="Yes"
                color={Colors.btnColor}
                status={checked.disc === 'Yes' ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked({...checked, disc: 'Yes'});
                }}
              />
              <Text variant="titleMedium">Diskon</Text>
            </View>

            <View style={{marginLeft: 10}}>
              {checked.disc === 'Yes' ? (
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    mode="outlined"
                    style={{height: 50, width: 100}}
                    keyboardType="numeric"
                    label={'Diskon'}
                    activeOutlineColor={Colors.btnColor}
                    outlineStyle={{borderWidth: 1}}
                    value={product.disc ? product.disc.toString() : ''}
                    onChangeText={text => {
                      setProduct({
                        ...product,
                        disc: parseInt(text) || 0,
                      });
                    }}
                  />
                </View>
              ) : null}
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.wrapJumlahBarang}>
            <Text variant="titleMedium" style={{fontSize: 18, flex: 1}}>
              Jumlah Barang
            </Text>
            <View style={styles.jumlahBarang}>
              <TouchableOpacity
                style={styles.btnCounterPlus}
                onPress={() => countSub()}>
                <Icon name="minus" size={25} color="white" />
              </TouchableOpacity>
              <Text variant="titleMedium">{count}</Text>
              <TouchableOpacity
                style={styles.btnCounterMin}
                onPress={() => countAdd()}>
                <Icon name="plus" size={25} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.separator} />
        </ScrollView>
        <View style={{rowGap: 20}}>
          <Text>
            {`${FormatRP(product.price)} x ${product.count} - ${
              product.disc
            } = ${FormatRP(product.totalPrice)} `}
          </Text>
          <ConstButton
            title="Tambah ke keranjang"
            onPress={() => {
              handleCart();
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DetailTransaksi;

const styles = StyleSheet.create({
  whiteLayer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    elevation: 1,
    padding: 10,
  },
  appHeader: {
    backgroundColor: 'white',
    elevation: 4,
    columnGap: 20,
  },
  icon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  wrapIcon: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  harga: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 20,
    marginTop: 10,
  },
  separator: {
    height: 5,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 5,
  },
  jumlahBarang: {
    flexDirection: 'row',
    // columnGap: 25,
    width: 120,
    borderWidth: 1,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'rgba(0,0,0,0.2)',
  },
  wrapJumlahBarang: {
    marginVertical: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnCounterPlus: {
    backgroundColor: Colors.btnColor,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 5,
  },
  btnCounterMin: {
    backgroundColor: Colors.btnColor,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    padding: 5,
  },
});
