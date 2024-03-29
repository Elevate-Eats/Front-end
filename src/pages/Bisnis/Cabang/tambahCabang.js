import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../../utils/colors';
import {AddPhoto, ConstButton, FormInput} from '../../../components';
import {Text} from 'react-native-paper';

const TambahCabang = () => {
  const [branch, setBranch] = useState({
    name: '',
    address: '',
    phone: '',
  });
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
        <ConstButton
          title="Tambah Cabang"
          onPress={() => console.log('Pressed')}
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
