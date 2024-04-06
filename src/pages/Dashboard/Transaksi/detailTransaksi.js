import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Appbar, RadioButton, Text, TextInput} from 'react-native-paper';
import {Colors} from '../../../utils/colors';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import PostData from '../../../utils/postData';
import {MENU_COMPANY_ENDPOINT} from '@env';
import {ConstButton} from '../../../components';
import FormatRP from '../../../utils/formatRP';
import {useDispatch} from 'react-redux';
import {addItem} from '../../../redux/cartSlice';

const DetailTransaksi = ({route, navigation}) => {
  const {item} = route.params;
  const dispatch = useDispatch();
  // console.log(item.id);
  const [checked, setChecked] = useState({
    price: null,
    disc: null,
  });
  const [discount, setDiscount] = useState(0);
  const [menu, setMenu] = useState({});
  const [count, setCount] = useState(0);
  const [product, setProduct] = useState({
    id: item.id,
    name: item.name,
    count: count,
    price: checked.price,
    disc: discount,
  });

  function handleCart(prod) {
    if (prod.count <= 0) {
      return Alert.alert('Tambahkan Jumlah Barang');
    } else {
      dispatch(addItem(prod)); // action redux untuk menyimpan
      Alert.alert('Menu Added', `${prod.name} berhasil ditambahkan`, [
        {text: 'OK', onPress: () => navigation.navigate('Transaksi')},
      ]);
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

  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        const data = await PostData({
          operation: MENU_COMPANY_ENDPOINT,
          endpoint: 'showSingleMenu',
          payload: {id: item.id},
        });
        setMenu(data.menuData);
      }
      fetchData();
    }, []),
  );
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
            <View>
              <View style={styles.harga}>
                <RadioButton
                  value={menu.baseprice}
                  color={Colors.btnColor}
                  status={
                    checked.price === menu.baseprice ? 'checked' : 'unchecked'
                  }
                  onPress={() => {
                    setChecked({...checked, price: menu.baseprice}),
                      setProduct({...product, price: menu.baseprice});
                  }}
                />
                <View>
                  <Text variant="titleMedium">Reguler</Text>
                  <Text
                    variant="titleSmall"
                    style={{
                      color: 'rgba(0,0,0,0.4)',
                    }}>{`Rp. ${menu.baseprice}`}</Text>
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
                      setProduct({...product, price: menu.baseonlineprice});
                  }}
                />
                <View>
                  <Text variant="titleMedium">Online</Text>
                  <Text
                    variant="titleSmall"
                    style={{
                      color: 'rgba(0,0,0,0.4)',
                    }}>{`Rp. ${menu.baseonlineprice}`}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.separator} />

          <View style={{marginVertical: 10, padding: 10}}>
            <Text variant="titleMedium" style={{fontSize: 18}}>
              Diskon
            </Text>
            <View>
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
                  onPress={() => setChecked({...checked, disc: 'Yes'})}
                />

                <Text variant="titleMedium">Diskon</Text>
              </View>
              {/* DISKON */}
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
                      value={discount ? discount.toString() : ''}
                      onChangeText={text => {
                        setDiscount(parseInt(text) || 0),
                          setProduct({...product, disc: parseInt(text) || 0});
                      }}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.wrapJumlahBarang}>
            <Text variant="titleMedium" style={{fontSize: 18, flex: 1}}>
              Jumlah barang
            </Text>
            <View style={styles.jumlahBarang}>
              <TouchableOpacity
                style={styles.btnCounterPlus}
                onPress={countSub}>
                <Icon name="minus" size={25} color="white" />
              </TouchableOpacity>
              <Text variant="titleMedium">{count}</Text>
              <TouchableOpacity style={styles.btnCounterMin} onPress={countAdd}>
                <Icon name="plus" size={25} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.separator} />
        </ScrollView>
        <View style={{rowGap: 20}}>
          <Text>{`${FormatRP(product.price)} x  ${product.count} - ${FormatRP(
            product.disc,
          )} = Total = ${FormatRP(
            product.price * product.count - product.disc,
          )}`}</Text>
          <ConstButton
            title="Simpan ke keranjang"
            onPress={() => handleCart(product)}
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
