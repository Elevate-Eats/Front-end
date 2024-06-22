import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import PostData from '../../../utils/postData';
import {MANAGER_ENDPOINT} from '@env';
import {
  AddPhoto,
  ConstButton,
  DeleteButton,
  FormInput,
} from '../../../components';
import {Colors} from '../../../utils/colors';
import {SelectList} from 'react-native-dropdown-select-list';
import {PostAPI} from '../../../api';

const EditManager = ({route}) => {
  const navigation = useNavigation();
  const {item} = route.params;
  const [data, setData] = useState({
    loading: false,
    manager: [],
    error: null,
  });

  const roles = [
    {key: 'general_manager', value: 'general_manager'},
    {key: 'area_manager', value: 'area_manager'},
    {key: 'store_manager', value: 'store_manager'},
  ];

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
      branchAccess = '{1}';
    } else if (managerRole === 'store_manager') {
      branchAccess = '{2}';
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

    try {
      setData(prev => ({...prev, loading: true}));
      const response = await PostData({
        operation: MANAGER_ENDPOINT,
        endpoint: 'updateManager',
        payload: payload,
      });
      if (response) {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
        navigation.goBack();
      }
    } catch (error) {
      ToastAndroid.show('Failed to update manager', ToastAndroid.SHORT);
    } finally {
      setData(prev => ({...prev, loading: false}));
    }
  }

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        setData(prev => ({
          ...prev,
          loading: true,
        }));
        try {
          // const response = await PostData({
          //   operation: MANAGER_ENDPOINT,
          //   endpoint: 'showSingleManager',
          //   payload: {id: item.id},
          // });
          const response = await PostAPI({
            operation: MANAGER_ENDPOINT,
            endpoint: 'showSingleManager',
            payload: {id: item.id},
          });
          if (response.status === 200) {
            setData(prev => ({...prev, manager: response.data.managerData}));
          }
        } catch (error) {
          setData(prev => ({...prev, error: 'Manager not found', manager: []}));
        } finally {
          setData(prev => ({...prev, loading: false}));
        }
      }
      fetchData();
    }, [data.manager?.length]),
  );

  return (
    <KeyboardAvoidingView enabled style={styles.container}>
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
            />
            <View style={{marginTop: 30}}>
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
});
