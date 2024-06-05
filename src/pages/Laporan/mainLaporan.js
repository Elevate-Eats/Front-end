import {
  Dimensions,
  Modal,
  PermissionsAndroid,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useState} from 'react';
import Expanse from '../../assets/icons/cash-out.svg';
import Print from '../../assets/icons/download_file.svg';
import Right from '../../assets/icons/arrow-right.svg';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../utils/colors';
import {ConstButton, TopBar} from '../../components';
import Store from '../../assets/icons/store-bulk.svg';
import Calendar from '../../assets/icons/calendar-bulk.svg';
import ArrowDown from '../../assets/icons/arrow-down-bulk.svg';
import RNFetchBlob from 'rn-fetch-blob';
import Pdf from 'react-native-pdf';
import {Buffer} from 'buffer';
import ContentPage from '../../components/contentPage';
import Close from '../../assets/icons/close-bold.svg';
import {Dropdown} from 'react-native-element-dropdown';
import {useSelector} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import FormatDateTime from '../../utils/formatDateTime';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL, REPORT_ENDPOINT} from '@env';
import FormatDateToISO from '../../utils/formatDateToIso';
global.Buffer = Buffer;

const MainLaporan = () => {
  const {allBranch} = useSelector(state => state.branch);
  const navigation = useNavigation();
  const [pdfFile, setPdfFile] = useState({
    path: '',
    loading: false,
  });
  const [modal, setModal] = useState({
    visible: false,
  });
  const [dropdown, setDropdown] = useState({
    focus: false,
    value: null,
    label: null,
  });
  const [calendar, setCalendar] = useState({
    date: new Date(),
    show: false,
    dateNow: null,
  });
  function handlePress(params) {
    navigation.navigate(params);
  }

  // console.log(
  //   `${dropdown.value} - ${FormatDateToISO(FormatDateTime(calendar.dateNow).realDate)}`,
  // );

  async function handleDownload(params) {
    setPdfFile(prev => ({...prev, loading: true}));
    try {
      const token = await AsyncStorage.getItem('userToken');
      const pdfData = await axios.get(
        `${API_URL}/${REPORT_ENDPOINT}/showDailyReport?branchId=${dropdown.value}&date=${FormatDateToISO(FormatDateTime(calendar.dateNow).realDate)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'arraybuffer',
        },
      );

      const base64 = Buffer.from(pdfData.data, 'binary').toString('base64');
      const dirs = RNFetchBlob.fs.dirs;
      const filename = `${dropdown.label} - ${FormatDateTime(calendar.dateNow).realDate}.pdf`;
      const path = `${dirs.DownloadDir}/Elevate/${filename}`;

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to download files',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const isDir = await RNFetchBlob.fs.isDir(`${dirs.DownloadDir}/Elevate`);
        if (!isDir) {
          await RNFetchBlob.fs.mkdir(`${dirs.DownloadDir}/Elevate`);
        }

        await RNFetchBlob.fs.writeFile(path, base64, 'base64');
        setPdfFile(prev => ({...prev, path: path}));
        ToastAndroid.show(`File successfully downloaded`, ToastAndroid.BOTTOM);
      } else {
        ToastAndroid.show(`Storage Permission Denied`, ToastAndroid.BOTTOM);
        throw new Error('Storage Permission Denied');
      }
      // await RNFetchBlob.fs.writeFile(path, base64, 'base64');
      // setPdfFile(prev => ({...prev, path: path}));
    } catch (error) {
      console.log('error: ', error);
      ToastAndroid.show(`Failed to download file`, ToastAndroid.BOTTOM);
    } finally {
      setPdfFile(prev => ({...prev, loading: false}));
    }
  }

  function handleCalendar(event, selectedDate) {
    if (!selectedDate) {
      setCalendar(prev => ({
        ...prev,
        dateNow: null,
        show: false,
      }));
      return;
    }
    setCalendar(prev => ({
      ...prev,
      dateNow: selectedDate,
      show: false,
    }));
  }

  function downloadReport(params) {
    const listBranch = Object.values(allBranch).map(item => ({
      label: item.name,
      value: item.id,
    }));
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modal.visible}
        onRequestClose={() => setModal(prev => ({...prev, visible: false}))}>
        <SafeAreaView style={styles.centeredView}>
          <View style={[styles.modalView]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.textHeader, {flex: 1}]}>Unduh Laporan</Text>
              <TouchableOpacity
                onPress={() => setModal(prev => ({...prev, visible: false}))}>
                <Close width={35} height={35} />
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <Dropdown
                data={listBranch}
                mode="modal"
                search
                maxHeight={200}
                labelField={'label'}
                valueField={'value'}
                value={dropdown.value}
                placeholder="Pilih Cabang"
                placeholderStyle={{fontWeight: '500'}}
                style={styles.dropdown}
                selectedTextStyle={styles.selectedTextStyle}
                onBlur={() => setDropdown(prev => ({...prev, focus: false}))}
                onFocus={() => setDropdown(prev => ({...prev, focus: true}))}
                onChange={item => {
                  setDropdown(prev => ({
                    ...prev,
                    value: item.value,
                    focus: false,
                    label: item.label,
                  }));
                }}
                renderLeftIcon={() => (
                  <View style={{marginRight: 10}}>
                    <Store width={25} height={25} />
                  </View>
                )}
                renderRightIcon={() => <ArrowDown width={15} height={15} />}
              />
              <Pressable
                style={[
                  styles.dropdown,
                  {flexDirection: 'row', gap: 10, alignItems: 'center'},
                ]}
                onPress={() => setCalendar(prev => ({...prev, show: true}))}>
                <Calendar width={25} height={25} />
                <Text
                  variant="titleMedium"
                  style={{
                    color: calendar.dateNow ? '#000' : 'grey',
                    paddingVertical: 4,
                    flex: 1,
                  }}>
                  {calendar.dateNow
                    ? FormatDateTime(calendar.dateNow).realDate
                    : 'Pilih Tanggal'}
                </Text>
                <ArrowDown width={15} height={15} />
              </Pressable>
              {calendar.show && (
                <DateTimePicker
                  mode="date"
                  value={calendar.dateNow || calendar.date}
                  onChange={handleCalendar}
                  maximumDate={calendar.date}
                />
              )}
            </View>
            <View style={{marginTop: 30}}>
              <ConstButton
                loading={pdfFile.loading}
                onPress={() => handleDownload()}
                disabled={calendar.dateNow && dropdown.value ? false : true}
                title="Download File"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  // console.log('clder: ', calendar);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
      <TopBar title="Laporan Pengeluaran" navigation={navigation} />
      <ScrollView style={[styles.whiteLayer, {flexGrow: 1}]}>
        {downloadReport(modal.visible)}
        <View style={{marginVertical: 15}}>
          <Text style={styles.textOpsi}>Pilih Opsi</Text>
          <ContentPage
            Icon={Expanse}
            title="Catatan Pengeluaran"
            onPress={() => handlePress('Pengeluaran')}
          />
          <ContentPage
            Icon={Print}
            title="Unduh Laporan"
            onPress={() => setModal(prev => ({...prev, visible: true}))}
          />
        </View>
        {/* {pdfFile.path ? (
          <Pdf
            source={{uri: pdfFile.path, cache: true}}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log('number page: ', numberOfPages);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log('current page: ', page);
            }}
            onError={error => {
              console.log('error: ', error);
            }}
            style={styles.pdf}
          />
        ) : null} */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainLaporan;

const styles = StyleSheet.create({
  textOpsi: {
    fontSize: 20,
    fontWeight: '700',
    padding: 10,
  },
  pdf: {
    // flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  whiteLayer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 5,
    elevation: 1,
    paddingHorizontal: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 10,
  },
  textHeader: {
    fontWeight: '900',
    fontSize: 18,
    marginVertical: 20,
  },
  dropdown: {
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
  },
  selectedTextStyle: {
    fontWeight: '500',
    // fontSize: 18,
    color: '#000',
    textTransform: 'uppercase',
  },
  content: {
    rowGap: 20,
    paddingVertical: 15,
  },
});
