import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useState} from 'react';
import {MANAGER_ENDPOINT} from '@env';
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

const TambahManager = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({
    manager: [],
    loading: false,
    error: null,
    visible: true,
  });

  const roles = [
    {key: 'general_manager', value: 'general_manager'},
    {key: 'area_manager', value: 'area_manager'},
    {key: 'store_manager', value: 'store_manager'},
  ];

  async function addManager(managerRole) {
    let branchAccess;
    if (managerRole === 'general_manager') {
      branchAccess = '{all}';
    } else if (managerRole === 'area_manager') {
      branchAccess = '{1}';
    } else if (managerRole === 'store_manager') {
      branchAccess = '{2}';
    }

    const payload = {
      ...data.manager,
      branchAccess: branchAccess,
    };
    try {
      setData(prev => ({...prev, loading: true}));
      const response = await PostData({
        operation: MANAGER_ENDPOINT,
        endpoint: 'addManager',
        payload: payload,
      });
      if (response) {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      ToastAndroid.show('Failed to add manager', ToastAndroid.SHORT);
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
            <View style={{marginTop: 30}}>
              <Text variant="titleLarge" style={{fontWeight: '700'}}>
                Account Manager
              </Text>
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
              />
              <FormInput
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
                boxStyles={styles.boxStyles}
                dropdownStyles={styles.dropdownStyles}
                placeholder="Pilih role"
                searchPlaceholder="Cari role ..."
                inputStyles={{color: 'black'}}
                dropdownTextStyles={styles.dropdownTextStyles}
              />
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
