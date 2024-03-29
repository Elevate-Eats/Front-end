import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors} from '../../../utils/colors';
import {BtnAdd, SearchBox, LoadingIndicator} from '../../../components';
import {useFocusEffect} from '@react-navigation/native';
import GetData from '../../../utils/getData';
import {BRANCH_ENDPOINT} from '@env';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text} from 'react-native-paper';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';

const PilihCabang = () => {
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
          {error ? (
            <View style={styles.ifError}>
              <Text variant="headlineMedium" style={{fontWeight: '700'}}>
                {error}
              </Text>
            </View>
          ) : (
            <FlatList
              data={branch}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                const initials = item.name
                  .split(' ')
                  .map(word => word[0])
                  .join('');
                return (
                  <View style={{marginVertical: 10}}>
                    <View style={styles.item}>
                      <View style={styles.icon}>
                        <Text variant="headlineMedium">{initials}</Text>
                      </View>
                      <TouchableOpacity style={{flex: 1}}>
                        <View style={{marginHorizontal: 15}}>
                          <Text variant="titleLarge">{item.name}</Text>
                          <Text variant="labelLarge" style={{color: 'grey'}}>
                            {item.address}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
      </View>
      <BtnAdd />
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
