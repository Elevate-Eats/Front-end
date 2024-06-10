import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import Logo from '../../assets/images/elevate.png';
import {Colors} from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      AsyncStorage.getItem('userToken').then(value => {
        value === null
          ? navigation.replace('Login')
          : navigation.replace('Bottom Tab');
      });
    }, 500);
  }, [navigation]);
  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.backgroundColor,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image source={Logo} style={styles.logo} />
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Text variant="titleMedium">Safe ur bussines with us !</Text>
        <ActivityIndicator size={'small'} color="grey" />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  logo: {
    resizeMode: 'contain',
    height: 250,
    width: 250,
  },
});
