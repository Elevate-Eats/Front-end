import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import PostData from '../../../utils/postData';
import {MANAGER_ENDPOINT, BRANCH_ENDPOINT} from '@env';
import {
  AddPhoto,
  ConstButton,
  DeleteButton,
  FormInput,
} from '../../../components';
import {Colors} from '../../../utils/colors';
import {SelectList} from 'react-native-dropdown-select-list';
import {GetAPI, PostAPI} from '../../../api';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';

const EditManager = ({route}) => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const {item} = route.params;
  const [data, setData] = useState({
    loading: false,
    manager: [],
    error: null,
    branch: [],
    selectedBranch: [],
    oldBranch: [],
  });

  const [dropdown, setDropdown] = useState({
    focus: false,
    value: null,
  });

  const roles = [
    {key: 'general_manager', value: 'general_manager'},
    {key: 'area_manager', value: 'area_manager'},
    {key: 'store_manager', value: 'store_manager'},
  ];

  const [form, setForm] = useState({
    errorName: '',
    errorNickname: '',
    errorPhone: '',
    errorEmail: '',
    errorRole: '',
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
      hasErrorName: false,
      hasErrorNickaname: false,
      hasErrorPhone: false,
      hasErrorEmail: false,
    }));
  }

  async function deleteManager(params) {
    async function handleDelete(params) {
      setData(prev => ({...prev, loading: true}));
      try {
        const response = await PostData({
          operation: MANAGER_ENDPOINT,
          endpoint: 'deleteManager',
          payload: {id: item.id},
        });
        if (response) {
          ToastAndroid.show(
            `${data.manager.name} has been successfully deleted`,
            ToastAndroid.SHORT,
          );
          navigation.goBack();
        }
      } catch (error) {
        ToastAndroid.show(
          `${data.manager.name} failed to deleted`,
          ToastAndroid.SHORT,
        );
      } finally {
        setData(prev => ({...prev, loading: false}));
      }
    }
    Alert.alert('Delete Manager', `Delete ${data.manager.name} ?`, [
      {text: 'Cancel'},
      {text: 'OK', onPress: () => handleDelete()},
    ]);
  }

  async function updateManager(managerRole) {
    let branchAccess;
    if (managerRole === 'general_manager') {
      branchAccess = '{all}';
    } else if (managerRole === 'area_manager') {
      branchAccess = createBranchAccess(data.selectedBranch, data.oldBranch);
    } else if (managerRole === 'store_manager') {
      branchAccess = createBranchAccess(data.selectedBranch, data.oldBranch);
    }
    const payload = {
      id: data.manager.id,
      name: data.manager.name,
      nickname: data.manager.nickname,
      phone: data.manager.phone,
      role: data.manager.role,
      email: data.manager.email,
      branchAccess: branchAccess,
    };
    console.log('payload: ', payload);
    resetFormError();
    try {
      setData(prev => ({...prev, loading: true}));
      const response = await PostAPI({
        operation: MANAGER_ENDPOINT,
        endpoint: 'updateManager',
        payload: payload,
      });
      if (response.status === 200) {
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      const fullMessage = error.response?.data?.details;
      fullMessage?.forEach(item => {
        if (item.includes('"name"')) {
          const error = 'name is required';
          setForm(prev => ({...prev, errorName: error, hasErrorName: true}));
        } else if (item.includes('"nickname"')) {
          const error = 'nickname is required';
          setForm(prev => ({
            ...prev,
            errorNickname: error,
            hasErrorNickaname: true,
          }));
        } else if (item.includes('"email"')) {
          const error = 'email is required';
          setForm(prev => ({...prev, errorEmail: error, hasErrorEmail: true}));
        } else if (item.includes('"phone"')) {
          if (item.includes('empty')) {
            const error = 'phone number is required';
            setForm(prev => ({
              ...prev,
              errorPhone: error,
              hasErrorPhone: true,
            }));
          } else if (item.includes('fails')) {
            if (payload.phone.length < 9) {
              const error = 'phone number must be longer than 9 number';
              setForm(prev => ({
                ...prev,
                errorPhone: error,
                hasErrorPhone: true,
              }));
            } else {
              const error = `invalid phone number it's should +62`;
              setForm(prev => ({
                ...prev,
                errorPhone: error,
                hasErrorPhone: true,
              }));
            }
          }
        }
      });
      ToastAndroid.show('Failed to update manager', ToastAndroid.SHORT);
    } finally {
      setData(prev => ({...prev, loading: false}));
    }
  }

  useFocusEffect(
    //! fetch data API
    useCallback(() => {
      async function fetchData(params) {
        setData(prev => ({...prev, loading: true}));
        try {
          const response = await PostAPI({
            operation: MANAGER_ENDPOINT,
            endpoint: 'showSingleManager',
            payload: {id: item.id},
          });
          if (response.status === 200) {
            setData(prev => ({...prev, manager: response.data.managerData}));
          }
          const branch = await GetAPI({
            operation: BRANCH_ENDPOINT,
            endpoint: 'showBranches',
          });
          if (branch.status === 200) {
            setData(prev => ({...prev, branch: branch.data.branchData}));
          }
          // console.log('branch: ', branch.data);
        } catch (error) {
        } finally {
          setData(prev => ({...prev, loading: false}));
        }
      }
      fetchData();
    }, []),
  );

  useEffect(() => {
    if (
      data.manager?.role === 'area_manager' ||
      data.manager?.role === 'store_manager'
    ) {
      const branchAccess = data.manager?.branchaccess;
      const accessIds = branchAccess?.match(/\d+/g).map(Number);

      const filteredBranches = data.branch
        .filter(branch => accessIds.includes(branch.id))
        .map(branch => ({
          id: branch.id,
          name: branch.name,
        }));
      setData(prev => ({
        ...prev,
        oldBranch: filteredBranches,
      }));
    }
  }, [data.manager?.branchaccess, data.branch]);

  function createBranchAccess(newBranch, oldBranch) {
    const newBranchIds = newBranch.map(branch => branch.id);
    const oldBranchIds = oldBranch.map(branch => branch.id);

    const combinedBranchIds = [...newBranchIds, ...oldBranchIds];
    if (combinedBranchIds.length === 0) {
      return '{}';
    }

    const formatedIds = `{${combinedBranchIds.join(',')}}`;
    return formatedIds;
  }

  function listBranch(params) {
    const excludeBranch = new Set(
      [...data.oldBranch, ...data.selectedBranch].map(branch => branch.id),
    );
    return data.branch.filter(branch => !excludeBranch.has(branch.id));
  }

  function removeOldBranch(branch) {
    const filteredBranches = data.oldBranch.filter(
      item => item.id !== branch.id,
    );
    setData({...data, oldBranch: filteredBranches});
  }

  function removeNewBranch(branch) {
    const filteredBranches = data.selectedBranch.filter(
      item => item.id !== branch.id,
    );
    setData({...data, selectedBranch: filteredBranches});
  }
  return (
    <KeyboardAvoidingView enabled style={styles.container}>
      <View style={styles.whiteLayer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <AddPhoto icon="person" />
          <View style={{marginTop: 30}}>
            <Text variant="titleLarge" style={{fontWeight: '700'}}>
              Informasi Manager
            </Text>

            <FormInput
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
              hasError={form.hasErrorName}
              error={form.errorName}
            />
            <FormInput
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
              hasError={form.hasErrorNickaname}
              error={form.errorNickname}
            />
            <FormInput
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
              hasError={form.hasErrorEmail}
              error={form.errorEmail}
            />
            <FormInput
              label="No. HP Manager"
              placeholder="masukkan no HP manager ..."
              keyboardType="email-address"
              left="phone"
              secureTextEntry={false}
              value={data.manager.phone}
              onChangeText={text =>
                setData(prev => ({
                  ...prev,
                  manager: {...prev.manager, phone: text},
                }))
              }
              hasError={form.hasErrorPhone}
              error={form.errorPhone}
            />
            <View>
              <Text
                variant="titleLarge"
                style={{fontWeight: '700', marginVertical: 10}}>
                Roles Manager
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
                boxStyles={styles.boxStyles}
                dropdownStyles={styles.dropdownStyles}
                placeholder="Pilih role"
                searchPlaceholder="Cari role ..."
                inputStyles={{color: 'black'}}
                dropdownTextStyles={styles.dropdownTextStyles}
                defaultOption={{
                  key: data.manager.role,
                  value: data.manager.role,
                }}
              />
            </View>

            {data.manager.role === 'general_manager' ? ( //! GENERAL MANAGER
              data.branch
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item, index) => {
                  return (
                    <View key={item.id} style={styles.itemBranch}>
                      <Text
                        variant="titleMedium"
                        style={{fontSize: 16}}>{`${index + 1}. `}</Text>
                      <Text
                        variant="titleMedium"
                        style={{flex: 1, fontSize: 16}}>
                        {item.name}
                      </Text>
                      <TouchableOpacity disabled>
                        <Icon name="trash" color={'grey'} size={24} />
                      </TouchableOpacity>
                    </View>
                  );
                })
            ) : data.manager.role === 'area_manager' ? ( //! AREA MANAGER
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                    marginVertical: 30,
                  }}>
                  <Text
                    variant="titleLarge"
                    style={{fontWeight: '700', marginBottom: 10}}>
                    Akses Cabang
                  </Text>
                  <Dropdown
                    mode="modal"
                    containerStyle={{width: 350}}
                    data={listBranch()}
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
                    searchPlaceholder="Search..."
                    value={dropdown.value}
                    onFocus={() =>
                      setDropdown(prev => ({...prev, focus: true}))
                    }
                    onBlur={() =>
                      setDropdown(prev => ({...prev, focus: false}))
                    }
                    onChange={item => {
                      setDropdown(prev => ({
                        ...prev,
                        value: item.value,
                        focus: false,
                      }));
                      setData(prev => {
                        if (!prev.selectedBranch.includes(item.id)) {
                          return {
                            ...prev,
                            selectedBranch: [
                              ...prev.selectedBranch,
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
                <Text
                  style={[styles.oldNewBranch, {color: Colors.deleteColor}]}>
                  Cabang Lama
                </Text>
                {data.oldBranch.length !== 0 ? (
                  data.oldBranch.map((item, index) => (
                    <View key={item.id} style={styles.itemBranch}>
                      <Text variant="titleMedium">{`${index + 1}. `}</Text>
                      <Text
                        variant="titleMedium"
                        style={{flex: 1, fontSize: 16}}>
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          Alert.alert(
                            'Delete Branch',
                            `Are tou sure to delete ${item.name}? `,
                            [
                              {text: 'Cancel'},
                              {
                                text: 'OK',
                                onPress: () => removeOldBranch(item),
                              },
                            ],
                          )
                        }>
                        <Icon
                          name="trash"
                          color={Colors.deleteColor}
                          size={24}
                        />
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <View style={{marginBottom: 25}}>
                    <Text style={{fontStyle: 'italic', alignSelf: 'center'}}>
                      Manager belum memiliki akses cabang
                    </Text>
                  </View>
                )}
                <Text style={[styles.oldNewBranch, {color: 'green'}]}>
                  Cabang Baru
                </Text>
                {data.selectedBranch.length !== 0 ? (
                  data.selectedBranch.map((item, index) => (
                    <View key={item.id} style={styles.itemBranch}>
                      <Text variant="titleMedium">{`${index + 1}. `}</Text>
                      <Text
                        variant="titleMedium"
                        style={{flex: 1, fontSize: 16}}>
                        {item.name}
                      </Text>
                      <TouchableOpacity onPress={() => removeNewBranch(item)}>
                        <Icon
                          name="trash"
                          color={Colors.deleteColor}
                          size={24}
                        />
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <View style={{marginBottom: 25}}>
                    <Text style={{fontStyle: 'italic', alignSelf: 'center'}}>
                      Tekan{' '}
                      <Text style={{fontWeight: '900', fontStyle: 'italic'}}>
                        Pilih Cabang
                      </Text>{' '}
                      untuk menambahkan cabang
                    </Text>
                  </View>
                )}
              </View>
            ) : data.oldBranch.length !== 0 ? ( //! STORE MANAGER
              <View style={{marginTop: 30, gap: 10}}>
                <Text
                  variant="titleLarge"
                  style={{fontWeight: '700', marginBottom: 10}}>
                  Akses Cabang
                </Text>
                {data.oldBranch.map((item, index) => (
                  <View key={item.id} style={styles.itemBranch}>
                    <Text variant="titleMedium">{`${index + 1}. `}</Text>
                    <Text variant="titleMedium" style={{flex: 1, fontSize: 16}}>
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          'Delete Branch',
                          `Are tou sure to delete ${item.name}? `,
                          [
                            {text: 'Cancel'},
                            {
                              text: 'OK',
                              onPress: () => removeOldBranch(item),
                            },
                          ],
                        )
                      }>
                      <Icon name="trash" color={Colors.deleteColor} size={24} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                    marginVertical: 30,
                  }}>
                  <Text
                    variant="titleLarge"
                    style={{fontWeight: '700', marginBottom: 10}}>
                    Akses Cabang
                  </Text>
                  {data.selectedBranch.length < 1 ? (
                    <Dropdown
                      mode="modal"
                      containerStyle={{width: 350}}
                      data={listBranch()}
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
                      searchPlaceholder="Search..."
                      value={dropdown.value}
                      onFocus={() =>
                        setDropdown(prev => ({...prev, focus: true}))
                      }
                      onBlur={() =>
                        setDropdown(prev => ({...prev, focus: false}))
                      }
                      onChange={item => {
                        setDropdown(prev => ({
                          ...prev,
                          value: item.value,
                          focus: false,
                        }));
                        setData(prev => {
                          if (!prev.selectedBranch.includes(item.id)) {
                            return {
                              ...prev,
                              selectedBranch: [
                                ...prev.selectedBranch,
                                {id: item.id, name: item.name},
                              ],
                            };
                          }
                          return prev;
                        });
                      }}
                      renderRightIcon={() => null}
                    />
                  ) : null}
                </View>
                {data.selectedBranch.length !== 0 ? (
                  data.selectedBranch.map((item, index) => (
                    <View key={item.id} style={styles.itemBranch}>
                      <Text variant="titleMedium">{`${index + 1}. `}</Text>
                      <Text
                        variant="titleMedium"
                        style={{flex: 1, fontSize: 16}}>
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          Alert.alert(
                            'Delete Branch',
                            `Are tou sure to delete ${item.name}? `,
                            [
                              {text: 'Cancel'},
                              {
                                text: 'OK',
                                onPress: () => removeNewBranch(item),
                              },
                            ],
                          )
                        }>
                        <Icon
                          name="trash"
                          color={Colors.deleteColor}
                          size={24}
                        />
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <View style={{marginBottom: 25}}>
                    <Text style={{fontStyle: 'italic', alignSelf: 'center'}}>
                      Manager belum memiliki akses cabang
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* {
              data.manager.role === 'general_manager' ? (
                data.branch
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((item, index) => {
                    return (
                      <View key={item.id} style={styles.itemBranch}>
                        <Text
                          variant="titleMedium"
                          style={{fontSize: 16}}>{`${index + 1}. `}</Text>
                        <Text
                          variant="titleMedium"
                          style={{flex: 1, fontSize: 16}}>
                          {item.name}
                        </Text>
                        <TouchableOpacity disabled>
                          <Icon name="trash" color={'grey'} size={24} />
                        </TouchableOpacity>
                      </View>
                    );
                  })
              ) : data.manager.role === 'area_manager' ? (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 20,
                      alignItems: 'center',
                      marginTop: 25,
                    }}>
                    <Text variant="titleLarge" style={{fontWeight: '700'}}>
                      Akses Cabang
                    </Text>
                    <Dropdown
                      mode="modal"
                      containerStyle={{width: 350}}
                      // data={data.branch.filter(
                      //   item =>
                      //     !parseBranchAccess(data.manager.branchaccess).includes(
                      //       item.id,
                      //     ),
                      // )}
                      data={data.branch}
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
                      searchPlaceholder="Search..."
                      value={dropdown.value}
                      onFocus={() =>
                        setDropdown(prev => ({...prev, focus: true}))
                      }
                      onBlur={() =>
                        setDropdown(prev => ({...prev, focus: false}))
                      }
                      onChange={item => {
                        setDropdown(prev => ({
                          ...prev,
                          value: item.value,
                          focus: false,
                        }));
                        setData(prev => {
                          if (!prev.selectedBranch.includes(item.id)) {
                            return {
                              ...prev,
                              selectedBranch: [
                                ...prev.selectedBranch,
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
                  <View>
                    <Text
                      style={[
                        styles.oldNewBranch,
                        {color: Colors.deleteColor},
                      ]}>
                      Cabang Lama
                    </Text>
                    {Object.values(oldBranch)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((item, index) => {
                        return (
                          <View key={item.id} style={styles.itemBranch}>
                            <Text variant="titleMedium">{`${index + 1}. `}</Text>
                            <Text variant="titleMedium" style={{flex: 1}}>
                              {item.name}
                            </Text>
                            <TouchableOpacity>
                              <Icon
                                name="trash"
                                color={Colors.deleteColor}
                                size={24}
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    <Text style={[styles.oldNewBranch, {color: 'green'}]}>
                      Cabang Baru
                    </Text>
                    {Object.values(data.selectedBranch)
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((item, index) => {
                        return (
                          <View key={item.id} style={styles.itemBranch}>
                            <Text variant="titleMedium">{`${index + 1}. `}</Text>
                            <Text
                              variant="titleMedium"
                              style={{flex: 1, fontSize: 16}}>
                              {item.name}
                            </Text>
                            <TouchableOpacity>
                              <Icon
                                name="trash"
                                color={Colors.deleteColor}
                                size={24}
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                  </View>
                </View>
              ) : data.selectedBranch.length !== 0 ? (
                data.selectedBranch.map((item, index) => (
                  <View key={item.id} style={styles.itemBranch}>
                    <Text variant="titleMedium">{`${index + 1}. `}</Text>
                    <Text variant="titleMedium" style={{flex: 1}}>
                      {item.name}
                    </Text>
                    <TouchableOpacity>
                      <Icon name="trash" color={Colors.deleteColor} size={24} />
                    </TouchableOpacity>
                  </View>
                ))
              ) : oldBranch.length !== 0 ? (
                oldBranch.map((item, index) => {
                  return (
                    <View key={item.id} style={styles.itemBranch}>
                      <Text variant="titleMedium">{`${index + 1}. `}</Text>
                      <Text
                        variant="titleMedium"
                        style={{flex: 1, fontSize: 16}}>
                        {item.name}
                      </Text>
                      <TouchableOpacity>
                        <Icon
                          name="trash"
                          size={24}
                          color={Colors.deleteColor}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                    marginVertical: 30,
                  }}>
                  <Text
                    variant="titleLarge"
                    style={{fontWeight: '700', marginBottom: 10}}>
                    Akses Cabang
                  </Text>
                  <Dropdown
                    mode="modal"
                    containerStyle={{width: 350}}
                    data={data.branch}
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
                    searchPlaceholder="Search..."
                    value={dropdown.value}
                    onFocus={() =>
                      setDropdown(prev => ({...prev, focus: true}))
                    }
                    onBlur={() =>
                      setDropdown(prev => ({...prev, focus: false}))
                    }
                    onChange={item => {
                      setDropdown(prev => ({
                        ...prev,
                        value: item.value,
                        focus: false,
                      }));
                      setData(prev => {
                        if (!prev.selectedBranch.includes(item.id)) {
                          return {
                            ...prev,
                            selectedBranch: [
                              ...prev.selectedBranch,
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
              )
              // <View>
              //   {oldBranch.map((item, index) => {
              //     return (
              //       <View key={item.id} style={styles.itemBranch}>
              //         <Text variant="titleMedium">{`${index + 1}. `}</Text>
              //         <Text
              //           variant="titleMedium"
              //           style={{flex: 1, fontSize: 16}}>
              //           {item.name}
              //         </Text>
              //         <TouchableOpacity>
              //           <Icon
              //             name="trash"
              //             color={Colors.deleteColor}
              //             size={24}
              //           />
              //         </TouchableOpacity>
              //       </View>
              //     );
              //   })}
              // </View>
            } */}
          </View>
        </ScrollView>
        <View style={{flexDirection: 'row', columnGap: 10}}>
          <DeleteButton onPress={deleteManager} />
          <View style={{flex: 1}}>
            <ConstButton
              title="Update Manager"
              onPress={() => updateManager(data.manager.role)}
              loading={data.loading}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditManager;

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
  dropdown: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: 'black',
    flex: 1,
  },
  itemBranch: {
    // paddingVertical: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  oldNewBranch: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '700',
  },
});
