import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text, TextInput, useTheme} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../utils/colors';
import Pencil from '../../assets/icons/pencil-outline.svg';
import User from '../../assets/images/user-profile.jpg';
import {DarkTheme, LightTheme} from '../../themes';
import FormProfile from '../../components/formProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostData from '../../utils/postData';
import {MANAGER_ENDPOINT} from '@env';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ConstButton} from '../../components';

const CompanyAccount = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    user: {}, // data backend
    secure: true,
    disabled: false,
    credential: {}, // data from Asyncstorage when login
  });

  useEffect(() => {
    async function fetchDataCredentials(params) {
      try {
        const jsonValue = await AsyncStorage.getItem('credentials');
        const response = await PostData({
          operation: MANAGER_ENDPOINT,
          endpoint: 'showSingleManager',
          payload: {id: JSON.parse(jsonValue).id},
        });
        setForm(prev => ({
          ...prev,
          credential: JSON.parse(jsonValue),
          user: response.managerData,
        }));
      } catch (error) {
        console.log('error fecthData', error);
      }
    }
    fetchDataCredentials();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={{marginRight: 10}}
          onPress={() => navigation.openDrawer()}>
          <Icon name="menu" size={27} color={LightTheme.colors.onError} />
        </Pressable>
        <Text variant="titleLarge" style={{color: 'white', flex: 1}}>
          Your Profile
        </Text>
        <TouchableOpacity
          onPress={() =>
            setForm(prev => ({...prev, disabled: !prev.disabled}))
          }>
          <Pencil width={30} height={30} />
        </TouchableOpacity>
      </View>
      <View style={styles.whiteLayer}>
        <View style={{alignItems: 'center', paddingVertical: 20}}>
          <Image source={User} style={styles.profile} />
          <Text
            style={{fontWeight: '700', fontSize: 22, color: Colors.btnColor}}>
            {form.user.name}
          </Text>
          <Text style={{fontSize: 16, color: 'grey'}}>{form.user.role}</Text>
          <Text style={{fontSize: 16, color: 'grey', marginVertical: 10}}>
            Edit Profile
          </Text>
        </View>
        <View style={{gap: 20, paddingVertical: 30}}>
          <FormProfile
            disabled={!form.disabled}
            left="account"
            placeholder="masukkan nama ..."
            label="Nama Manager"
            keyboardType="default"
            value={form.user.name}
            onChangeText={text =>
              setForm(prev => ({
                ...prev,
                user: {...prev.user, name: text},
              }))
            }
          />
          <FormProfile
            disabled={!form.disabled}
            left="account"
            placeholder="masukkan nickname ..."
            label="Nickname"
            keyboardType="default"
            value={form.user.nickname}
            onChangeText={text =>
              setForm(prev => ({
                ...prev,
                user: {...prev.user, nickname: text},
              }))
            }
          />
          <FormProfile
            disabled={!form.disabled}
            left="email"
            placeholder="masukkan alamat email ..."
            label="Alamat Email"
            keyboardType="email-address"
            value={form.user.email}
            onChangeText={text =>
              setForm(prev => ({
                ...prev,
                user: {...prev.user, email: text},
              }))
            }
          />
          <FormProfile
            disabled={!form.disabled}
            left="phone"
            placeholder="masukkan nomor telepon ..."
            label="Nomor Telepon"
            keyboardType="phone-pad"
            value={form.user.phone}
            onChangeText={text =>
              setForm(prev => ({
                ...prev,
                user: {...prev.user, phone: text},
              }))
            }
          />
        </View>
        {form.disabled ? (
          <View style={{marginHorizontal: 20, marginVertical: 50}}>
            <ConstButton title="Update Profile" />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default CompanyAccount;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.btnColor},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    // marginHorizontal: 25,
    paddingVertical: 10,
  },
  whiteLayer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginVertical: 15,
  },
});
