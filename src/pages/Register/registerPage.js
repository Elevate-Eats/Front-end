import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';

import {Text} from 'react-native-paper';

import {BtnLogReg, FormLogReg} from '../../components';
import {Colors} from '../../utils/colors';

const RegisterPage = ({navigation}) => {
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
  return (
    <KeyboardAvoidingView style={styles.KeyboardAvoidingView} enabled={true}>
      <ScrollView>
        <View style={{}}>
          <Image
            source={require('../../assets/images/elevate.png')}
            style={styles.img}
          />
        </View>

        <View style={{}}>
          <View style={{marginHorizontal: 30}}>
            <Text variant="headlineSmall" style={styles.create}>
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
              secureTextEntry={true}
              keyboardType="default"
              left="key-outline"
              right="eye"
              value={regist.password}
              onChangeText={text => setRegist({...regist, password: text})}
            />
            <FormLogReg
              label="Confirm Password"
              placeholder="confirm password"
              secureTextEntry={true}
              keyboardType="default"
              left="lock-outline"
              right="eye"
              value={regist.passwordConfirm}
              onChangeText={text =>
                setRegist({...regist, passwordConfirm: text})
              }
            />

            <BtnLogReg name="Sign Up" />
            <View style={styles.have_account}>
              <Text variant="titleSmall" style={{fontSize: 18}}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text variant="titleSmall" style={styles.signup}>
                  Sign Up
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
    backgroundColor: Colors.thirdColor,
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
