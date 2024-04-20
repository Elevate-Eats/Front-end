import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text, RadioButton, Appbar, TextInput} from 'react-native-paper';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../../../utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import PostData from '../../../utils/postData';
import {MENU_BRANCH_ENDPOINT} from '@env';
import {useSelector, useDispatch} from 'react-redux';
import FormatRP from '../../../utils/formatRP';
import {ConstButton, LoadingIndicator} from '../../../components';
import {addItem, updateItem} from '../../../redux/cartSlice';

const DetailItemsCart = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {item} = route.params;
  console.log('data from bottom: ', item);
  const branch = useSelector(state => state.branch.selectedBranch);
  const transactionId = useSelector(state => state.transaction.transactionId);
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState({});
  const a = useSelector(state => state.cart.items);
  const [checked, setChecked] = useState({
    price: null,
    disc: null,
  });
  const [count, setCount] = useState(item.count);
  const [product, setProduct] = useState({
    disc: checked.disc,
    count: count,
    menuId: item.menuid,
    pricingCategory: item.pricingcategory,
    transactionId: transactionId,
    price: checked.price,
    totalPrice: 0,
    category: item.category,
    name: item.name,
  });
  function countAdd(params) {
    setCount(prev => {
      setProduct({...product, count: prev + 1});
      return prev + 1;
    });
  }

  function countSub(params) {
    if (count > 0) {
      setCount(prev => {
        setProduct({...product, count: prev - 1});
        return prev - 1;
      });
    }
  }
  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        setLoading(true);
        try {
          const data = await PostData({
            operation: MENU_BRANCH_ENDPOINT,
            endpoint: 'showSingleMenu',
            payload: {menuId: item.menuid, branchId: branch.id},
          });
          setMenu(data.menuData);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, []),
  );

  useEffect(() => {
    const total = product.price * count;
    // console.log('total Price use: ', total);
    setProduct(e => ({
      ...e,
      totalPrice: total,
    }));
  }, [product.price, count]);

  useEffect(() => {
    setChecked({
      price: item.price,
      disc: item.disc ? 'Yes' : 'No',
    });
    setProduct({
      ...product,
      price: item.price,
      disc: item.disc || 0,
    });
  }, [menu, item]);

  async function handlePress(params) {
    console.log('cartItems: ', a);
    // console.log('product: ', product);
    // console.log('product: ', item);
    const payload = {
      ...item,
      count: product.count,
      price: product.price,
      pricingcategory: product.pricingCategory,
      totalprice: product.totalPrice,
      disc: product.disc,
    };
    console.log('payload: ', payload);
    // dispatch(updateItem(payload));
    // ToastAndroid.show(`Updated ${item.name}`, ToastAndroid.SHORT);
    // navigation.goBack();
  }

  if (loading) {
    return <LoadingIndicator message="please wait ..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header mode="small" style={styles.appHeader}>
        <Appbar.Action
          icon={'window-close'}
          onPress={() => navigation.goBack()}
          color={Colors.deleteColor}
        />
        <Appbar.Content
          title={`${menu.name}, ${item.category}`}
          color="black"
          titleStyle={{fontWeight: '700', fontSize: 18}}
        />
      </Appbar.Header>
      <View style={styles.whiteLayer}>
        <ScrollView>
          <View style={styles.wrapIcon}>
            <View style={styles.icon}>
              <Icon name="food" size={50} />
            </View>
          </View>

          <View style={{marginVertical: 10, padding: 10}}>
            <Text variant="titleMedium" style={{fontSize: 18}}>
              Harga
            </Text>
            <View style={styles.harga}>
              <RadioButton
                value={menu.baseprice}
                color={Colors.btnColor}
                status={
                  checked.price === menu.baseprice ? 'checked' : 'unchecked'
                }
                onPress={() => {
                  setChecked({...checked, price: menu.baseprice}),
                    setProduct({
                      ...product,
                      price: menu.baseprice,
                      pricingCategory: 'base',
                    });
                }}
              />
              <View>
                <Text variant="titleMedium">Reguler</Text>
                <Text variant="titleSmall" style={{color: 'rgba(0,0,0,0.4)'}}>
                  {FormatRP(menu.baseprice)}
                </Text>
              </View>
            </View>

            <View style={styles.harga}>
              <RadioButton
                value={menu.baseonlineprice}
                color={Colors.btnColor}
                status={
                  checked.price === menu.baseonlineprice
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => {
                  setChecked({...checked, price: menu.baseonlineprice}),
                    setProduct({
                      ...product,
                      price: menu.baseonlineprice,
                      pricingCategory: 'online',
                    });
                }}
              />
              <View>
                <Text variant="titleMedium">Online</Text>
                <Text variant="titleSmall" style={{color: 'rgba(0,0,0,0.4)'}}>
                  {FormatRP(menu.baseonlineprice)}
                </Text>
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
                  setProduct({
                    ...product,
                    disc: 0,
                  });
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
              Jumlah Pesanan
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
          {/* <Text>{`${FormatRP(product.price)} X ${product.count} = ${FormatRP(
            product.totalPrice,
          )}`}</Text> */}
          <ConstButton title="Simpan" onPress={() => handlePress()} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DetailItemsCart;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.backgroundColor},
  appHeader: {
    backgroundColor: 'white',
    elevation: 4,
    columnGap: 20,
  },
  whiteLayer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    elevation: 1,
    padding: 10,
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
});
