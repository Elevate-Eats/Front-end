import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';

const ListMenu = props => {
  const menu = Object.values(props.data).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  return (
    <View>
      <FlatList
        data={menu}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => {
          const handlePress = () => props.onPress(item);
          const initials = item.name
            .split(' ')
            .map(word => word[0])
            .join('');
          return (
            <View style={{marginVertical: 10}}>
              <View style={styles.item}>
                <View style={styles.icon}>
                  <Text variant="titleLarge" style={{fontWeight: '700'}}>
                    {initials}
                  </Text>
                </View>
                <TouchableOpacity onPress={handlePress}>
                  <View style={{marginHorizontal: 15}}>
                    <Text variant="titleLarge">{item.name}</Text>
                    <Text
                      variant="labelLarge"
                      style={{color: 'rgba(0,0,0,0.4)'}}>
                      {item.category}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default ListMenu;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});
