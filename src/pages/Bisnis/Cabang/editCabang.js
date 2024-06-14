import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors} from '../../../utils/colors';
import {
  AddPhoto,
  ConstButton,
  DeleteButton,
  FormInput,
  LoadingIndicator,
  ModalContent,
} from '../../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text} from 'react-native-paper';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {deleteBranch as delBranch} from '../../../redux/branchSlice';

import {BRANCH_ENDPOINT} from '@env';
import {PostAPI} from '../../../api';

const EditCabang = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {item} = route.params; // prev page
  const [modal, setModal] = useState(false); // open Modal content
  const [employee, setEmployee] = useState({}); // dari database
  const [selectedEmp, setSelectedEmp] = useState([]);

  const [data, setData] = useState({
    branch: {},
    loading: false,
  });

  const [form, setForm] = useState({
    errorName: '',
    errorAddress: '',
    errorPhone: '',
    hasErrorName: false,
    hasErrorAddress: false,
    hasErrorPhone: false,
  });

  function resetFormError(params) {
    setForm(prev => ({
      ...prev,
      errorName: '',
      errorAddress: '',
      errorPhone: '',
      hasErrorName: false,
      hasErrorAddress: false,
      hasErrorPhone: false,
    }));
  }
  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        setData(prev => ({...prev, loading: true}));
        try {
          const response = await PostAPI({
            operation: BRANCH_ENDPOINT,
            endpoint: 'showSingleBranch',
            payload: {id: item.id},
          });
          if (response.status === 200) {
            setData(prev => ({...prev, branch: response.data.branchData}));
          }
        } catch (error) {
        } finally {
          setData(prev => ({...prev, loading: false}));
        }
      }
      fetchData();
    }, []),
  );
  async function reciveID(key) {
    const newEmp = key.map(k => {
      return {...k, branchid: branch.id};
    });
    setSelectedEmp(selectedEmp.concat(newEmp));
  }

  const updateBranch = async () => {
    resetFormError();
    setData(prev => ({...prev, loading: true}));
    const payload = {
      id: item.id,
      name: data.branch.name,
      phone: data.branch.phone,
      address: data.branch.address,
    };
    try {
      const response = await PostAPI({
        operation: BRANCH_ENDPOINT,
        endpoint: 'updateBranch',
        payload: payload,
      });
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      const fullMessage = error.response?.data?.details;
      fullMessage.forEach(item => {
        if (item.includes('"name"')) {
          const error = 'name is required';
          setForm(prev => ({...prev, errorName: error, hasErrorName: true}));
        } else if (item.includes('"address"')) {
          const error = 'address is required';
          setForm(prev => ({
            ...prev,
            errorAddress: error,
            hasErrorAddress: true,
          }));
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
    } finally {
      setData(prev => ({...prev, loading: false}));
    }
  };

  async function deleteBranch() {
    async function handleDelete() {
      try {
        setData(prev => ({...prev, loading: true}));
        const response = await PostAPI({
          operation: BRANCH_ENDPOINT,
          endpoint: 'deleteBranch',
          payload: {id: item.id},
        });
        if (response.status === 200) {
          dispatch(delBranch(item.id));
          ToastAndroid.show(
            `${data.branch.name} successfully deleted`,
            ToastAndroid.SHORT,
          );
          navigation.goBack();
        }
      } catch (error) {
        ToastAndroid.show('Failed to Delete', ToastAndroid.SHORT);
      }
    }
    // !-------------------------
    Alert.alert(
      'Branch Deleted',
      `Delete ${data.branch.name} ?`,
      [{text: 'Cancel'}, {text: 'OK', onPress: handleDelete}],
      {cancelable: true},
    );
  }

  async function deleteEmployee(emp) {
    const delEmp = Object.values(selectedEmp).map(k => {
      if (k.id === emp.id) {
        return {...k, branchid: null};
      }
      return k;
    });
    setSelectedEmp(delEmp);
  }

  if (data.loading) {
    return <LoadingIndicator />;
  }
  return (
    <KeyboardAvoidingView enabled style={styles.container}>
      <View style={styles.whiteLayer}>
        <ScrollView>
          <AddPhoto icon="storefront" />
          <View style={{marginTop: 30}}>
            <Text variant="titleLarge" style={{fontWeight: '700'}}>
              Informasi Cabang
            </Text>
            <FormInput
              label="Nama Cabang"
              placeholder="masukkan nama cabang ..."
              keyboardType="default"
              left="storefront-outline"
              value={data.branch.name}
              onChangeText={text =>
                setData(prev => ({
                  ...prev,
                  branch: {...prev.branch, name: text},
                }))
              }
              secureTextEntry={false}
              hasError={form.hasErrorName}
              error={form.errorName}
            />
            <FormInput
              label="No. Telepon Cabang"
              placeholder="masukkan no. telepon cabang ..."
              keyboardType="phone-pad"
              left="phone-outline"
              value={data.branch.phone}
              onChangeText={text =>
                setData(prev => ({
                  ...prev,
                  branch: {...prev.branch, phone: text},
                }))
              }
              secureTextEntry={false}
              hasError={form.hasErrorPhone}
              error={form.errorPhone}
            />
            <FormInput
              label="Alamat Cabang"
              placeholder="masukkan alamat cabang ..."
              keyboardType="default"
              left="map-marker-outline"
              value={data.branch.address}
              onChangeText={text =>
                setData(prev => ({
                  ...prev,
                  branch: {...prev.branch, address: text},
                }))
              }
              secureTextEntry={false}
              hasError={form.hasErrorAddress}
              error={form.errorAddress}
            />
          </View>

          <View style={styles.listEmp}>
            <Text variant="titleLarge" style={{fontWeight: '700', flex: 1}}>
              Pegawai
            </Text>
            <TouchableOpacity
              onPress={() => setModal(true)}
              style={{borderWidth: 1.3, borderColor: 'grey', borderRadius: 5}}>
              <Text variant="labelLarge" style={styles.btnListEmp}>
                Pilih Pegawai
              </Text>
            </TouchableOpacity>
            <ModalContent
              open={modal}
              close={() => setModal(false)}
              data={employee}
              id={item}
              onClose={reciveID}
            />
          </View>
          {selectedEmp
            .filter(emp => emp.branchid === branch.id)
            .map(emp => {
              return (
                <View key={emp.id} style={styles.itemEmp}>
                  <Text variant="titleMedium" style={{flex: 1}}>
                    {emp.name}
                  </Text>
                  <TouchableOpacity onPress={() => deleteEmployee(emp)}>
                    <Ionicons
                      name="trash-bin"
                      color={Colors.deleteColor}
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
        </ScrollView>
        <View style={{flexDirection: 'row', columnGap: 10}}>
          <DeleteButton onPress={() => deleteBranch()} />
          <View style={{flex: 1}}>
            <ConstButton
              title="Simpan"
              onPress={() => updateBranch()}
              loading={data.loading}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditCabang;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  whiteLayer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    elevation: 1,
    padding: 10,
  },
  btnListEmp: {
    color: 'grey',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  listEmp: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemEmp: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
});
