import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Checklist from '../assets/icons/checklist-bold.svg';

const ListEmployee = props => {
  const [branchAccess, setBranchAccess] = useState([]);
  function getBranchAccess(props) {
    if (props.manager[0]?.role === 'general_manager') {
      return [];
    } else {
      const filteredBranch = props.manager.find(item => item.id === props.id);
      const branchAccess = filteredBranch?.branchaccess;
      const accessIds = branchAccess?.match(/\d+/g)?.map(Number);
      return accessIds || [];
    }
  }

  useEffect(() => {
    setBranchAccess(getBranchAccess(props));
  }, [props.manager, props.id]);

  console.log(
    'data emp: ',
    props.data
      .filter(
        item => item.branchid === null || branchAccess?.includes(item.branchid),
      )
      .sort((a, b) => {
        if (a.branchid === null && b.branchid !== null) return 1;
        if (a.branchid !== null && b.branchid === null) return 0;
      }),
  );

  return (
    <View>
      <FlatList
        data={props.data
          .filter(
            item =>
              item.branchid === null || branchAccess?.includes(item.branchid),
          )
          .sort((a, b) => {
            if (a.branchid === null && b.branchid !== null) return 1;
            if (a.branchid !== null && b.branchid === null) return -1;
            return 0;
          })}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        renderItem={({item}) => {
          function handlePress() {
            props.onPress(item);
          }
          function handleLongPress(params) {
            props.onLongPress(item);
          }
          function sliceName(str, num) {
            if (str.length <= num) {
              return str;
            }
            return str.slice(0, num) + '...';
          }
          return (
            <View style={{alignItems: 'center'}}>
              <TouchableOpacity
                style={styles.item}
                onPress={handlePress}
                onLongPress={handleLongPress}>
                <Icon name="person-circle-outline" size={70} />
                <Text style={{alignItems: 'center'}}>
                  {sliceName(item.name, 8)}
                </Text>
              </TouchableOpacity>
              <Text style={{position: 'absolute', top: 15, right: 10}}>
                {item.branchid !== null ? (
                  <Checklist width={30} height={30} />
                ) : null}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default ListEmployee;

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#eaeaea',
    width: Dimensions.get('screen').width / 3.7,
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
