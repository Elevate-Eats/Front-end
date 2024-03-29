import {StyleSheet, View, KeyboardAvoidingView} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors} from '../../../utils/colors';
import {
  BtnAdd,
  SearchBox,
  LoadingIndicator,
  ListRow,
  DataError,
} from '../../../components';
import {useFocusEffect} from '@react-navigation/native';
import GetData from '../../../utils/getData';
import {BRANCH_ENDPOINT} from '@env';

const PilihCabang = ({navigation}) => {
  const [branch, setBranch] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const dataBranch = await GetData({
            operation: BRANCH_ENDPOINT,
            endpoint: 'showBranches',
            resultKey: 'branchData',
          });
          setBranch(dataBranch);
        } catch (error) {
          setError('Branch Not Found !');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []),
  );
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.whiteLayer}>
        <SearchBox search="Cari cabang ..." />
        <View style={{flex: 1, marginVertical: 10}}>
          {error ? <DataError data={error} /> : <ListRow data={branch} />}
        </View>
      </View>
      <BtnAdd onPress={() => navigation.navigate('Tambah Cabang')} />
    </KeyboardAvoidingView>
  );
};

export default PilihCabang;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  whiteLayer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    elevation: 1,
    padding: 10,
  },
  ifError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});
