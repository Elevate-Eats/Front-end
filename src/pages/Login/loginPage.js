import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  ToastAndroid,
  Appearance,
} from 'react-native';
import React, {useState, createContext} from 'react';
import {Colors} from '../../utils/colors';
import {Text, useTheme} from 'react-native-paper';
import {BtnLogReg, FormLogReg} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_KEY, API_URL, LOGIN_ENDPOINT, TRANSACTION_ENDPOINT} from '@env';
import LogoLight from '../../assets/icons/logo-light.svg';
import LogoDark from '../../assets/icons/logo-dark.svg';

const LoginPage = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState({
    email: '',
    password: '',
  });
  const [visible, setVisible] = useState(true);

  const PostLogin = async () => {
    try {
      setLoading(true);
      const action = await axios.post(`${API_URL}/${LOGIN_ENDPOINT}`, login, {
        headers: {
          'Content-Type': 'application/json',
          apikey: API_KEY, // Ensure header keys are correctly expected by your backend
        },
      });
      if (action.data) {
        await AsyncStorage.setItem('userToken', action.data.token);
        await AsyncStorage.setItem(
          'companyId',
          action.data.credentials.companyid.toString(),
        );
        await AsyncStorage.setItem(
          'credentials',
          JSON.stringify(action.data.credentials),
        );
        navigation.replace('Bottom Tab');
        ToastAndroid.show(action.data.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('err: ', error);
      ToastAndroid.show(
        'Login Error, Check your email or password!',
        ToastAndroid.SHORT,
      );
    } finally {
      setLoading(false);
    }
  };

  const themes = useTheme();

  console.log('theme: ', Appearance.getColorScheme());
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
      <View style={{alignItems: 'center'}}></View>
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
            label="Email"
            placeholder="email address"
            secureTextEntry={false}
            keyboardType="email-address"
            left="email"
            value={login.email}
            onChangeText={text => setLogin({...login, email: text})}
          />
          <FormLogReg
            label="Password"
            placeholder="password"
            secureTextEntry={visible}
            keyboardType="default"
            right={visible ? 'eye-off' : 'eye'}
            onPress={() => setVisible(!visible)}
            left="key-variant"
            value={login.password}
            onChangeText={text => setLogin({...login, password: text})}
          />

          <BtnLogReg
            onPress={PostLogin}
            disabled={!login.email || !login.password}
            name="LOGIN"
            loading={loading}
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
});
