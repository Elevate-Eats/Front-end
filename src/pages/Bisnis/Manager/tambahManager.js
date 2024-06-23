import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {HelperText, Text, useTheme} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {
  AddPhoto,
  ConstButton,
  DeleteButton,
  FormInput,
} from '../../../components';
import {Colors} from '../../../utils/colors';
import EyeOpen from '../../../assets/icons/eye-gray-outline.svg';
import EyeClose from '../../../assets/icons/eye-slash-grey-outline.svg';
import {SelectList} from 'react-native-dropdown-select-list';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL, MANAGER_ENDPOINT, BRANCH_ENDPOINT} from '@env';
import {GetAPI, PostAPI} from '../../../api';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';

const TambahManager = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [data, setData] = useState({
    manager: {},
    loading: false,
    error: null,
    visible: true,
    branch: [],
    selectBranch: [],
  });

  const [dropdown, setDropdown] = useState({
    focus: false,
    value: null,
  });

  const [form, setForm] = useState({
    errorName: '',
    errorNickname: '',
    errorPhone: '',
    errorEmail: '',
    errorPassword: '',
    errorRole: '',
    errorConfirmPassword: '',
    hasErrorName: false,
    hasErrorNickaname: false,
    hasErrorPhone: false,
    hasErrorEmail: false,
    hasErrorPassword: false,
    hasErrorConfirmPassword: false,
    hasErrorRole: false,
  });

  function resetFormError(params) {
    setForm(prev => ({
      ...prev,
      errorName: '',
      errorNickname: '',
      errorPhone: '',
      errorEmail: '',
      errorPassword: '',
      errorConfirmPassword: '',
      errorRole: '',
      hasErrorName: false,
      hasErrorNickaname: false,
      hasErrorPhone: false,
      hasErrorEmail: false,
      hasErrorPassword: false,
      hasErrorConfirmPassword: false,
      hasErrorRole: false,
    }));
  }

  const roles = [
    {key: 'general_manager', value: 'general_manager'},
    {key: 'area_manager', value: 'area_manager'},
    {key: 'store_manager', value: 'store_manager'},
  ];

  useEffect(() => {
    async function fetchData(params) {
      const response = await GetAPI({
        operation: BRANCH_ENDPOINT,
        endpoint: 'showBranches',
      }).catch(error => console.log('error: ', error.response.data));
      if (response.status === 200) {
        setData(prev => ({...prev, branch: response.data.branchData}));
      }
    }
    fetchData();
  }, []);

  function createBranchAccess(data) {
    const ids = data.map(item => item.id);
    const branchaccess = `{${ids.join(',')}}`;
    return branchaccess;
  }

  async function addManager(managerRole) {
    resetFormError();
    let branchAccess;
    if (managerRole === 'general_manager') {
      branchAccess = createBranchAccess(data.branch);
    } else if (managerRole === 'area_manager') {
      branchAccess = createBranchAccess(data.selectBranch);
    } else if (managerRole === 'store_manager') {
      branchAccess = createBranchAccess(data.selectBranch);
    }
    // console.log('branch access: ', branchAccess);

    const payload = {
      ...data.manager,
      branchAccess: branchAccess,
    };
    console.log('payload: ', payload);
    // try {
    //   setData(prev => ({...prev, loading: true}));
    //   const response = await PostAPI({
    //     operation: MANAGER_ENDPOINT,
    //     endpoint: 'addManager',
    //     payload: payload,
    //   });
    //   if (response.status === 200) {
    //     ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
    //     navigation.goBack();
    //   }
    // } catch (error) {
    //   const fullMessage = error.response?.data?.details;
    //   console.log('full message: ', fullMessage);
    //   fullMessage.some(item => {
    //     if (item.includes('"name"')) {
    //       const error = 'name is required';
    //       setForm(prev => ({...prev, errorName: error, hasErrorName: true}));
    //     } else if (item.includes('"nickname"')) {
    //       const error = 'nickname is required';
    //       setForm(prev => ({
    //         ...prev,
    //         errorNickname: error,
    //         hasErrorNickaname: true,
    //       }));
    //     } else if (item.includes('"role"')) {
    //       const error = 'role is required';
    //       setForm(prev => ({...prev, errorRole: error, hasErrorRole: true}));
    //     } else if (item.includes('"email"')) {
    //       const error = 'email is required';
    //       setForm(prev => ({...prev, errorEmail: error, hasErrorEmail: true}));
    //       if (item.includes('valid')) {
    //         const error = 'must be a valid email';
    //         setForm(prev => ({
    //           ...prev,
    //           errorEmail: error,
    //           hasErrorEmail: true,
    //         }));
    //       }
    //     } else if (item.includes('"password"')) {
    //       const error = 'password is required';
    //       setForm(prev => ({
    //         ...prev,
    //         errorPassword: error,
    //         hasErrorPassword: true,
    //       }));
    //       if (payload.password?.length < 8) {
    //         const error = 'password length must be at least 8 characters long';
    //         setForm(prev => ({
    //           ...prev,
    //           errorPassword: error,
    //           hasErrorPassword: true,
    //         }));
    //       }
    //     } else if (item.includes('"phone"')) {
    //       const error = 'phone number is required';
    //       setForm(prev => ({
    //         ...prev,
    //         errorPhone: error,
    //         hasErrorPhone: true,
    //       }));
    //       if (item.includes('empty')) {
    //         const error = 'phone number is required';
    //         setForm(prev => ({
    //           ...prev,
    //           errorPhone: error,
    //           hasErrorPhone: true,
    //         }));
    //       } else if (item.includes('fails')) {
    //         if (payload.phone.length < 9) {
    //           const error = 'phone number must be longer than 9 number';
    //           setForm(prev => ({
    //             ...prev,
    //             errorPhone: error,
    //             hasErrorPhone: true,
    //           }));
    //         } else {
    //           const error = `invalid phone number it's should +62`;
    //           setForm(prev => ({
    //             ...prev,
    //             errorPhone: error,
    //             hasErrorPhone: true,
    //           }));
    //         }
    //       }
    //     } else if (payload.passwordConfirm !== payload.password) {
    //       const error = `password doesn't match`;
    //       setForm(prev => ({
    //         ...prev,
    //         errorConfirmPassword: error,
    //         hasErrorConfirmPassword: true,
    //       }));
    //     } else if (!payload.passwordConfirm) {
    //       const error = 'confirm password is required';
    //       setForm(prev => ({
    //         ...prev,
    //         errorConfirmPassword: error,
    //         hasErrorConfirmPassword: true,
    //       }));
    //     }
    //   });
    // } finally {
    //   setData(prev => ({...prev, loading: false}));
    // }
  }

  function removeSelectedBranch(id) {
    setData(prev => ({
      ...prev,
      selectBranch: prev.selectBranch.filter(branch => branch.id !== id),
    }));
  }
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.whiteLayer}>
        <ScrollView>
          <AddPhoto icon="person" />
          <View style={{marginTop: 30}}>
            <Text variant="titleLarge" style={{fontWeight: '700'}}>
              Informasi Manager
            </Text>

            <FormInput
              hasError={form.hasErrorName}
              error={form.errorName}
              label="Nama Manager"
              placeholder="masukkan nama manager ..."
              keyboardType="default"
              left="account"
              secureTextEntry={false}
              value={data.manager.name}
              onChangeText={text =>
                setData(prev => ({
                  ...prev,
                  manager: {...prev.manager, name: text},
                }))
              }
            />
            <FormInput
              hasError={form.hasErrorNickaname}
              error={form.errorNickname}
              label="Nickname Manager"
              placeholder="masukkan nickname manager ..."
              keyboardType="default"
              left="account"
              secureTextEntry={false}
              value={data.manager.nickname}
              onChangeText={text =>
                setData(prev => ({
                  ...prev,
                  manager: {...prev.manager, nickname: text},
                }))
              }
            />
            <FormInput
              hasError={form.hasErrorPhone}
              error={form.errorPhone}
              label="No. HP Manager"
              placeholder="masukkan no HP manager ..."
              keyboardType="phone-pad"
              left="phone"
              secureTextEntry={false}
              value={data.manager.phone}
              onChangeText={text =>
                setData(prev => ({
                  ...prev,
                  manager: {...prev.manager, phone: text},
                }))
              }
            />
            <View style={{marginTop: 10}}>
              <Text variant="titleLarge" style={{fontWeight: '700'}}>
                Akun Manager
              </Text>
              <FormInput
                hasError={form.hasErrorEmail}
                error={form.errorEmail}
                label="Email Manager"
                placeholder="masukkan email manager ..."
                keyboardType="email-address"
                left="email"
                secureTextEntry={false}
                value={data.manager.email}
                onChangeText={text =>
                  setData(prev => ({
                    ...prev,
                    manager: {...prev.manager, email: text},
                  }))
                }
              />
              <FormInput
                hasError={form.hasErrorPassword}
                error={form.errorPassword}
                label="Password"
                placeholder="masukkan password ..."
                keyboardType="default"
                left="lock"
                secureTextEntry={data.visible}
                value={data.manager.password}
                onChangeText={text =>
                  setData(prev => ({
                    ...prev,
                    manager: {...prev.manager, password: text},
                  }))
                }
              />
              <FormInput
                hasError={form.hasErrorConfirmPassword}
                error={form.errorConfirmPassword}
                label="Confirm Password"
                placeholder="confirm password ..."
                keyboardType="default"
                left="lock"
                secureTextEntry={data.visible}
                value={data.manager.passwordConfirm}
                onChangeText={text =>
                  setData(prev => ({
                    ...prev,
                    manager: {...prev.manager, passwordConfirm: text},
                  }))
                }
              />
            </View>
            <TouchableOpacity
              onPress={() =>
                setData(prev => ({...prev, visible: !prev.visible}))
              }>
              {data.visible ? (
                <View style={styles.showPassword}>
                  <EyeClose width={25} height={25} />
                  <Text
                    variant="titleMedium"
                    style={{textDecorationLine: 'underline'}}>
                    Show password
                  </Text>
                </View>
              ) : (
                <View style={styles.showPassword}>
                  <EyeOpen width={25} height={25} />
                  <Text
                    variant="titleMedium"
                    style={{textDecorationLine: 'underline'}}>
                    Hide password
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={{marginTop: 30}}>
              <Text
                variant="titleLarge"
                style={{fontWeight: '700', marginBottom: 10}}>
                Role Manager
              </Text>
              <SelectList
                data={roles}
                save="value"
                setSelected={text =>
                  setData(prev => ({
                    ...prev,
                    manager: {...prev.manager, role: text},
                  }))
                }
                boxStyles={[
                  styles.boxStyles,
                  {
                    borderColor: form.hasErrorRole ? colors.error : 'grey',
                    backgroundColor: colors.background,
                  },
                ]}
                dropdownStyles={styles.dropdownStyles}
                placeholder="Pilih role"
                searchPlaceholder="Cari role ..."
                inputStyles={{color: 'black'}}
                dropdownTextStyles={styles.dropdownTextStyles}
              />
              <HelperText type="error" visible={form.hasErrorRole}>
                {`Error: ${form.errorRole}`}
              </HelperText>
            </View>
            {data.manager.role === 'area_manager' ||
            data.manager.role === 'store_manager' ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  marginBottom: 30,
                }}>
                <Text
                  variant="titleLarge"
                  style={{fontWeight: '700', marginBottom: 10}}>
                  Akses Cabang
                </Text>
                <Dropdown
                  mode="modal"
                  containerStyle={{width: 350}}
                  data={data.branch
                    .filter(
                      branch =>
                        !data.selectBranch.some(
                          selected => selected.id === branch.id,
                        ),
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))}
                  style={[
                    styles.dropdown,
                    {backgroundColor: colors.btnColorContainer},
                  ]}
                  placeholder="Pilih Cabang"
                  placeholderStyle={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: colors.onBtnColorContainer,
                    fontWeight: '600',
                  }}
                  search
                  labelField={'name'}
                  valueField={'id'}
                  searchPlaceholder="Search"
                  value={dropdown.value}
                  onFocus={() => setDropdown(prev => ({...prev, focus: true}))}
                  onBlur={() => setDropdown(prev => ({...prev, focus: false}))}
                  onChange={item => {
                    setDropdown(prev => ({
                      ...prev,
                      value: item.value,
                      focus: false,
                    }));
                    setData(prev => {
                      if (!prev.selectBranch.includes(item.id)) {
                        return {
                          ...prev,
                          selectBranch: [
                            ...prev.selectBranch,
                            {id: item.id, name: item.name},
                          ],
                        };
                      }
                      return prev;
                    });
                  }}
                  renderRightIcon={() => null}
                />
              </View>
            ) : null}
          </View>

          <Text style={[styles.listBranch]}>List branch</Text>
          {data.manager.role === 'general_manager' ? (
            Object.values(data.branch)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((branch, index) => {
                return (
                  <View key={branch.id}>
                    <View style={styles.itemBranch}>
                      <Text variant="titleMedium">{`${index + 1}. `}</Text>
                      <Text
                        variant="titleMedium"
                        style={{flex: 1, fontSize: 16}}>
                        {branch.name}
                      </Text>
                      <TouchableOpacity disabled>
                        <Icon name="trash" size={24} color={'grey'} />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
          ) : data.selectBranch.length !== 0 ? (
            data.selectBranch
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((branch, index) => {
                return (
                  <View key={branch.id}>
                    <View style={styles.itemBranch}>
                      <Text variant="titleMedium">{`${index + 1}. `}</Text>
                      <Text
                        variant="titleMedium"
                        style={{flex: 1, fontSize: 16}}>
                        {branch.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeSelectedBranch(branch.id)}>
                        <Icon
                          name="trash"
                          size={24}
                          color={Colors.deleteColor}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
          ) : (
            <View style={{marginBottom: 20}}>
              <Text style={{fontStyle: 'italic', alignSelf: 'center'}}>
                Manager ini belum memiliki akses cabang
              </Text>
            </View>
          )}
        </ScrollView>
        <ConstButton
          title="Tambah Manager"
          onPress={() => addManager(data.manager.role)}
          loading={data.loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default TambahManager;

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
  showPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
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
  dropdown: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: 'black',
    flex: 1,
  },
  itemBranch: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listBranch: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '700',
    color: 'green',
  },
});
