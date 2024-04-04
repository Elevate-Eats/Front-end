import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {Colors} from '../../../utils/colors';
import {Text} from 'react-native-paper';

const Transaksi = () => {
  const snapPoints = useMemo(() => ['10%', '100%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleClose = bottomSheetRef.current?.close();
  const handleOpen = bottomSheetRef.current?.expand();

  return (
    <View style={{backgroundColor: Colors.backgroundColor, flex: 1}}>
      <View style={styles.whiteLayer}></View>
      <BottomSheet
        handleIndicatorStyle={{backgroundColor: Colors.btnColor}}
        snapPoints={snapPoints}
        index={0}
        // enablePanDownToClose={false}
        ref={bottomSheetRef}>
        <View style={{flex: 1, marginHorizontal: 30}}>
          <View style={{flex: 1, backgroundColor: 'green'}}>
            <Text style={{justifyContent: 'flex-end'}}>New Text</Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.btnColor,
              paddingVertical: 15,
              alignItems: 'center',
              borderRadius: 5,
              marginBottom: 20,
            }}>
            <Text style={{color: 'white'}}>Total</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
};

export default Transaksi;

const styles = StyleSheet.create({
  whiteLayer: {
    flex: 9 / 10,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 5,
    elevation: 1,
    padding: 10,
  },
});
