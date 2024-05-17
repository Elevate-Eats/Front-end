import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Expanse from '../../assets/icons/cash-out.svg';
import Print from '../../assets/icons/download_file.svg';
import Right from '../../assets/icons/arrow-right.svg';
import {useNavigation} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import {useSelector} from 'react-redux';
import getDataQuery from '../../utils/getDataQuery';
import {Colors} from '../../utils/colors';
import {TRANSACTION_ENDPOINT} from '@env';
import {ConstButton, TopBar} from '../../components';
import {REPORT_ENDPOINT, API_URL, API_KEY} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import Pdf from 'react-native-pdf';
import {Buffer} from 'buffer';
import FormatDateTime from '../../utils/formatDateTime';
global.Buffer = Buffer;

const MainLaporan = () => {
  const navigation = useNavigation();
  const [filePath, setFilePath] = useState('');
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [loading, setLoading] = useState(false);
  const allBranch = useSelector(state => state.branch.allBranch);
  const listBranch = allBranch.map(item => ({
    value: item.id,
    label: item.name,
  }));

  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  function handleDate(event, value) {
    setDate(value);
    setShowDate(false);
  }
  function handlePress(params) {
    navigation.navigate(params);
  }

  // async function handlePress(params) {
  //   try {
  //     setLoading(true);
  //     const token = await AsyncStorage.getItem('userToken');
  //     const pdfData = await axios.get(
  //       `${API_URL}/${REPORT_ENDPOINT}/showDailyReport?branchId=6&date=2024-05-13`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         responseType: 'arraybuffer',
  //       },
  //     );

  //     const base64 = Buffer.from(pdfData.data, 'binary').toString('base64');
  //     const dirs = RNFetchBlob.fs.dirs;
  //     const path = `${dirs.DownloadDir}/Elevate/report_4.pdf`;
  //     console.log('dirs: ', dirs);
  //     console.log('path: ', path);

  //     await RNFetchBlob.fs.writeFile(path, base64, 'base64');
  //     setFilePath(path);
  //   } catch (error) {
  //     console.log('error: ', error);
  //   } finally {
  //     setLoading(false);
  //     ToastAndroid.show('Success', ToastAndroid.BOTTOM);
  //   }
  // }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
      <TopBar title="Laporan Pengeluaran" navigation={navigation} />
      {/*
        {
          // filePath ? (
          //   <View style={{flex: 1}}>
          //     <Pdf
          //       source={{uri: filePath, cache: false}}
          //       style={{flex: 1, width: '100%', height: '100%'}}
          //       onError={error => console.log('error pdf: ', error)}
          //     />
          //   </View>
          // ) : null
        }
      </View>*/}
      <View style={styles.whiteLayer}>
        <View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              padding: 10,
            }}>
            Pilih Opsi
          </Text>
          <Pressable
            onPress={() => handlePress('Pengeluaran')}
            style={styles.box}>
            <Expanse width={40} height={40} />
            <Text
              variant="titleMedium"
              style={{fontWeight: '700', marginHorizontal: 15, flex: 1}}>
              Catatan Pengeluaran
            </Text>
            <TouchableOpacity onPress={() => handlePress('Pengeluaran')}>
              <Right width={30} height={30} />
            </TouchableOpacity>
          </Pressable>
          <Pressable onPress={() => console.log('Press')} style={styles.box}>
            <Print width={40} height={40} />
            <Text
              variant="titleMedium"
              style={{fontWeight: '700', marginHorizontal: 15, flex: 1}}>
              Unduh Laporan
            </Text>
            <TouchableOpacity onPress={() => console.log('Press')}>
              <Right width={30} height={30} />
            </TouchableOpacity>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MainLaporan;

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    padding: 16,
    paddingVertical: 20,
    elevation: 5,
    zIndex: 888,
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 8,
  },
  calendar: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  whiteLayer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    elevation: 1,
    padding: 10,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.07)',
    borderRadius: 8,
    marginVertical: 10,
  },
});
