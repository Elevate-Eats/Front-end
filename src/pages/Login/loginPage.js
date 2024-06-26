import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ToastAndroid,
  Appearance,
} from 'react-native';
import React, {createRef, useEffect, useState} from 'react';
import {Colors} from '../../utils/colors';
import {Text, useTheme} from 'react-native-paper';
import {BtnLogReg, ConstButton, FormLogReg} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_KEY, API_URL, LOGIN_ENDPOINT, TRANSACTION_ENDPOINT} from '@env';
import LogoLight from '../../assets/icons/logo-light.svg';
import LogoDark from '../../assets/icons/logo-dark.svg';
import {useNavigation} from '@react-navigation/native';

const LoginPage = () => {
  const navigation = useNavigation();
  const [login, setLogin] = useState({
    email: '',
    password: '',
  });
  const [form, setForm] = useState({
    errorEmail: '',
    errorPassword: '',
    hasEmailError: false,
    hasPasswordError: false,
    loading: false,
  });

  const [visible, setVisible] = useState(true);

  const PostLogin = async () => {
    setForm(prev => ({
      ...prev,
      hasEmailError: false,
      hasPasswordError: false,
      errorEmail: '',
      errorPassword: '',
    }));
    try {
      setForm(prev => ({...prev, loading: true}));
      const response = await axios.post(`${API_URL}/${LOGIN_ENDPOINT}`, login, {
        headers: {
          'Content-Type': 'application/json',
          apikey: API_KEY,
        },
      });
      if (response.status === 200) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem(
          'companyId',
          response.data.credentials.companyid.toString(),
        );
        await AsyncStorage.setItem(
          'credentials',
          JSON.stringify(response.data.credentials),
        );

        await AsyncStorage.setItem(
          'companyPic',
          JSON.stringify(response.data.companyPicUrl),
        );
        await AsyncStorage.setItem(
          'profilePic',
          JSON.stringify(response.data.profilePictureUrl),
        );
        setForm(prev => ({
          ...prev,
          hasEmailError: false,
          hasPasswordError: false,
          errorEmail: '',
          errorPassword: '',
        }));
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
        navigation.replace('Bottom Tab');
      }
    } catch (error) {
      const fullMessage = error.response?.data?.message;
      const errorMessage = fullMessage.split(':').pop().trim();
      if (fullMessage.includes('Email')) {
        setForm(prev => ({
          ...prev,
          errorEmail: errorMessage,
          hasEmailError: true,
        }));
      } else if (fullMessage.includes('Password')) {
        setForm(prev => ({
          ...prev,
          errorPassword: errorMessage,
          hasPasswordError: true,
        }));
      } else if (fullMessage) {
        setForm(prev => ({
          ...prev,
          errorEmail: 'Email Invalid',
          hasEmailError: true,
        }));
      }
      // console.log('Login Error: ', errorMessage);
    } finally {
      setForm(prev => ({...prev, loading: false}));
    }
  };

  const themes = useTheme();
  return (
    <KeyboardAvoidingView
      style={[
        styles.KeyboardAvoidingView,
        {backgroundColor: themes.colors.backgroundColorContainer},
      ]}
      enabled={true}>
      <View style={{alignItems: 'center'}}>
        {Appearance.getColorScheme() === 'light' ? (
          <LogoLight width={250} height={150} />
        ) : (
          <LogoDark width={250} height={150} />
        )}
      </View>
      <View style={{flex: 1 / 2, justifyContent: 'center'}}>
        <View style={{marginHorizontal: 30}}>
          <Text
            variant="headlineSmall"
            style={[
              styles.login,
              {color: themes.colors.onBackgroundColorContainer},
            ]}>
            Login to your account
          </Text>

          <FormLogReg
            hasError={form.hasEmailError}
            error={form.errorEmail}
            label="Email"
            placeholder="email address"
            secureTextEntry={false}
            keyboardType="email-address"
            left="email-outline"
            value={login.email}
            onChangeText={text => setLogin({...login, email: text})}
          />
          <FormLogReg
            hasError={form.hasPasswordError}
            error={form.errorPassword}
            label="Password"
            placeholder="password"
            secureTextEntry={visible}
            keyboardType="default"
            right={visible ? 'eye-off' : 'eye'}
            onPress={() => setVisible(!visible)}
            left="key-outline"
            value={login.password}
            onChangeText={text => setLogin({...login, password: text})}
          />

          <BtnLogReg
            onPress={PostLogin}
            disabled={!login.email || !login.password}
            name="LOGIN"
            loading={form.loading}
          />
          <View style={styles.have_account}>
            <Text
              variant="titleSmall"
              style={{
                fontSize: 18,
                color: themes.colors.onBackgroundColorContainer,
              }}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
              <Text
                variant="titleSmall"
                style={[
                  styles.signup,
                  {color: themes.colors.onBackgroundColorContainer},
                ]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    // backgroundColor: Colors.thirdColor,
    flex: 1,
    justifyContent: 'center',
    rowGap: 20,
  },
  img: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  login: {
    fontWeight: '700',
    color: Colors.btnColor,
    marginBottom: 10,
  },
  have_account: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
    columnGap: 5,
  },
  signup: {
    fontWeight: '700',
    color: Colors.btnColor,
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
