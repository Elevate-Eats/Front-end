import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-paper';
import {Colors} from '../../../utils/colors';
import {MENU_COMPANY_ENDPOINT, MENU_BRANCH_ENDPOINT} from '@env';
import {
  AddPhoto,
  ConstButton,
  FormInput,
  LoadingIndicator,
} from '../../../components';
import {useSelector} from 'react-redux';
import {SelectList} from 'react-native-dropdown-select-list';
import {Dropdown} from 'react-native-element-dropdown';
import PostData from '../../../utils/postData';
import Icon from 'react-native-vector-icons/Ionicons';

const TambahProduk = ({navigation}) => {
  const branch = useSelector(s => s.branch.selectedBranch);
  const menuCompany = useSelector(s => s.menu.allMenu);
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(false);

  // console.log('sort Menu: ', sortMenu);

  const listMenu = Object.values(menuCompany).map(item => ({
    value: item.id,
    label: item.name,
  }));
  const sortMenu = listMenu.sort((a, b) => a.label.localeCompare(b.label));

  const kategori = [
    {key: 'foods', value: 'Makanan'},
    {key: 'drinks', value: 'Minuman'},
    {key: 'others', value: 'Lainnya'},
  ];
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    async function fetchData(params) {
      setLoading(true);
      try {
        const data = await PostData({
          operation: MENU_COMPANY_ENDPOINT,
          endpoint: 'showSingleMenu',
          payload: {id: value},
        });
        setMenu(data.menuData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [value]);

  async function addMenu(params) {
    const payloadAdd = {
      menuId: value,
      branchId: branch.id,
      name: menu.name,
      category: menu.category,
      basePrice: menu.baseprice,
      baseOnlinePrice: menu.baseonlineprice,
    };
    try {
      const data = await PostData({
        operation: MENU_BRANCH_ENDPOINT,
        endpoint: 'addMenu',
        payload: payloadAdd,
      });
      ToastAndroid.show(
        `${menu.name} was successfully added`,
        ToastAndroid.SHORT,
      );
      navigation.navigate('Tambah Produk');
    } catch (error) {
      Alert.alert('Failed to Add Menu', error);
    }
  }

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: Colors.btnColor}]}>
          Menu
        </Text>
      );
    }
    return null;
  };

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

            <View style={{marginTop: 30}}>
              {renderLabel()}
              <Dropdown
                mode="modal"
                style={[
                  styles.dropdown,
                  isFocus && {borderColor: Colors.btnColor},
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={sortMenu}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Pilih Menu' : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setValue(item.value);
                  setIsFocus(false);
                }}
                renderLeftIcon={() => {
                  return (
                    <View style={{marginRight: 15}}>
                      <Icon name="fast-food" size={25} />
                    </View>
                  );
                }}
              />

              {value !== null && menu ? (
                <View>
                  <FormInput
                    disabled={true}
                    label="Nama menu"
                    placeholder="Masukkan nama menu ..."
                    keyboardType="default"
                    left="food"
                    value={menu.name}
                  />
                  <FormInput
                    label="Harga reguler"
                    placeholder="Masukkan harga reguler ..."
                    keyboardType="numeric"
                    left="cash-multiple"
                    value={menu.baseprice ? menu.baseprice.toString() : ''}
                    onChangeText={text =>
                      setMenu({...menu, baseprice: parseInt(text, 10 || 0)})
                    }
                  />
                  <FormInput
                    label="Harga online"
                    placeholder="Masukkan harga online ..."
                    keyboardType="numeric"
                    left="cash-multiple"
                    value={
                      menu.baseonlineprice
                        ? menu.baseonlineprice.toString()
                        : ''
                    }
                    onChangeText={text =>
                      setMenu({
                        ...menu,
                        baseonlineprice: parseInt(text, 10 || 0),
                      })
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
                      defaultOption={{
                        key: menu.category,
                        value: menu.category,
                      }}
                    />
                  </View>
                </View>
              ) : null}
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
  branch: {
    paddingVertical: 12,
    paddingHorizontal: 17,
    borderWidth: 1.5,
    borderRadius: 5,
    marginTop: 17,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 15,
    borderColor: '#878787',
  },

  dropdown: {
    marginBottom: 10,
    height: 50,
    borderBottomColor: 'gray',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },

  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 8,
    top: -8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
