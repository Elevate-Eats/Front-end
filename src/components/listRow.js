import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {GetAPI} from '../api';
import {BRANCH_ENDPOINT} from '@env';

const ListRow = props => {
  // console.log('id: ', props.id);
  const manager = useSelector(state => state.manager.allManager);
  const branch = useSelector(state => state.branch.allBranch);
  const [data, setData] = useState({
    manager: [],
    branch: [],
  });

  useEffect(() => {
    const filteredManager = manager.filter(item => item.id === props.id);
    setData(prev => ({...prev, manager: filteredManager}));
    try {
      async function fetchData(params) {
        const response = await GetAPI({
          operation: BRANCH_ENDPOINT,
          endpoint: 'showBranches',
        });
        if (response.status === 200) {
          console.log(
            'espon: ',
            response.data.branchData.sort((a, b) =>
              a.name.localeCompare(b.name),
            ),
          );
          setData(prev => ({...prev, branch: response.data.branchData}));
        }
      }
      fetchData();
    } catch (error) {}
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
  }

  return (
    <View>
      <FlatList
        contentContainerStyle={{flexGrow: 1}}
        nestedScrollEnabled
        data={
          data.manager[0]?.role === 'general_manager'
            ? data.branch
            : listBranch()
        }
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
