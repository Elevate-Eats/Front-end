import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Appearance,
} from 'react-native';
import React, {useState} from 'react';
import {Text, useTheme} from 'react-native-paper';
import {BtnLogReg, FormLogReg} from '../../components';
import {Colors} from '../../utils/colors';
import {REGISTER_ENDPOINT, API_KEY, API_URL} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoLight from '../../assets/icons/logo-light.svg';
import LogoDark from '../../assets/icons/logo-dark.svg';
import {useNavigation} from '@react-navigation/native';

const RegisterPage = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const [regist, setRegist] = useState({
    name: '',
    nickname: '',
    email: '',
    company: '',
    role: 'general_manager',
    password: '',
    passwordConfirm: '',
    phone: '',
  });

  const {colors} = useTheme();

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  async function PostRegist() {
    if (!validateEmail(regist.email)) {
      ToastAndroid.show('Masukkan email yang valid', ToastAndroid.SHORT);
    } else if (regist.password.length < 8) {
      ToastAndroid.show('Password minimal 8 karakter', ToastAndroid.SHORT);
    } else if (regist.password !== regist.passwordConfirm) {
      ToastAndroid.show('Password tidak sama', ToastAndroid.SHORT);
    } else {
      try {
        setLoading(true);
        const response = await axios.post(
          `${API_URL}/${REGISTER_ENDPOINT}`,
          regist,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              apikey: API_KEY,
            },
          },
        );
        if (response.status === 200) {
          ToastAndroid.show(
            'Registrasi berhasil, Silakan Login',
            ToastAndroid.SHORT,
          );
          navigation.replace('Login');
        }
      } catch (error) {
        ToastAndroid.show(
          error.response?.data?.message || 'Registrasi gagal',
          ToastAndroid.SHORT,
        );
        console.log('error: ', error);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.KeyboardAvoidingView,
        {backgroundColor: colors.backgroundColorContainer},
      ]}
      enabled={true}>
      <ScrollView>
        <View style={{alignItems: 'center', marginTop: 20}}>
          {Appearance.getColorScheme() === 'dark' ? (
            <LogoDark width={250} height={150} />
          ) : (
            <LogoLight width={250} height={150} />
          )}
        </View>

        <View style={{marginTop: 30}}>
          <View style={{marginHorizontal: 30}}>
            <Text
              variant="headlineSmall"
              style={[
                styles.create,
                {color: colors.onBackgroundColorContainer},
              ]}>
              Create your account
            </Text>
            <FormLogReg
              label="Name"
              placeholder="fullname"
              secureTextEntry={false}
              keyboardType="default"
              left="account-circle-outline"
              value={regist.name}
              onChangeText={text => setRegist({...regist, name: text})}
            />
            <FormLogReg
              label="Nickname"
              placeholder="nickname"
              secureTextEntry={false}
              keyboardType="default"
              left="account-outline"
              value={regist.nickname}
              onChangeText={text => setRegist({...regist, nickname: text})}
            />

            <FormLogReg
              label="Company"
              placeholder="company name"
              secureTextEntry={false}
              keyboardType="default"
              left="office-building-outline"
              value={regist.company}
              onChangeText={text => setRegist({...regist, company: text})}
            />
            <FormLogReg
              label="Phone"
              placeholder="phone number"
              secureTextEntry={true}
              keyboardType="phone-pad"
              left="phone-outline"
              value={regist.phone}
              onChangeText={text => setRegist({...regist, phone: text})}
            />
            <FormLogReg
              label="Email"
              placeholder="email address"
              secureTextEntry={false}
              keyboardType="email-address"
              left="email-outline"
              value={regist.email}
              onChangeText={text => setRegist({...regist, email: text})}
            />
            <FormLogReg
              label="Password"
              placeholder="password"
              secureTextEntry={visible}
              keyboardType="default"
              left="key-outline"
              right={visible ? 'eye-off' : 'eye'}
              value={regist.password}
              onPress={() => setVisible(!visible)}
              onChangeText={text => setRegist({...regist, password: text})}
            />
            <FormLogReg
              label="Confirm Password"
              placeholder="confirm password"
              secureTextEntry={visible}
              keyboardType="default"
              left="lock-outline"
              right={visible ? 'eye-off' : 'eye'}
              value={regist.passwordConfirm}
              onPress={() => setVisible(!visible)}
              onChangeText={text =>
                setRegist({...regist, passwordConfirm: text})
              }
            />

            <BtnLogReg
              name="SIGN UP"
              onPress={() => PostRegist()}
              loading={loading}
              // disabled={
              //   !regist.name ||
              //   !regist.nickname ||
              //   !regist.company ||
              //   !regist.phone ||
              //   !regist.email ||
              //   !regist.password ||
              //   !regist.passwordConfirm
              // }
            />
            <View style={[styles.have_account, {marginTop: 30}]}>
              <Text
                variant="titleSmall"
                style={{
                  fontSize: 18,
                  color: colors.onBackgroundColorContainer,
                }}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text
                  variant="titleSmall"
                  style={[
                    styles.signup,
                    {color: colors.onBackgroundColorContainer},
                  ]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
  },
  img: {
    marginTop: 30,
    width: 250,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  create: {
    fontWeight: '700',
    color: Colors.btnColor,
    marginBottom: 10,
  },
  have_account: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
    columnGap: 5,
  },
  signup: {
    fontWeight: '700',
    color: Colors.btnColor,
    fontSize: 18,
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
});
