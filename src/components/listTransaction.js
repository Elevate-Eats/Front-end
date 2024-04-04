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
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => {
        const handlePress = () => props.onPress(item);
        return (
          <View style={{marginVertical: 10}}>
            <View style={styles.item}>
              <View style={styles.icon}>
                <Ionicons name="fast-food" size={40} />
              </View>

              <View style={{marginHorizontal: 15, flex: 1}}>
                <TouchableOpacity onPress={handlePress}>
                  <Text variant="titleMedium" style={{fontSize: 16}}>
                    {item.name}
                  </Text>
                  <Text
                    variant="labelMedium"
                    style={{color: 'rgba(0,0,0,0.4)'}}>
                    {item.category}
                  </Text>
                </TouchableOpacity>
                <View style={styles.wrapCounter}>
                  <TouchableOpacity style={styles.counter}>
                    <Ionicons name="remove" size={20} color="white" />
                  </TouchableOpacity>
                  <Text variant="titleMedium">0</Text>
                  <TouchableOpacity style={styles.counter}>
                    <Ionicons name="add" size={20} color="white" />
                  </TouchableOpacity>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text variant="titleMedium">{}</Text>
                  </View>
                </View>
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
    alignItems: 'flex-end',
    flexDirection: 'row',
    // backgroundColor: 'green',
    paddingBottom: 15,
  },
  icon: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  counter: {
    backgroundColor: Colors.btnColor,
    borderRadius: 5,
    padding: 3,
  },
  wrapCounter: {
    flexDirection: 'row',
    columnGap: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
