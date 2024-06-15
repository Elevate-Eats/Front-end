import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text, RadioButton} from 'react-native-paper';
import Modal from 'react-native-modal';
import React, {useCallback, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../utils/colors';
import {useDispatch, useSelector} from 'react-redux';
import {selectBranch} from '../redux/branchSlice';
import {BRANCH_ENDPOINT} from '@env';
import GetData from '../utils/getData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ModalBranch = props => {
  const dispatch = useDispatch();
  const branch = useSelector(state => state.branch.allBranch);

  const [checked, setChecked] = useState(null);
  const [data, setData] = useState({
    branch: [],
    loading: false,
  });

  function handleCheck(id) {
    setChecked(id);
  }
  useEffect(() => {
    async function fetchData(params) {
      try {
        setData(prev => ({...prev, loading: true}));
        const response = await GetData({
          operation: BRANCH_ENDPOINT,
          endpoint: 'showBranches',
          resultKey: 'branchData',
        });
        setData(prev => ({...prev, branch: response}));
      } catch (error) {
        console.log('error: ', error);
      } finally {
        setData(prev => ({...prev, loading: false}));
      }
    }
    fetchData();
  }, []);

  return (
    <View>
      <Modal
        animationIn={'fadeInLeft'}
        animationOut={'fadeOutRight'}
        isVisible={props.open}
        onBackdropPress={props.close}
        onBackButtonPress={props.close}>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text variant="titleMedium" style={{flex: 1, fontWeight: '700'}}>
              Pilih Cabang
            </Text>
            <TouchableOpacity onPress={props.close}>
              <Ionicons name="close" size={25} />
            </TouchableOpacity>
          </View>

          {/* {LIST CABANG} */}
          <View style={{marginVertical: 30}}>
            <FlatList
              data={data.branch}
              keyExtractor={item => (item.id || item.menuid).toString()}
              renderItem={({item}) => {
                return (
                  <View style={styles.wrapList}>
                    <RadioButton
                      value={item.id}
                      color={Colors.btnColor}
                      status={checked === item.id ? 'checked' : 'unchecked'}
                      onPress={() => handleCheck(item.id)}
                    />
                    <Text variant="titleMedium" style={styles.branchName}>
                      {item.name}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
          <TouchableOpacity
            onPress={async () => {
              const branch = data.branch.find(b => b.id === checked);
              if (selectBranch) {
                dispatch(selectBranch(branch));
                await AsyncStorage.setItem(
                  'selectBranch',
                  JSON.stringify(branch),
                );
                props.close();
              }
              props.close();
            }}>
            <Text variant="titleLarge" style={styles.ok}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ModalBranch;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
  },
  wrapList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  branchName: {
    marginHorizontal: 15,
    fontSize: 16,
    flex: 1,
  },
  ok: {
    fontWeight: '600',
    alignSelf: 'flex-end',
    color: Colors.btnColor,
    margin: 10,
  },
});
