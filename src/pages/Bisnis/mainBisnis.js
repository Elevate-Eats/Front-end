import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../utils/colors';
import {ItemBisnis, TopBar} from '../../components';
import {Text} from 'react-native-paper';
import ContentPage from '../../components/contentPage';
import Building from '../../assets/icons/store-bulk.svg';
import Manager from '../../assets/icons/user-bulk.svg';
import Employee from '../../assets/icons/user-group-bulk.svg';
import MenuCompany from '../../assets/icons/box-bulk.svg';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainBisnis = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({
    local: {},
  });
  useEffect(() => {
    async function fetchLocalStorage(params) {
      const response = await AsyncStorage.getItem('credentials');
      const parsed = JSON.parse(response);
      setData(prev => ({...prev, local: parsed}));
    }
    fetchLocalStorage();
  }, []);
  function handlePress(screen) {
    navigation.navigate(screen);
  }
  return (
    <SafeAreaView style={styles.container}>
      <TopBar navigation={navigation} title={'Bisnis'} />
      <ScrollView style={styles.whiteLayer}>
        <View style={{marginVertical: 15}}>
          <Text style={styles.textOpsi}>Pilih Opsi</Text>
          {data.local.role === 'general_manager' ? (
            <View>
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
            </View>
          ) : (
            <View>
              <ContentPage
                title={'List Cabang'}
                Icon={Building}
                onPress={() => handlePress('Pilih Cabang')}
              />
              <ContentPage
                title={'List Pegawai'}
                Icon={Employee}
                onPress={() => handlePress('Pilih Pegawai')}
              />
            </View>
          )}
        </View>
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
