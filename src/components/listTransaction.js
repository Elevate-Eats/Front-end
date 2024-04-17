import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../utils/colors';
const ListTransaction = props => {
  const menu = Object.values(props.data).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  return (
    <FlatList
      data={menu}
      keyExtractor={item => (item.id || item.menuid).toString()}
      renderItem={({item}) => {
        const handlePress = () => props.onPress(item);
        return (
          <View style={{marginVertical: 5}}>
            <View style={styles.item}>
              <View style={styles.icon}>
                <Ionicons name="fast-food" size={30} color="grey" />
              </View>

              <View style={{marginHorizontal: 15, flex: 1}}>
                <TouchableOpacity onPress={handlePress} style={{rowGap: 8}}>
                  <Text variant="titleMedium">{item.name}</Text>
                  <Text
                    variant="labelMedium"
                    style={{color: 'rgba(0,0,0,0.4)'}}>
                    {item.category}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.separator} />
          </View>
        );
      }}
    />
  );
};

export default ListTransaction;

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: 'green',
    paddingBottom: 5,
  },
  icon: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },

  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
