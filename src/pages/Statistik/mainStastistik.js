import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {TopBar} from '../../components';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {Colors} from '../../utils/colors';
import Analisis from '../../assets/icons/analisis-bulk.svg';
import Bar from '../../assets/icons/chart-bulk.svg';
import ContentPage from '../../components/contentPage';

const MainStatistik = () => {
  const navigation = useNavigation();
  const {allBranch} = useSelector(state => state.branch);

  function handlePress(screen) {
    navigation.navigate(screen);
  }
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
      <TopBar title={'Statistik'} navigation={navigation} />
      <ScrollView style={[styles.whiteLayer, {flexGrow: 1}]}>
        <View style={{marginVertical: 15}}>
          <Text style={styles.textOpsi}>Pilih Opsi</Text>
          <ContentPage
            title="Data Analisis"
            Icon={Analisis}
            onPress={() => handlePress('Data Analisis')}
          />
          <ContentPage
            title="Data Prediksi"
            Icon={Bar}
            onPress={() => handlePress('Data Prediksi')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainStatistik;

const styles = StyleSheet.create({
  textOpsi: {
    fontSize: 20,
    fontWeight: '700',
    padding: 10,
  },
  dropdown: {
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
  },
  pickDate: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
  },
  whiteLayer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 5,
    elevation: 1,
    paddingHorizontal: 10,
  },
  selectedTextStyle: {
    fontWeight: '500',
    fontSize: 18,
    color: Colors.btnColor,
  },
  calendarContainer: {
    flexDirection: 'row',
    columnGap: 15,
    paddingVertical: 10,
  },
});
