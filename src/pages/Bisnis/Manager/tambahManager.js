import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {HelperText, Text, useTheme} from 'react-native-paper';
import React, {useState} from 'react';
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
import PostData from '../../../utils/postData';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL, MANAGER_ENDPOINT} from '@env';

const TambahManager = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const [data, setData] = useState({
    manager: {},
    loading: false,
    error: null,
    visible: true,
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

  async function addManager(managerRole) {
    resetFormError();
    let branchAccess;
    if (managerRole === 'general_manager') {
      branchAccess = '{all}';
    } else if (managerRole === 'area_manager') {
      branchAccess = '{1}';
    } else if (managerRole === 'store_manager') {
      branchAccess = '{2}';
    }

    const token = await AsyncStorage.getItem('userToken');
    const payload = {
      ...data.manager,
      branchAccess: branchAccess,
    };
    try {
      setData(prev => ({...prev, loading: true}));
      const response = await axios.post(
        `${API_URL}/${MANAGER_ENDPOINT}/addManager`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      const fullMessage = error.response?.data?.details;
      console.log('full message: ', fullMessage);
      fullMessage.some(item => {
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
        } else if (item.includes('"role"')) {
          const error = 'role is required';
          setForm(prev => ({...prev, errorRole: error, hasErrorRole: true}));
        } else if (item.includes('"email"')) {
          const error = 'email is required';
          setForm(prev => ({...prev, errorEmail: error, hasErrorEmail: true}));
          if (item.includes('valid')) {
            const error = 'must be a valid email';
            setForm(prev => ({
              ...prev,
              errorEmail: error,
              hasErrorEmail: true,
            }));
          }
        } else if (item.includes('"password"')) {
          const error = 'password is required';
          setForm(prev => ({
            ...prev,
            errorPassword: error,
            hasErrorPassword: true,
          }));
          if (payload.password?.length < 8) {
            const error = 'password length must be at least 8 characters long';
            setForm(prev => ({
              ...prev,
              errorPassword: error,
              hasErrorPassword: true,
            }));
          }
        } else if (item.includes('"phone"')) {
          const error = 'phone number is required';
          setForm(prev => ({
            ...prev,
            errorPhone: error,
            hasErrorPhone: true,
          }));
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
        } else if (payload.passwordConfirm !== payload.password) {
          const error = `password doesn't match`;
          setForm(prev => ({
            ...prev,
            errorConfirmPassword: error,
            hasErrorConfirmPassword: true,
          }));
        } else if (!payload.passwordConfirm) {
          const error = 'confirm password is required';
          setForm(prev => ({
            ...prev,
            errorConfirmPassword: error,
            hasErrorConfirmPassword: true,
          }));
        }
      });
      console.log('payload: ', payload);
    } finally {
      setData(prev => ({...prev, loading: false}));
    }
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
            <View style={{marginVertical: 30}}>
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
          </View>
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
});
