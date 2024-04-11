import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Text, RadioButton} from 'react-native-paper';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../utils/colors';
import {useDispatch, useSelector} from 'react-redux';
import {selectBranch} from '../redux/branchSlice';

const ModalMenu = props => {
  const branch = useSelector(s => s.branch.allBranch);
  const [checked, setChecked] = useState(null);

  function handleCheck(params) {
    setChecked(params);
  }

  function handleOK(params) {
    // props.getBranch(checked);
    if (checked === 0) {
      const b = {
        id: checked,
        name: 'Menu Company',
      };
      props.getBranch(b);
    } else {
      const b = branch.find(b => b.id === checked);
      props.getBranch(b);
    }
    props.close();
  }
  return (
    <View>
      <Modal
        animationIn={'fadeInLeft'}
        animationOut={'slideOutRight'}
        isVisible={props.open}
        onBackButtonPress={props.close}
        onBackdropPress={props.close}>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text variant="titleMedium" style={{flex: 1, fontWeight: '700'}}>
              Pilih Cabang
            </Text>
            <TouchableOpacity onPress={props.close}>
              <Ionicons name="close" size={25} />
            </TouchableOpacity>
          </View>

          <View style={{marginVertical: 30}}>
            <FlatList
              data={branch}
              keyExtractor={item => item.id.toString()}
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <RadioButton
                value={0}
                color={Colors.btnColor}
                status={checked === 0 ? 'checked' : 'unchecked'}
                onPress={() => handleCheck(0)}
              />
              <Text variant="titleMedium" style={styles.branchName}>
                Menu Company
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleOK()}>
            <Text variant="titleLarge" style={styles.ok}>
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ModalMenu;

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
