import {StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';
import {Colors} from '../../utils/colors';
import {Text, Button} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {ItemDashboard, TopBar, TitleDashboard} from '../../components';

const MainDashboard = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} title={'Dashboard'} />

      <View style={styles.blueLayer}>
        <View style={styles.account}>
          <Ionicons name="person-circle-outline" size={60} color={'white'} />
          <View style={{justifyContent: 'center', rowGap: 5}}>
            <Text variant="titleLarge">Fullname</Text>
            <Text variant="titleMedium">Role</Text>
          </View>
        </View>
        <View style={styles.employee}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', columnGap: 5}}>
            <Ionicons name="people-outline" size={25} color="black" />
            <Text variant="titleLarge">10</Text>
          </View>
          <TouchableOpacity style={styles.pilihCabang}>
            <Text style={{color: 'white'}} variant="bodyMedium">
              Pilih Cabang
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.whiteLayer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{flexDirection: 'row', marginBottom: 10}}>
            {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>? */}
            <ItemDashboard iconName="logo-dropbox" name="Produk" />
            <ItemDashboard iconName="clipboard-outline" name="History" />
            {/* </ScrollView> */}
          </View>
          <View style={{rowGap: 10}}>
            <View>
              <TitleDashboard title="Bisnis hari ini" />
              <View style={styles.box}></View>
            </View>
            <View>
              <TitleDashboard title="Penjualan" />
              <View style={styles.box}></View>
            </View>
            <View>
              <TitleDashboard title="Statistik" />
              <View style={styles.box}></View>
            </View>
          </View>
        </ScrollView>
        <View style={{marginTop: 10}}>
          <Button
            mode="elevated"
            buttonColor={Colors.btnColor}
            style={{paddingVertical: 5, borderRadius: 5}}>
            <Text variant="titleMedium" style={{color: 'white'}}>
              Transaksi
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default MainDashboard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
  },
  blueLayer: {
    backgroundColor: Colors.secondaryColor,
    flex: 1 / 5,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  whiteLayer: {
    backgroundColor: 'white',
    flex: 4 / 5,
    borderRadius: 5,
    marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 10,
    elevation: 1,
    padding: 10,
  },
  pilihCabang: {
    backgroundColor: Colors.btnColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  account: {
    marginHorizontal: 10,
    columnGap: 10,
    flexDirection: 'row',
    flex: 1,
  },
  employee: {
    alignItems: 'flex-end',
    marginHorizontal: 10,
    rowGap: 5,
  },
  box: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.btnColor,
    width: 320,
    height: 160,
    borderRadius: 5,
  },
});
