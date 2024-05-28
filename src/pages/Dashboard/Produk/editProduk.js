import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Text} from 'react-native-paper';
import {MENU_COMPANY_ENDPOINT, MENU_BRANCH_ENDPOINT} from '@env';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import PostData from '../../../utils/postData';
import {
  AddPhoto,
  ConstButton,
  DeleteButton,
  FormInput,
  LoadingIndicator,
  TopBar,
} from '../../../components';
import {Colors} from '../../../utils/colors';
import {SelectList} from 'react-native-dropdown-select-list';

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
          const dataMenu = await PostData({
            operation: MENU_BRANCH_ENDPOINT,
            endpoint: 'showSingleMenu',
            payload: {menuId: item.menuid, branchId: item.branchid},
          });
          setMenu(dataMenu.menuData);
        } catch (error) {
          Alert.alert('Failed to Fetch Data !');
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }, []),
  );

  async function updateMenu(params) {
    const payloadUpdate = {
      menuId: item.menuid,
      branchId: item.branchid,
      name: menu.name,
      category: menu.category,
      basePrice: menu.baseprice,
      baseOnlinePrice: menu.baseonlineprice,
    };
    try {
      setLoading(true);
      const action = await PostData({
        operation: MENU_BRANCH_ENDPOINT,
        endpoint: 'updateMenu',
        payload: payloadUpdate,
      });
      if (action) {
        ToastAndroid.show(action.message, ToastAndroid.SHORT);
        navigation.navigate('Pilih Produk');
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
          navigation.navigate('Pilih Produk');
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

  // console.log(payloadUpdate);

  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <KeyboardAvoidingView enabled style={styles.container}>
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
              value={menu.baseprice ? menu.baseprice.toString() : ''}
              onChangeText={text =>
                setMenu({...menu, baseprice: parseInt(text, 10) || 0})
              }
            />
            <FormInput
              label="Harga online"
              placeholder="masukkan harga online ..."
              keyboardType="numeric"
              left="cash-multiple"
              value={
                menu.baseonlineprice ? menu.baseonlineprice.toString() : ''
              }
              onChangeText={text =>
                setMenu({...menu, baseonlineprice: parseInt(text, 10) || 0})
              }
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
