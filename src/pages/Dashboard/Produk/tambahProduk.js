import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HelperText, Text} from 'react-native-paper';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PostAPI} from '../../../api';

const TambahProduk = ({navigation}) => {
  const branch = useSelector(s => s.branch.selectedBranch);
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(false);

  // console.log('sort Menu: ', sortMenu);

  const kategori = [
    {key: 'foods', value: 'Makanan'},
    {key: 'drinks', value: 'Minuman'},
    {key: 'others', value: 'Lainnya'},
  ];
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const [data, setData] = useState({
    menuCompany: [],
    menuBranch: {},
  });

  const [dropdown, setDropdown] = useState({
    value: null,
    focus: false,
  });

  const [form, setForm] = useState({
    errorReguler: '',
    errorOnline: '',
    errorCategory: '',
    hasErrorReguler: false,
    hasErrorOnline: false,
    hasErrorCategory: false,
  });

  function resetFormError(params) {
    setForm(prev => ({
      ...prev,
      errorReguler: '',
      errorOnline: '',
      errorCategory: '',
      hasErrorReguler: false,
      hasErrorOnline: false,
      hasErrorCategory: false,
    }));
  }

  useEffect(() => {
    async function fetchDataLocal(params) {
      setLoading(true);
      try {
        const response = await AsyncStorage.getItem('allMenuCompany');
        if (response.length > 0) {
          setData(prev => ({...prev, menuCompany: JSON.parse(response)}));
        }
      } catch (error) {
      } finally {
        setLoading(true);
      }
    }
    fetchDataLocal();
  }, []);

  useEffect(() => {
    async function fetchData(params) {
      setLoading(true);
      try {
        const response = await PostAPI({
          operation: MENU_COMPANY_ENDPOINT,
          endpoint: 'showSingleMenu',
          payload: {id: dropdown.value},
        });
        if (response.status === 200) {
          setData(prev => ({...prev, menuBranch: response.data.menuData}));
        }
      } catch (error) {
        console.log('error: ', error.response?.data);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dropdown.value]);

  async function addMenu(params) {
    resetFormError();
    setLoading(true);
    const payload = {
      menuId: dropdown.value,
      branchId: branch.id,
      name: data.menuBranch.name,
      category: data.menuBranch.category,
      basePrice: data.menuBranch.baseprice,
      baseOnlinePrice: data.menuBranch.baseonlineprice,
    };
    try {
      const response = await PostAPI({
        operation: MENU_BRANCH_ENDPOINT,
        endpoint: 'addMenu',
        payload: payload,
      });
      if (response.status === 200) {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      const fullMessage = error.response?.data?.details;
      if (fullMessage) {
        fullMessage.forEach(item => {
          if (item.includes('"basePrice"')) {
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
      }
    } finally {
      setLoading(false);
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

  const listMenu = Object.values(data.menuCompany).map(item => ({
    value: item.id,
    label: item.name,
  }));
  const sortMenu = listMenu.sort((a, b) => a.label.localeCompare(b.label));

  // if (loading) {
  //   return <LoadingIndicator />;
  // }

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
                mode="default"
                style={[
                  styles.dropdown,
                  dropdown.focus && {borderColor: Colors.btnColor},
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={sortMenu}
                search
                maxHeight={450}
                labelField="label"
                valueField="value"
                placeholder={!dropdown.focus ? 'Pilih Menu' : '...'}
                searchPlaceholder="Search..."
                value={dropdown.value}
                onFocus={() => setDropdown(prev => ({...prev, focus: true}))}
                onBlur={() => setDropdown(prev => ({...prev, focus: false}))}
                onChange={item => {
                  setDropdown(prev => ({
                    ...prev,
                    value: item.value,
                    focus: false,
                  }));
                }}
                renderLeftIcon={() => {
                  return (
                    <View style={{marginRight: 15}}>
                      <Icon name="fast-food" size={25} />
                    </View>
                  );
                }}
              />

              {dropdown.value !== null && menu ? (
                <View>
                  <FormInput
                    disabled={true}
                    label="Nama menu"
                    placeholder="Masukkan nama menu ..."
                    keyboardType="default"
                    left="food"
                    value={data.menuBranch.name}
                  />
                  <FormInput
                    label="Harga reguler"
                    placeholder="Masukkan harga reguler ..."
                    keyboardType="numeric"
                    left="cash-multiple"
                    value={
                      data.menuBranch.baseprice
                        ? data.menuBranch.baseprice.toString()
                        : ''
                    }
                    onChangeText={text =>
                      setData(prev => ({
                        ...prev,
                        menuBranch: {...prev.menuBranch, baseprice: text},
                      }))
                    }
                    error={form.errorReguler}
                    hasError={form.hasErrorReguler}
                  />
                  <FormInput
                    label="Harga online"
                    placeholder="Masukkan harga online ..."
                    keyboardType="numeric"
                    left="cash-multiple"
                    value={
                      data.menuBranch.baseonlineprice
                        ? data.menuBranch.baseonlineprice.toString()
                        : ''
                    }
                    onChangeText={text =>
                      setData(prev => ({
                        ...prev,
                        menuBranch: {...prev.menuBranch, baseonlineprice: text},
                      }))
                    }
                    error={form.errorOnline}
                    hasError={form.hasErrorOnline}
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
                      // setSelected={text => setMenu({...menu, category: text})}
                      setSelected={text =>
                        setData(prev => ({
                          ...prev,
                          menuBranch: {...prev.menuBranch, category: text},
                        }))
                      }
                      boxStyles={styles.boxStyles}
                      dropdownStyles={styles.dropdownStyles}
                      searchPlaceholder="Cari kategori menu..."
                      placeholder="Pilih kategori menu"
                      inputStyles={{color: 'black'}}
                      dropdownTextStyles={styles.dropdownTextStyles}
                      defaultOption={{
                        key: data.menuBranch.category,
                        value: data.menuBranch.category,
                      }}
                    />
                    <HelperText type="error" visible={form.hasErrorCategory}>
                      {`Error: ${form.errorCategory}`}
                    </HelperText>
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
