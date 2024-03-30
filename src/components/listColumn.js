import {StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ListColumn = props => {
  return (
    <View style={{alignItems: 'center'}}>
      <FlatList
        data={props.data}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        renderItem={({item}) => {
          const handlePress = () => {
            props.onPress(item);
          };

          const sliceName = (str, num) => {
            if (str.length <= num) {
              return str;
            }
            return str.slice(0, num) + '...';
          };

          return (
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity style={styles.employee} onPress={handlePress}>
                <Ionicons name="person-circle-outline" size={70} />
                <Text style={{textAlign: 'center'}}>
                  {sliceName(item.name, 12)}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default ListColumn;

const styles = StyleSheet.create({
  employee: {
    backgroundColor: '#eaeaea',
    width: 95,
    height: 140,
    marginHorizontal: 5,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    elevation: 2,
    rowGap: 10,
  },
});
