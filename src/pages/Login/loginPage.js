import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../utils/colors';
import {Text} from 'react-native-paper';
import {BtnLogReg, FormLogReg} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_KEY, API_URL, LOGIN_ENDPOINT} from '@env';

const LoginPage = ({navigation, route}) => {
  const [login, setLogin] = useState({
    email: '',
    password: '',
  });
  const [id, setID] = useState('');
  const PostLogin = async () => {
    try {
      const action = await axios.post(`${API_URL}/${LOGIN_ENDPOINT}`, login, {
        headers: {
          'Content-Type': 'application/json',
          apikey: API_KEY,
        },
      });
      // console.log('data: ', action.data.nickname);
      if (action.data && action.data.token) {
        await AsyncStorage.setItem('userToken', action.data.token);
        console.log(`${action.data.id} - ${action.data.nickname}`);
        navigation.replace('Bottom Tab', {
          nickname: action.data.nickname,
          id: action.data.id,
        });
        // setNickname(action.data.nickname);
        setID(action.data.id);
      }
    } catch (error) {
      Alert.alert('Login Error', 'Check your email or password!');
    }
  };
  // try {
  //   const action = await axios
  //     .post(`${API_URL}/${LOGIN_ENDPOINT}`, login, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         apikey: API_KEY,
  //       },
  //     })
  //     .then(async res => {
  //       await AsyncStorage.setItem('userToken', res.data.token);
  //       // console.log('Token: ', await AsyncStorage.getItem('userToken'));
  //     });
  //   console.log('isi action: ', action);
  //   // navigation.replace('Bottom Tab');
  // } catch (error) {
  //   Alert.alert('Email atau Password Salah');
  // }
  // console.log(token);
  // };

  return (
    <KeyboardAvoidingView style={styles.KeyboardAvoidingView} enabled={true}>
      <View style={{flex: 1 / 5, justifyContent: 'center'}}>
        <Image
          source={require('../../assets/images/elevate.png')}
          style={styles.img}
        />
      </View>
      <View style={{flex: 1 / 2, justifyContent: 'center'}}>
        <View style={{marginHorizontal: 30}}>
          <Text variant="headlineSmall" style={styles.login}>
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
            secureTextEntry={true}
            keyboardType="default"
            right="eye"
            left="key-variant"
            value={login.password}
            onChangeText={text => setLogin({...login, password: text})}
          />

          <BtnLogReg
            // onPress={PostLogin}
            onPress={() => navigation.replace('Bottom Tab', {id: id})}
            disabled={false}
            name="Log In"
          />
          <View style={styles.have_account}>
            <Text variant="titleSmall" style={{fontSize: 18}}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
              <Text variant="titleSmall" style={styles.signup}>
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
    backgroundColor: Colors.thirdColor,
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
    marginTop: 10,
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
