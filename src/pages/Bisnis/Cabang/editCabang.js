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
import PostData from '../../../utils/postData';
import GetData from '../../../utils/getData';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {deleteBranch as delBranch} from '../../../redux/branchSlice';

import {BRANCH_ENDPOINT, EMPLOYEE_ENDPOINT} from '@env';

const EditCabang = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {item} = route.params; // prev page
  console.log('item edit cbang: ', item);
  const [branch, setBranch] = useState({}); // dari database
  const [modal, setModal] = useState(false); // open Modal content
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [employee, setEmployee] = useState({}); // dari database
  const [selectedEmp, setSelectedEmp] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const dataBranch = await PostData({
            operation: BRANCH_ENDPOINT,
            endpoint: 'showSingleBranch',
            payload: {id: item.id},
          });
          setBranch(dataBranch.branchData);

          const dataEmployee = await GetData({
            operation: EMPLOYEE_ENDPOINT,
            endpoint: 'showEmployees',
            resultKey: 'employeeData',
          });
          setEmployee(dataEmployee);
          // setSelectedEmp(
          //   Object.values(dataEmployee).filter(emp => emp.branchid === item.id),
          // );
        } catch (error) {
          setError('Data Not Found !');
          console.log('Error');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []),
  );

  // console.log('isi selected Emp: ', selectedEmp);
  async function reciveID(key) {
    // console.log(branch.id);
    // console.log('key:', key);
    const newEmp = key.map(k => {
      // console.log({...k, branchid: branch.id});
      return {...k, branchid: branch.id};
    });
    // console.log(selectedEmp.concat(newEmp));
    // console.log('new EMp:', newEmp);
    setSelectedEmp(selectedEmp.concat(newEmp));
  }

  // console.log('isi selected emp: ', selectedEmp);

  // FINAL UPDATE
  const updateBranch = async () => {
    const payloadUpdate = {
      id: item.id,
      name: branch.name,
      phone: branch.phone,
      address: branch.address,
    };

    try {
      const update = await PostData({
        operation: BRANCH_ENDPOINT,
        endpoint: 'updateBranch',
        payload: payloadUpdate,
      });
      Alert.alert(update.message, `${branch.name} successfully updated`, [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert('Failed to Update Branch');
    }
  };

  async function deleteBranch() {
    async function handleDelete() {
      try {
        setLoading(true);
        const action = await PostData({
          operation: BRANCH_ENDPOINT,
          endpoint: 'deleteBranch',
          payload: {id: item.id},
        });
        if (action) {
          dispatch(delBranch(item.id));
          ToastAndroid.show(
            `${branch.name} successfully deleted`,
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
      `Delete ${branch.name} ?`,
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
    // console.log(delEmp);
    setSelectedEmp(delEmp);
  }

  if (loading) {
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
              value={branch.name}
              onChangeText={text => setBranch({...branch, name: text})}
              secureTextEntry={false}
            />
            <FormInput
              label="No. Telepon Cabang"
              placeholder="masukkan no. telepon cabang ..."
              keyboardType="phone-pad"
              left="phone-outline"
              value={branch.phone}
              onChangeText={text => setBranch({...branch, phone: text})}
              secureTextEntry={false}
            />
            <FormInput
              label="Alamat Cabang"
              placeholder="masukkan alamat cabang ..."
              keyboardType="default"
              left="map-marker-outline"
              value={branch.address}
              onChangeText={text => setBranch({...branch, address: text})}
              secureTextEntry={false}
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
              // console.log(
              //   'UI: ',
              //   selectedEmp
              //     .filter(emp => emp.branchid === branch.id)
              //     .map(emp => emp),
              // );
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
            <ConstButton title="Simpan" onPress={() => updateBranch()} />
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
