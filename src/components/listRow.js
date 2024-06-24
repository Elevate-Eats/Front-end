import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

const ListRow = props => {
  // console.log('id: ', props.id);
  const manager = useSelector(state => state.manager.allManager);
  const branch = useSelector(state => state.branch.allBranch);
  const [data, setData] = useState({
    manager: [],
  });

  useEffect(() => {
    const filteredManager = manager.filter(item => item.id === props.id);
    setData(prev => ({...prev, manager: filteredManager}));
  }, [manager, props.id]);

  function listBranch() {
    if (data.manager[0]?.role !== 'general_manager') {
      const branchAccess = data.manager[0]?.branchaccess;
      const accessIds = branchAccess?.match(/\d+/g).map(Number);
      const filteredBranches = branch.filter(branch =>
        accessIds?.includes(branch.id),
      );
      return filteredBranches;
    }
    return branch;
  }

  return (
    <View>
      <FlatList
        contentContainerStyle={{flexGrow: 1}}
        nestedScrollEnabled
        data={listBranch().sort((a, b) => a.name.localeCompare(b.name))}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => {
          const handlePress = () => props.onPress(item);
          const handleLongPress = () => props.onLongPress(item);
          const initials = item.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .slice(0, 2);
          return (
            <View style={{marginVertical: 10}}>
              <View style={[styles.item]}>
                <View style={styles.icon}>
                  <Text variant="titleLarge" style={{fontWeight: '700'}}>
                    {initials}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handlePress}
                  style={{flex: 1}}
                  onLongPress={handleLongPress}>
                  <View style={{marginHorizontal: 15}}>
                    <Text variant="titleMedium">{item.name}</Text>
                    <Text
                      variant="labelLarge"
                      style={{color: 'rgba(0,0,0,0.4)'}}>
                      {item.address || item.role}
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

export default ListRow;

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
