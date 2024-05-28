import {StyleSheet, View, KeyboardAvoidingView} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors} from '../../../utils/colors';
import {
  BtnAdd,
  SearchBox,
  ListRow,
  DataError,
  LoadingIndicator,
} from '../../../components';
import {useFocusEffect} from '@react-navigation/native';
import GetData from '../../../utils/getData';
import {BRANCH_ENDPOINT} from '@env';
import Store from '../../../assets/icons/store.svg';

const PilihCabang = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [branch, setBranch] = useState({});

  useFocusEffect(
    useCallback(() => {
      async function fetchData(params) {
        setLoading(true);
        try {
          const action = await GetData({
            operation: BRANCH_ENDPOINT,
            endpoint: 'showBranches',
            resultKey: 'branchData',
          });
          setBranch(action);
        } catch (error) {
          setError('Branch not found');
        } finally {
          setLoading(false);
        }
      }
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
          {error ? (
            <View style={styles.dataError}>
              <Store width={200} height={200} />
              <DataError data={error} />
            </View>
          ) : (
            <ListRow
              data={branch}
              onPress={item => navigation.navigate('Edit Cabang', {item})}
            />
          )}
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
  dataError: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 20,
  },
});
