import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import {Colors} from '../../utils/colors';
import {ItemBisnis, TopBar} from '../../components';
import {Text} from 'react-native-paper';
import ContentPage from '../../components/contentPage';
import Building from '../../assets/icons/store-bulk.svg';
import Manager from '../../assets/icons/user-bulk.svg';
import Employee from '../../assets/icons/user-group-bulk.svg';
import MenuCompany from '../../assets/icons/box-bulk.svg';
import {useNavigation} from '@react-navigation/native';

const MainBisnis = () => {
  const navigation = useNavigation();
  function handlePress(screen) {
    navigation.navigate(screen);
  }
  return (
    <SafeAreaView style={styles.container}>
      <TopBar navigation={navigation} title={'Bisnis'} />
      <ScrollView style={styles.whiteLayer}>
        <Text style={styles.textOpsi}>Pilih Opsi</Text>
        <ContentPage
          title={'List Cabang'}
          Icon={Building}
          onPress={() => handlePress('Pilih Cabang')}
        />
        <ContentPage
          title={'List Manager'}
          Icon={Manager}
          onPress={() => handlePress('Pilih Manager')}
        />
        <ContentPage
          title={'List Pegawai'}
          Icon={Employee}
          onPress={() => handlePress('Pilih Pegawai')}
        />
        <ContentPage
          title={'List Menu Company'}
          Icon={MenuCompany}
          onPress={() => handlePress('Pilih Menu')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainBisnis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  textOpsi: {
    fontSize: 20,
    fontWeight: '700',
    padding: 10,
  },
  whiteLayer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});
