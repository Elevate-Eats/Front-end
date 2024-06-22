import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors} from '../../../utils/colors';
import {
  AddPhoto,
  ConstButton,
  DeleteButton,
  FormInput,
} from '../../../components';
import {Text, useTheme} from 'react-native-paper';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {deleteBranch as delBranch} from '../../../redux/branchSlice';
import {Dropdown} from 'react-native-element-dropdown';
import {BRANCH_ENDPOINT, EMPLOYEE_ENDPOINT} from '@env';
import {GetAPI, GetQueryAPI, PostAPI} from '../../../api';
import Icon from 'react-native-vector-icons/Ionicons';

const EditCabang = () => {
  const {colors} = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {item} = route.params; // prev page

  const [data, setData] = useState({
    branch: {},
    loading: false,
    employee: [],
    selectedEmp: [],
  });

  const oldEmployee = data.employee.filter(emp => emp.branchid === item.id);

  const [dropdown, setDropdown] = useState({
    value: null,
    focus: false,
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
          const employee = await GetAPI({
            operation: EMPLOYEE_ENDPOINT,
            endpoint: 'showEmployees',
          });
          if (employee.status === 200) {
            setData(prev => ({...prev, employee: employee.data.employeeData}));
          }
        } catch (error) {
        } finally {
          setData(prev => ({...prev, loading: false}));
        }
      }
      fetchData();
    }, [data.employee.length]),
  );

  const updateBranch = async () => {
    const payloadEmployee = makePayload(oldEmployee, data.selectedEmp, item.id);
    console.log('payload: ', payloadEmployee);
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
      const updateEmployee = await PostAPI({
        operation: EMPLOYEE_ENDPOINT,
        endpoint: 'updateEmployeesBranch',
        payload: payloadEmployee,
      });
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      const fullMessage = error.response?.data?.details;
      fullMessage?.forEach(item => {
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

  function removeNewEmployee(id) {
    setData(prev => ({
      ...prev,
      selectedEmp: prev.selectedEmp.filter(emp => emp.id !== id),
    }));
  }

  function makePayload(oldEmp, selectedEmp, branchId) {
    const oldEmpIds = oldEmp.map(item => item.id);
    const newEmpIds = selectedEmp.map(item => item.id);

    const combinedEmpIds = [...oldEmpIds, ...newEmpIds];
    const uniqueEmpIds = Array.from(new Set(combinedEmpIds));
    return {
      employeeIds: uniqueEmpIds,
      branchId: branchId,
    };
  }

  async function removeOldEmployee(emp) {
    // console.log('old emp: ', emp);
    const payload = {
      employeeIds: [emp.id],
      branchId: null,
    };
    try {
      const response = await PostAPI({
        operation: EMPLOYEE_ENDPOINT,
        endpoint: 'updateEmployeesBranch',
        payload: payload,
      });
      if (response.status === 200) {
        setData(prev => ({
          ...prev,
          employee: prev.employee.filter(item => item.id !== emp.id),
        }));
      }
    } catch (error) {
      console.log('eror: ', error.response.data);
    }
  }

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
        ToastAndroid.show(
          `Failed to delete ${data.branch.name}`,
          ToastAndroid.SHORT,
        );
      } finally {
        setData(prev => ({...prev, loading: false}));
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

  return (
    <KeyboardAvoidingView enabled style={styles.container}>
      <View style={styles.whiteLayer}>
        <ScrollView showsVerticalScrollIndicator={false}>
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

          <View style={[styles.listEmp]}>
            <Text variant="titleLarge" style={{fontWeight: '700', flex: 1}}>
              Pegawai
            </Text>
            <Dropdown
              containerStyle={{width: 350}}
              data={data.employee
                .filter(
                  emp =>
                    emp.branchid === null &&
                    !data.selectedEmp.some(e => e.id === emp.id),
                )
                .sort((a, b) => a.name.localeCompare(b.name))}
              mode="modal"
              style={[
                styles.dropdown,
                {backgroundColor: colors.btnColorContainer},
              ]}
              placeholder={'Tambah Pegawai'}
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
              value={'Tambah Pegawai'}
              onFocus={() => setDropdown(prev => ({...prev, focus: true}))}
              onBlur={() => setDropdown(prev => ({...prev, focus: false}))}
              onChange={item => {
                setDropdown(prev => ({
                  ...prev,
                  value: item.value,
                  focus: false,
                }));
                setData(prev => {
                  if (!prev.selectedEmp.includes(item.id)) {
                    return {
                      ...prev,
                      selectedEmp: [
                        ...prev.selectedEmp,
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
          <Text style={[styles.oldNewEmp, {color: Colors.deleteColor}]}>
            Pegawai Lama
          </Text>
          {oldEmployee.length !== 0 ? (
            oldEmployee.map((emp, index) => {
              return (
                <View key={emp.id}>
                  <View style={styles.itemEmp}>
                    <Text variant="titleMedium" style={{fontSize: 16}}>
                      {`${index + 1}. `}
                    </Text>
                    <Text variant="titleMedium" style={{flex: 1, fontSize: 16}}>
                      {emp.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert(
                          'Delete Employee',
                          `Are you sure to delete ${emp.name}? `,
                          [
                            {text: 'Cancel', style: 'default'},
                            {text: 'OK', onPress: () => removeOldEmployee(emp)},
                          ],
                          {cancelable: true},
                        )
                      }>
                      <Icon name="trash" color={Colors.deleteColor} size={24} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={{marginBottom: 25}}>
              <Text style={{fontStyle: 'italic', alignSelf: 'center'}}>
                Cabang ini belum memiliki pegawai
              </Text>
            </View>
          )}
          <Text style={[styles.oldNewEmp, {color: 'green'}]}>Pegawai Baru</Text>
          {data.selectedEmp.length !== 0 ? (
            data.selectedEmp.map((item, index) => {
              return (
                <View key={item.id}>
                  <View style={[styles.itemEmp]}>
                    <Text
                      variant="titleMedium"
                      style={{fontSize: 16}}>{`${index + 1}. `}</Text>
                    <Text variant="titleMedium" style={{flex: 1, fontSize: 16}}>
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeNewEmployee(item.id)}>
                      <Icon name="trash" color={Colors.deleteColor} size={24} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={{marginBottom: 25}}>
              <Text style={{fontStyle: 'italic', alignSelf: 'center'}}>
                Klik{' '}
                <Text style={{fontStyle: 'italic', fontWeight: '700'}}>
                  Tambah Pegawai
                </Text>{' '}
                untuk menambahkan pegawai
              </Text>
            </View>
          )}
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
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  itemEmp: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: 'black',
    flex: 1,
  },
  oldNewEmp: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '700',
  },
});
