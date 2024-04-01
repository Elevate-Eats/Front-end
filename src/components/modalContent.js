import {StyleSheet, TouchableOpacity, View, FlatList} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Text} from 'react-native-paper';
import {Colors} from '../utils/colors';
import CheckBox from '@react-native-community/checkbox';

const ModalContent = props => {
  const {id} = props.id;
  const [checked, setChecked] = useState({}); //Checkbox
  const [selectedEmp, setSelectedEmp] = useState([]);

  const employee = Object.values(props.data).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const handleCheck = (item, newValue) => {
    setChecked(prev => ({...prev, [item.id]: newValue}));
  };

  const handleOK = () => {
    const listEmp = Object.values(employee).filter(emp => checked[emp.id]);
    props.onClose(listEmp);
    props.close();
  };
  return (
    <View>
      <Modal
        animationIn={'fadeInUp'}
        animationInTiming={200}
        animationOut={'fadeOutDown'}
        animationOutTiming={200}
        isVisible={props.open}
        onBackdropPress={props.close}
        onBackButtonPress={props.close}>
        <View style={styles.container}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text variant="titleLarge" style={{flex: 1, fontWeight: '700'}}>
              Pilih Pegawai
            </Text>
            <TouchableOpacity onPress={props.close}>
              <Ionicons name="close" size={25} />
            </TouchableOpacity>
          </View>

          {/* LIST PEGAWAI */}
          <View style={{marginTop: 20, height: 250}}>
            <FlatList
              data={employee.filter(item => item.branchid == null)}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                return (
                  <View style={styles.wrapList}>
                    <CheckBox
                      onValueChange={newValue => {
                        handleCheck(item, newValue);
                      }}
                      value={checked[item.id] || false}
                    />
                    <Text variant="titleMedium" style={styles.empName}>
                      {item.name}
                    </Text>
                  </View>
                );
              }}
            />
            <TouchableOpacity onPress={handleOK}>
              <Text variant="titleLarge" style={styles.ok}>
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalContent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
  },
  empName: {
    marginHorizontal: 15,
    fontSize: 18,
    flex: 1,
  },
  wrapList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ok: {
    fontWeight: '600',
    alignSelf: 'flex-end',
    color: Colors.btnColor,
    margin: 10,
  },
});
