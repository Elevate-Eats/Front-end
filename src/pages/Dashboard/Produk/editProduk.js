import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Appbar, Text} from 'react-native-paper';
import {MENU_BRANCH_ENDPOINT} from '@env';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import PostData from '../../../utils/postData';
import {
  AddPhoto,
  ConstButton,
  DeleteButton,
  FormInput,
  LoadingIndicator,
} from '../../../components';
import {Colors} from '../../../utils/colors';
import {SelectList} from 'react-native-dropdown-select-list';
import {PostAPI} from '../../../api';

const EditProduk = ({route}) => {
  const navigation = useNavigation();
  const {item} = route.params;
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(false);

  const kategori = [
    {key: 'foods', value: 'Makanan'},
    {key: 'drinks', value: 'Minuman'},
    {key: 'others', value: 'Lainnya'},
  ];

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        setLoading(true);
        try {
          // const dataMenu = await PostData({
          //   operation: MENU_BRANCH_ENDPOINT,
          //   endpoint: 'showSingleMenu',
          //   payload: {menuId: item.menuid, branchId: item.branchid},
          // });
          // setMenu(dataMenu.menuData);
          const response = await PostAPI({
            operation: MENU_BRANCH_ENDPOINT,
            endpoint: 'showSingleMenu',
            payload: {menuId: item.menuid, branchId: item.branchid},
          });
          if (response.status === 200) {
            const menuData = response.data.menuData;
            setMenu({
              ...menuData,
              baseonlineprice: formatRupiah(menuData.baseonlineprice),
              baseprice: formatRupiah(menuData.baseprice),
            });
          }
        } catch (error) {
          Alert.alert('Failed to Fetch Data !', error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, []),
  );

  function formatNumber(number) {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  function formatMoney(text, field) {
    const rawText = text.replace(/\D/g, '');
    const formatedText = formatNumber(rawText);
    setMenu({...menu, [field]: formatedText});
  }
  const formatRupiah = angka => {
    let number_string = angka.toString(),
      split = number_string.split(','),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/g);

    if (ribuan) {
      let separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    return rupiah;
  };

  async function updateMenu(params) {
    const payloadUpdate = {
      menuId: item.menuid,
      branchId: item.branchid,
      name: menu.name,
      category: menu.category,
      basePrice: parseInt(menu.baseprice.replace(/\./g, ''), 10),
      baseOnlinePrice: parseInt(menu.baseonlineprice.replace(/\./g, ''), 10),
    };
    // console.log('payload: ', payloadUpdate);
    try {
      setLoading(true);
      const action = await PostData({
        operation: MENU_BRANCH_ENDPOINT,
        endpoint: 'updateMenu',
        payload: payloadUpdate,
      });
      if (action) {
        ToastAndroid.show(action.message, ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Failed to Update Menu');
    } finally {
      setLoading(false);
    }
  }

  async function deleteMenu(params) {
    async function handleDelete(params) {
      try {
        setLoading(true);
        const action = await PostData({
          operation: MENU_BRANCH_ENDPOINT,
          endpoint: 'deleteMenu',
          payload: {menuId: item.menuid, branchId: item.branchid},
        });
        if (action) {
          ToastAndroid.show(action.message, ToastAndroid.SHORT);
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Failed to Delete Menu');
      } finally {
        setLoading(false);
      }
    }
    Alert.alert(
      'Menu Deleted',
      `Delete ${menu.name} ?`,
      [{text: 'Cancel'}, {text: 'OK', onPress: () => handleDelete()}],
      {cancelable: true},
    );
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={`${item.name}, ${item.category}`}
          titleStyle={{fontSize: 18, fontWeight: '700'}}
        />
      </Appbar.Header>
      <View style={styles.whiteLayer}>
        <ScrollView>
          <AddPhoto icon="fast-food" />
          <View style={{marginTop: 30}}>
            <Text variant="titleLarge" style={{fontWeight: '700'}}>
              Informasi Menu
            </Text>

            <FormInput
              disabled={true}
              label="Nama menu"
              placeholder="masukkan nama menu ..."
              keyboardType="default"
              left="food"
              value={menu.name}
              onChangeText={text => setMenu({...menu, name: text})}
            />

            <FormInput
              label="Harga reguler"
              placeholder="masukkan harga reguler ..."
              keyboardType="numeric"
              left="cash-multiple"
              value={menu.baseprice}
              onChangeText={text => formatMoney(text, 'baseprice')}
            />
            <FormInput
              label="Harga online"
              placeholder="masukkan harga online ..."
              keyboardType="numeric"
              left="cash-multiple"
              value={menu.baseonlineprice}
              onChangeText={text => formatMoney(text, 'baseonlineprice')}
            />
            <View style={{marginTop: 30}}>
              <Text
                variant="titleLarge"
                style={{fontWeight: '700', marginBottom: 10}}>
                Kategori Menu
              </Text>
              <SelectList
                data={kategori}
                save="value"
                setSelected={text => setMenu({...menu, category: text})}
                boxStyles={styles.boxStyles}
                dropdownStyles={styles.dropdownStyles}
                placeholder="Pilih kategori menu"
                searchPlaceholder="Cari kategori menu"
                inputStyles={{color: 'black'}}
                dropdownTextStyles={styles.dropdownTextStyles}
                defaultOption={{
                  key: menu.category,
                  value: menu.category,
                }}
              />
            </View>
          </View>
        </ScrollView>
        <View style={{flexDirection: 'row', columnGap: 10}}>
          <DeleteButton onPress={() => deleteMenu()} />
          <View style={{flex: 1}}>
            <ConstButton
              title="Simpan"
              onPress={() => updateMenu()}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditProduk;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  whiteLayer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    elevation: 1,
    padding: 10,
  },
  boxStyles: {
    flex: 1,
    borderColor: '#878787',
    borderWidth: 1.5,
    borderRadius: 5,
  },
  dropdownStyles: {
    borderRadius: 5,
    borderWidth: 1.5,
  },
  dropdownTextStyles: {
    color: 'black',
  },
});
