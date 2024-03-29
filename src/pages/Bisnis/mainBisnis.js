import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import {Colors} from '../../utils/colors';
import {ItemBisnis, TopBar} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MainBisnis = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} title={'Bisnis'} />
      <View style={styles.whiteLayer}>
        <ItemBisnis
          title="Cabang"
          onPress={() => navigation.navigate('Pilih Cabang')}
        />
        <ItemBisnis title="Manager" />
        <ItemBisnis title="Pegawai" />
      </View>
    </View>
  );
};

export default MainBisnis;

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
});
