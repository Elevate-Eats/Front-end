import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Expanse from '../../assets/icons/cash-out.svg';
import Print from '../../assets/icons/printers.svg';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import FormatDateTime from '../../utils/formatDateTime';
global.Buffer = Buffer;

const MainLaporan = () => {
  const navigation = useNavigation();
  const [filePath, setFilePath] = useState('');
  const [value, setValue] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [loading, setLoading] = useState(false);
  const allBranch = useSelector(state => state.branch.allBranch);
  const listBranch = allBranch.map(item => ({
    value: item.id,
    label: item.name,
  }));
  listBranch.push({
    value: 0,
    label: 'Semua Cabang',
  });

  useEffect(() => {
    async function fetchData(params) {
      try {
        // setLoading(true);
        const data = await getDataQuery({
          operation: TRANSACTION_ENDPOINT,
          endpoint: 'showTransactions',
          resultKey: 'transactions',
          query: `branch=${value}`,
        });
        if (data) {
          setTransaction(data);
        }
      } catch (error) {
        setTransaction([]);
      } finally {
        // setLoading(false);
      }
    }
    fetchData();
  }, [value]);
  // console.log('transaction: ', transaction);

  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  function handleDate(event, value) {
    setDate(value);
    setShowDate(false);
  }

  async function handlePress(params) {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const pdfData = await axios.get(
        `${API_URL}/${REPORT_ENDPOINT}/showDailyReport?branchId=6&date=2024-05-13`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        },
      );

      const base64 = Buffer.from(pdfData.data, 'binary').toString('base64');
      const dirs = RNFetchBlob.fs.dirs;
      const path = `${dirs.DownloadDir}/Elevate/report_4.pdf`;
      console.log('dirs: ', dirs);
      console.log('path: ', path);

      await RNFetchBlob.fs.writeFile(path, base64, 'base64');
      setFilePath(path);
    } catch (error) {
      console.log('error: ', error);
    } finally {
      setLoading(false);
      ToastAndroid.show('Success', ToastAndroid.BOTTOM);
    }
  }
  // console.log(`transaction branchId-${value}: `, transaction);
  // const dateOnly = date.toISOString().split('T')[0];
  // console.log('dateOnly: ', dateOnly);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
      <TopBar title="Laporan Pengeluaran" navigation={navigation} />
      {/* <View style={styles.header}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', columnGap: 16}}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon name="menu" size={25} color="black" />
          </TouchableOpacity>
          <Text variant="titleMedium" style={{fontSize: 20}}>
            Laporan Pengeluaran
          </Text>
        </View>
        <View style={{marginTop: 10}}>
          <Dropdown
            data={Object.values(listBranch).sort((a, b) =>
              a.label.localeCompare(b.label),
            )}
            mode="modal"
            style={[styles.dropdown, isFocus && {borderColor: Colors.btnColor}]}
            placeholderStyle={{fontSize: 16}}
            selectedTextStyle={{
              fontSize: 18,
              fontWeight: '600',
              color: 'grey',
            }}
            inputSearchStyle={{height: 40, fontSize: 16}}
            itemTextStyle={{fontWeight: '700'}}
            search
            maxHeight={300}
            labelField={'label'}
            valueField={'value'}
            placeholder="Pilih Cabang ..."
            searchPlaceholder="Search ..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue(item.value);
              setIsFocus(false);
            }}
            renderLeftIcon={() => {
              return (
                <View style={{marginRight: 20}}>
                  <Icon name="storefront" size={30} color={Colors.btnColor} />
                </View>
              );
            }}
          />
        </View>
      </View> */}
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
      {/* {
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.001)'}}>
          <ScrollView style={{flex: 1, padding: 16}}>
            <Text variant="headlineMedium" style={{fontWeight: '700'}}>
              Beranda
            </Text>
            <Pressable
              style={styles.calendar}
              onPress={() => setShowDate(true)}>
              <Icon name="calendar-month" size={30} color={Colors.btnColor} />
              <Text
                style={{
                  marginHorizontal: 10,
                  fontSize: 18,
                  flex: 1,
                }}
                variant="titleMedium">
                {FormatDateTime(date.toISOString()).realDate}
              </Text>
              <Edit width={25} height={25} fill="grey" />
            </Pressable>
            {showDate && (
              <DateTimePicker
                value={date}
                mode="date"
                onChange={handleDate}
                maximumDate={new Date()}
                negativeButton={{label: 'Batal', textColor: Colors.deleteColor}}
              />
            )}
          </ScrollView>
        </View>
      } */}
      <View style={styles.whiteLayer}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            padding: 10,
          }}>
          Pilih Opsi
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 10,
            padding: 15,
            backgroundColor: 'rgba(0,0,0,0.07)',
            borderRadius: 5,
            shadowColor: 'black',
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 10,
            shadowRadius: 10,
          }}>
          <Expanse width={40} height={40} />
          <Text
            variant="titleMedium"
            style={{fontWeight: '700', marginHorizontal: 15}}>
            Catatan Pengeluaran
          </Text>
          <Right width={25} height={25} />
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
    height: '35%',
    width: '45%',
    backgroundColor: 'rgba(0,0,0,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 20,
    borderRadius: 10,
  },
});
