import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  AddPhoto,
  FormInput,
  DeleteButton,
  ConstButton,
} from '../../../components';
import {SelectList} from 'react-native-dropdown-select-list';
import {Colors} from '../../../utils/colors';
import {useSelector} from 'react-redux';
import PostData from '../../../utils/postData';
import {MENU_COMPANY_ENDPOINT} from '@env';
import {useDispatch} from 'react-redux';
import {deleteMenu as Del} from '../../../redux/menuSlice';
import {updateMenu as Up} from '../../../redux/menuSlice';
const EditMenu = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {item} = route.params;
  const [menu, setMenu] = useState({});
  const kategori = [
    {key: 'foods', value: 'Makanan'},
    {key: 'drinks', value: 'Minuman'},
    {key: 'others', value: 'Lainnya'},
  ];

  async function updateMenu(params) {
    const payload = {
      id: item.id,
      name: menu.name,
      category: menu.category,
      basePrice: menu.baseprice,
      baseOnlinePrice: menu.baseonlineprice,
    };
    // console.log(payload);
    try {
      const action = await PostData({
        operation: MENU_COMPANY_ENDPOINT,
        endpoint: 'updateMenu',
        payload: payload,
      });
      if (action) {
        ToastAndroid.show(
          `${menu.name} has been successfully updated`,
          ToastAndroid.SHORT,
        );
        navigation.goBack();
      }
    } catch (error) {
      ToastAndroid.show(`Failed to delete ${menu.name}`);
      console.log(error);
    }
  }

  async function deleteMenu(params) {
    async function handleDelete(params) {
      const payloadDel = {
        id: item.id,
      };
      try {
        const action = await PostData({
          operation: MENU_COMPANY_ENDPOINT,
          endpoint: 'deleteMenu',
          payload: {id: item.id},
        });
        console.log('payload: ', payloadDel);
        ToastAndroid.show(
          `${menu.name} successfully deleted`,
          ToastAndroid.SHORT,
        );
        navigation.goBack();
      } catch (error) {
        ToastAndroid.show(`Faild to Delete ${menu.name}`, ToastAndroid.SHORT);
      }
    }
    Alert.alert(
      `Delete Menu`,
      `Delete ${menu.name} ?`,
      [{text: 'Cancel'}, {text: 'OK', onPress: () => handleDelete()}],
      {cancelable: true},
    );
  }

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        try {
          const menuCompany = await PostData({
            operation: MENU_COMPANY_ENDPOINT,
            endpoint: 'showSingleMenu',
            payload: {id: item.id},
          });
          setMenu(menuCompany.menuData);
        } catch (error) {}
      }
      fetchData();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.whiteLayer}>
        <ScrollView>
          <AddPhoto icon="fast-food" />
          <View style={{marginTop: 30}}>
            <Text variant="titleLarge" style={{fontWeight: '700'}}>
              Informasi Menu
            </Text>

            <FormInput
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
            <ConstButton title="Simpan" onPress={() => updateMenu()} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditMenu;

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
