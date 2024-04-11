import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../utils/colors';
import {useDispatch} from 'react-redux';
import {manyBranch} from '../redux/branchSlice';

const ModalBranchCheckBox = props => {
  const dispatch = useDispatch();
  const branch = useSelector(s => s.branch.allBranch);
  const listBranch = useSelector(s => s.branch.manyBranch);

  const [checked, setChecked] = useState({});

  function handleOK() {
    const b = Object.entries(checked)
      .filter(([key, value]) => value)
      .map(([key]) => {
        return branch.find(b => b.id.toString() === key);
      });
    dispatch(manyBranch(b));
    props.close();
  }

  return (
    <View>
      <Modal
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        isVisible={props.open}
        onBackButtonPress={props.close}
        onBackdropPress={props.close}>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text variant="titleMedium" style={{flex: 1, fontWeight: '700'}}>
              Pilih Cabang
            </Text>
            <TouchableOpacity onPress={props.close}>
              <Icon name="close" size={25} />
            </TouchableOpacity>
          </View>

          <View style={{marginVertical: 30}}>
            <FlatList
              data={branch}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                function handleCheck(item, newValue) {
                  setChecked(prev => ({...prev, [item.id]: newValue}));
                }

                return (
                  <View style={styles.wrapList}>
                    <CheckBox
                      onValueChange={newValue => {
                        handleCheck(item, newValue);
                      }}
                      value={checked[item.id] || false}
                    />
                    <Text variant="titleMedium" style={styles.branchName}>
                      {item.name}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
          <TouchableOpacity onPress={handleOK}>
            <Text variant="titleLarge" style={styles.ok}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ModalBranchCheckBox;

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
    fontSize: 18,
    flex: 1,
  },
  ok: {
    fontWeight: '700',
    alignSelf: 'flex-end',
    color: Colors.btnColor,
    margin: 10,
  },
});
