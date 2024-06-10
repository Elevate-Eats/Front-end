import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text, RadioButton} from 'react-native-paper';
import Modal from 'react-native-modal';
import React, {useCallback, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../utils/colors';
import {useDispatch, useSelector} from 'react-redux';
import {selectBranch} from '../redux/branchSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ModalBranch = props => {
  const dispatch = useDispatch();
  const branch = useSelector(state => state.branch.allBranch);
  const [checked, setChecked] = useState(null);

  function handleCheck(params) {
    setChecked(params);
  }

  async function saveBranchName(branchName) {
    try {
      await AsyncStorage.setItem('branchName', branchName);
    } catch (error) {
      console.log('error');
    }
  }

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
              data={branch}
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
            onPress={() => {
              const b = branch.find(b => b.id === checked);
              if (selectBranch) {
                dispatch(selectBranch(b));
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
