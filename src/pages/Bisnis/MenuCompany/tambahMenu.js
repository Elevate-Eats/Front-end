import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {HelperText, Text, useTheme} from 'react-native-paper';
import React, {useState} from 'react';
import {AddPhoto, ConstButton, FormInput} from '../../../components';
import {Colors} from '../../../utils/colors';
import {SelectList} from 'react-native-dropdown-select-list';
import {MENU_COMPANY_ENDPOINT, API_URL} from '@env';
import {PostAPI} from '../../../api';
import {useNavigation} from '@react-navigation/native';
const TambahMenu = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState({
    name: '',
    category: '',
    basePrice: '',
    baseOnlinePrice: '',
  });

  const [form, setForm] = useState({
    errorName: '',
    errorReguler: '',
    errorOnline: '',
    errorCategory: '',
    hasErrorName: false,
    hasErrorReguler: false,
    hasErrorOnline: false,
    hasErrorCategory: false,
  });
  const kategori = [
    {key: 'foods', value: 'Makanan'},
    {key: 'drinks', value: 'Minuman'},
    {key: 'others', value: 'Lainnya'},
  ];

  function resetFormError(params) {
    setForm(prev => ({
      ...prev,
      errorName: '',
      errorReguler: '',
      errorOnline: '',
      errorCategory: '',
      hasErrorName: false,
      hasErrorReguler: false,
      hasErrorOnline: false,
      hasErrorCategory: false,
    }));
  }

  function formatNumber(number) {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function formatMoney(text, field) {
    const rawText = text.replace(/\D/g, '');
    const formatedText = formatNumber(rawText);
    setMenu({...menu, [field]: formatedText});
  }

  async function addMenuCompany(params) {
    resetFormError();
    const payload = {
      ...menu,
      basePrice: parseInt(menu.basePrice.replace(/\./g, ''), 10),
      baseOnlinePrice: parseInt(menu.baseOnlinePrice.replace(/\./g, ''), 10),
    };
    setLoading(true);
    try {
      const response = await PostAPI({
        operation: MENU_COMPANY_ENDPOINT,
        endpoint: 'addMenu',
        payload: payload,
      });
      if (response.status === 200) {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      const fullMessage = error.response?.data?.details;
      fullMessage.forEach(item => {
        if (item.includes('"name"')) {
          const error = 'name is required';
          setForm(prev => ({...prev, errorName: error, hasErrorName: true}));
        } else if (item.includes('"category"')) {
          const error = 'category is required';
          setForm(prev => ({
            ...prev,
            errorCategory: error,
            hasErrorCategory: true,
          }));
        } else if (item.includes('"basePrice"')) {
          const error = 'reguler price is required';
          setForm(prev => ({
            ...prev,
            errorReguler: error,
            hasErrorReguler: true,
          }));
        } else if (item.includes('"baseOnlinePrice"')) {
          const error = 'online price is required';
          setForm(prev => ({
            ...prev,
            errorOnline: error,
            hasErrorOnline: true,
          }));
        }
      });
    } finally {
      setLoading(false);
    }
  }

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
              placeholder="Masukkan nama menu ..."
              keyboardType="default"
              left="food"
              value={menu.name}
              onChangeText={text => setMenu({...menu, name: text})}
              hasError={form.hasErrorName}
              error={form.errorName}
            />
            <FormInput
              label="Harga reguler"
              placeholder="Masukkan harga reguler ..."
              keyboardType="numeric"
              left="cash-multiple"
              value={menu.basePrice}
              onChangeText={text => formatMoney(text, 'basePrice')}
              hasError={form.hasErrorReguler}
              error={form.errorReguler}
            />
            <FormInput
              label="Harga online"
              placeholder="Masukkan harga online ..."
              keyboardType="numeric"
              left="cash-multiple"
              value={menu.baseOnlinePrice}
              onChangeText={text => formatMoney(text, 'baseOnlinePrice')}
              hasError={form.hasErrorOnline}
              error={form.errorOnline}
            />

            <View style={{marginVertical: 10}}>
              <Text
                variant="titleLarge"
                style={{marginBottom: 10, fontWeight: '700'}}>
                Kategori Menu
              </Text>
              <SelectList
                data={kategori}
                save="value"
                setSelected={text => setMenu({...menu, category: text})}
                boxStyles={[
                  styles.boxStyles,
                  {
                    borderColor: form.hasErrorCategory ? colors.error : 'grey',
                    backgroundColor: colors.background,
                  },
                ]}
                dropdownStyles={styles.dropdownStyles}
                searchPlaceholder="Cari kategori menu..."
                placeholder="Pilih kategori menu"
                inputStyles={{color: 'black'}}
                dropdownTextStyles={styles.dropdownTextStyles}
              />
              <HelperText
                type="error"
                visible={form.hasErrorCategory}
                style={{marginTop: -5}}>
                {`Error: ${form.errorCategory}`}
              </HelperText>
            </View>
          </View>
        </ScrollView>
        <ConstButton
          title="Tambah"
          onPress={() => addMenuCompany()}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default TambahMenu;

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
    borderWidth: 1.5,
    borderRadius: 5,
    paddingVertical: 15,
  },
  dropdownStyles: {
    borderRadius: 5,
    borderWidth: 1.5,
  },
  dropdownTextStyles: {
    color: 'black',
  },
});
