import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useMemo, useRef} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {Colors} from '../../../utils/colors';

const MainTransaksi = ({navigation}) => {
  const snapPoints = useMemo(() => ['10%', '100%'], []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.whiteLayer}></View>
      <BottomSheet snapPoints={snapPoints} index={0}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Transaksi 2')}
          style={{
            backgroundColor: Colors.btnColor,
            padding: 10,
            alignItems: 'center',
            marginHorizontal: 30,
          }}>
          <Text style={{color: 'white'}}>Total</Text>
        </TouchableOpacity>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default MainTransaksi;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  whiteLayer: {
    flex: 9 / 10,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    elevation: 1,
    padding: 10,
  },
});
