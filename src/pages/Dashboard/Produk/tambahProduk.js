import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {Text} from 'react-native-paper';
import {Colors} from '../../../utils/colors';
import {MENU_COMPANY_ENDPOINT} from '@env';
import {AddPhoto, ConstButton, FormInput} from '../../../components';

import {SelectList} from 'react-native-dropdown-select-list';
import PostData from '../../../utils/postData';
const TambahProduk = ({navigation}) => {
  const [menu, setMenu] = useState({
    name: '',
    category: '',
    basePrice: '',
    baseOnlinePrice: '',
  });

  const kategori = [
    {key: 'foods', value: 'Makanan'},
    {key: 'drinks', value: 'Minuman'},
    {key: 'others', value: 'Lainnya'},
  ];

  async function addMenu(params) {
    try {
      const action = await PostData({
        operation: MENU_COMPANY_ENDPOINT,
        endpoint: 'addMenu',
        payload: menu,
      });
      Alert.alert(action.message, `${menu.name} successfully added`, [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert('Failed to Add Menu');
    }
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
              label="Nama menu"
              placeholder="Masukkan nama menu ..."
              keyboardType="default"
              left="food"
              value={menu.name}
              onChangeText={text => setMenu({...menu, name: text})}
            />
            <FormInput
              label="Harga reguler"
              placeholder="Masukkan harga reguler ..."
              keyboardType="numeric"
              left="cash-multiple"
              value={menu.basePrice ? menu.basePrice.toString() : ''}
              onChangeText={text =>
                setMenu({...menu, basePrice: parseInt(text, 10 || 0)})
              }
            />
            <FormInput
              label="Harga online"
              placeholder="Masukkan harga online ..."
              keyboardType="numeric"
              left="cash-multiple"
              value={
                menu.baseOnlinePrice ? menu.baseOnlinePrice.toString() : ''
              }
              onChangeText={text =>
                setMenu({...menu, baseOnlinePrice: parseInt(text, 10 || 0)})
              }
            />
            <View style={{marginTop: 30}}>
              <Text
                variant="titleLarge"
                style={{marginBottom: 10, fontWeight: '700'}}>
                Kategori Menu
              </Text>
              <SelectList
                data={kategori}
                save="value"
                setSelected={text => setMenu({...menu, category: text})}
                boxStyles={styles.boxStyles}
                dropdownStyles={styles.dropdownStyles}
                searchPlaceholder="Cari kategori menu..."
                placeholder="Pilih kategori menu"
                inputStyles={{color: 'black'}}
                dropdownTextStyles={styles.dropdownTextStyles}
              />
            </View>
          </View>
        </ScrollView>
        <ConstButton title="Tambah" onPress={() => addMenu()} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default TambahProduk;

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
