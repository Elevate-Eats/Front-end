import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../../utils/colors';
import {AddPhoto, ConstButton, FormInput} from '../../../components';
import {Text} from 'react-native-paper';
import PostData from '../../../utils/postData';
import {BRANCH_ENDPOINT} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {addBranch as tambahBranch} from '../../../redux/branchSlice';

const TambahCabang = ({navigation}) => {
  const dispatch = useDispatch();
  const [branch, setBranch] = useState({
    name: '',
    address: '',
    phone: '',
  });

  async function getManagerId() {
    try {
      const managerId = await AsyncStorage.getItem('managerId');
      if (managerId !== null) {
        return managerId;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch managerId', error);
    }
  }
  async function addBranch(params) {
    const payload = {
      ...branch,
      managerId: parseInt(await getManagerId()),
    };
    console.log('payload: ', payload);
    try {
      const action = await PostData({
        operation: BRANCH_ENDPOINT,
        endpoint: 'addBranch',
        payload: branch,
      });
      if (action) {
        dispatch(tambahBranch(branch));
        ToastAndroid.show(
          `${branch.name} successfully added`,
          ToastAndroid.SHORT,
        );
        navigation.goBack();
      }
    } catch (error) {
      ToastAndroid.show('Failed to add branch', ToastAndroid.SHORT);
    }
  }
  return (
    <KeyboardAvoidingView enabled style={styles.container}>
      <View style={styles.whiteLayer}>
        <ScrollView>
          <AddPhoto icon="storefront" />
          <View style={{marginTop: 30}}>
            <Text variant="titleLarge" style={{fontWeight: '600'}}>
              Informasi Cabang
            </Text>
            <FormInput
              label="Nama Cabang"
              placeholder="Masukkan nama cabang ..."
              keyboardType="default"
              left="storefront-outline"
              value={branch.name}
              onChangeText={text => setBranch({...branch, name: text})}
            />
            <FormInput
              label="Alamat Cabang"
              placeholder="Masukkan alamat cabang ..."
              keyboardType="default"
              left="map-marker-outline"
              value={branch.address}
              onChangeText={text => setBranch({...branch, address: text})}
            />
            <FormInput
              label="No Telepon Cabang"
              placeholder="Masukkan nomor telepon cabang ..."
              keyboardType="phone-pad"
              left="phone-outline"
              value={branch.phone}
              onChangeText={text => setBranch({...branch, phone: text})}
            />
          </View>
        </ScrollView>
        <ConstButton title="Tambah" onPress={() => addBranch()} />
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
