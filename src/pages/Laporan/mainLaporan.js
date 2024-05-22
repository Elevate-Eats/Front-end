import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
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
import {TopBar} from '../../components';
import RNFetchBlob from 'rn-fetch-blob';
import Pdf from 'react-native-pdf';
import {Buffer} from 'buffer';
import ContentPage from '../../components/contentPage';
global.Buffer = Buffer;

const MainLaporan = () => {
  const navigation = useNavigation();
  const [filePath, setFilePath] = useState('');
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [transaction, setTransaction] = useState({});
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
      <ScrollView style={[styles.whiteLayer, {flexGrow: 1}]}>
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
            onPress={() => console.log('PRess')}
          />
        </View>
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
  whiteLayer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 5,
    elevation: 1,
    paddingHorizontal: 10,
  },
});
