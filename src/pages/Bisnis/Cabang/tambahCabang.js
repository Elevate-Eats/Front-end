import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../../utils/colors';
import {AddPhoto, ConstButton, FormInput} from '../../../components';
import {Text} from 'react-native-paper';
import {BRANCH_ENDPOINT} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {addBranch as tambahBranch} from '../../../redux/branchSlice';
import {useNavigation} from '@react-navigation/native';
import {PostAPI} from '../../../api';

const TambahCabang = () => {
  const navigation = useNavigation();
  useEffect(() => {
    async function fetchLocalStorage(params) {
      const response = await AsyncStorage.getItem('credentials');
      setCredentials(JSON.parse(response));
    }
    fetchLocalStorage();
  }, []);

  const dispatch = useDispatch();
  const [branch, setBranch] = useState({
    name: '',
    address: '',
    phone: '',
  });

  const [form, setForm] = useState({
    errorName: '',
    errorAddress: '',
    errorPhone: '',
    hasErrorName: false,
    hasErrorPhone: false,
    hasErrorAddress: false,
  });

  const [credentials, setCredentials] = useState({});
  const [loading, setLoading] = useState(false);

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

  async function addBranch(params) {
    resetFormError();
    const payload = {
      ...branch,
      managerId: credentials.id,
    };
    try {
      setLoading(true);
      const response = await PostAPI({
        operation: BRANCH_ENDPOINT,
        endpoint: 'addBranch',
        payload: payload,
      });
      if (response.status === 200) {
        dispatch(tambahBranch(branch));
        ToastAndroid.show(`${branch.name} successfully added`, 1000);
        navigation.goBack();
      }
    } catch (error) {
      const fullMessage = error.response?.data?.details;
      fullMessage.some(item => {
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
        } else if (item.includes('phone')) {
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
      setLoading(false);
    }
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
              placeholder="Masukkan nama cabang ..."
              keyboardType="default"
              left="storefront-outline"
              value={branch.name}
              onChangeText={text => setBranch({...branch, name: text})}
              hasError={form.hasErrorName}
              error={form.errorName}
            />
            <FormInput
              label="Alamat Cabang"
              placeholder="Masukkan alamat cabang ..."
              keyboardType="default"
              left="map-marker-outline"
              value={branch.address}
              onChangeText={text => setBranch({...branch, address: text})}
              hasError={form.hasErrorAddress}
              error={form.errorAddress}
            />
            <FormInput
              label="No Telepon Cabang"
              placeholder="Masukkan nomor telepon cabang ..."
              keyboardType="phone-pad"
              left="phone-outline"
              value={branch.phone}
              onChangeText={text => setBranch({...branch, phone: text})}
              hasError={form.hasErrorPhone}
              error={form.errorPhone}
            />
          </View>
        </ScrollView>
        <ConstButton
          title="Tambah"
          onPress={() => addBranch()}
          loading={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default TambahCabang;

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
});
