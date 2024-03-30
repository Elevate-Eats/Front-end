import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors} from '../../../utils/colors';
import {
  AddPhoto,
  ConstButton,
  DeleteButton,
  FormInput,
  LoadingIndicator,
} from '../../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text, Modal, PaperProvider, Portal} from 'react-native-paper';
import PostData from '../../../utils/postData';
import GetData from '../../../utils/getData';
import {useFocusEffect} from '@react-navigation/native';

import {BRANCH_ENDPOINT, EMPLOYEE_ENDPOINT} from '@env';

const EditCabang = ({route, navigation}) => {
  const {data} = route.params;
  const [branch, setBranch] = useState({});
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const dataBranch = await PostData({
            operation: BRANCH_ENDPOINT,
            endpoint: 'showSingleBranch',
            payload: {id: data.id},
          });
          setBranch(dataBranch.branchData);

          const dataEmployee = await GetData({
            operation: EMPLOYEE_ENDPOINT,
            endpoint: 'showEmployees',
            resultKey: 'employeeData',
          });
          setEmployee(dataEmployee);
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

  const filteredID = Object.values(employee).filter(
    emp => emp.branchid === branch.id,
  );
  // FINAL UPDATE
  const updateBranch = async () => {
    const payloadUpdate = {
      id: data.id,
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

  async function deleteBranch(params) {
    async function handleDelete(params) {
      try {
        const action = await PostData({
          operation: BRANCH_ENDPOINT,
          endpoint: 'deleteBranch',
          payload: {id: data.id},
        });
        Alert.alert(action.message, `${branch.name} successfully deleted`, [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      } catch (error) {}
    }
    Alert.alert(
      'Branch Deleted',
      `Delete ${branch.name} ?`,
      [{text: 'Cancel'}, {text: 'OK', onPress: handleDelete}],
      {cancelable: true},
    );
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
              // onPress={() => ModalContent(true)}
              style={{borderWidth: 1.3, borderColor: 'grey', borderRadius: 5}}>
              <Text variant="labelLarge" style={styles.btnListEmp}>
                Pilih Pegawai
              </Text>
            </TouchableOpacity>
          </View>
          {filteredID.map(emp => (
            <View
              key={emp.id}
              style={{
                flexDirection: 'row',
                marginVertical: 10,
                alignItems: 'center',
              }}>
              <Text variant="titleMedium" style={{flex: 1, fontWeight: '700'}}>
                {emp.name}
              </Text>
              <TouchableOpacity>
                <Ionicons
                  name="trash-bin"
                  color={Colors.deleteColor}
                  size={25}
                />
              </TouchableOpacity>
            </View>
          ))}
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
});
