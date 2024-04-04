import {
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
  Animated,
  Image,
} from 'react-native';
import React, {useEffect, useRef} from 'react';

import {Text} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sale from '../assets/icons/sale.svg';
import NoData from '../assets/icons/noData.svg';
const BottomSheet = props => {
  const slide = useRef(new Animated.Value(700)).current;

  function slideUp(params) {
    Animated.timing(slide, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  function slideDown(params) {
    Animated.timing(slide, {
      toValue: 1000,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  function closeModal(params) {
    slideDown();
    setTimeout(() => {
      props.condition(false);
    }, 400);
  }

  useEffect(() => {
    slideUp();
  });

  return (
    <Pressable onPress={closeModal} style={styles.backdrop}>
      <Pressable style={{width: '100%', height: '99%'}}>
        <Animated.View
          style={[styles.bottomSheet, {transform: [{translateY: slide}]}]}>
          <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
            <Text variant="titleMedium" style={{flex: 1, fontSize: 18}}>
              X Product
            </Text>
            <View style={{flexDirection: 'row', columnGap: 20}}>
              <TouchableOpacity>
                <Sale width={25} height={25} fill={'grey'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={25} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              rowGap: 10,
            }}>
            <NoData width={250} height={250} fill={'grey'} />
            <Text variant="headlineMedium">No Data</Text>
          </View>
        </Animated.View>
      </Pressable>
    </Pressable>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});
