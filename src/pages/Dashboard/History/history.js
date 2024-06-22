import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  ConstButton,
  LoadingIndicator,
  SearchBox,
  TopBar,
} from '../../../components';
import {Colors} from '../../../utils/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FormatRP from '../../../utils/formatRP';
import Receipt from '../../../assets/icons/receipt-bulk.svg';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import getDataQuery from '../../../utils/getDataQuery';
import {TRANSACTION_ENDPOINT} from '@env';
import PostData from '../../../utils/postData';
import FormatDateTime from '../../../utils/formatDateTime';
import StoreFront from '../../../assets/icons/store.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const History = ({route}) => {
  const navigation = useNavigation();
  const selectedBranch = useSelector(state => state.branch.selectedBranch);
  // console.log('branchId: ', selectedBranch.id);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    transaction: [],
    loading: false,
    page: 1,
    branch: [],
  });

  const [dropdown, setDropdown] = useState({
    focus: false,
    value: null,
  });

  const listBranch = useMemo(() => {
    const branches = data.branch.map(item => ({
      value: item.id,
      label: item.name.toUpperCase(),
    }));
    branches.push({
      value: 0,
      label: 'Semua Cabang',
    });
    return branches;
  }, [data.branch]);

  async function fetchData(params) {
    try {
      setData(prev => ({...prev, loading: true}));
      const response = await getDataQuery({
        operation: TRANSACTION_ENDPOINT,
        endpoint: 'showTransactions',
        resultKey: 'transactions',
        query: `branch=${dropdown.value}&limit=50`,
      });
      if (response) {
        setData(prev => ({...prev, transaction: response}));
      }
    } catch (error) {
      setData(prev => ({...prev, transaction: []}));
    } finally {
      setData(prev => ({
        ...prev,
        loading: false,
      }));
    }
  }

  useEffect(() => {
    async function fetchDataLocal(params) {
      const response = await AsyncStorage.getItem('allBranch');
      if (response) {
        setData(prev => ({...prev, branch: JSON.parse(response)}));
      }
    }
    fetchDataLocal();
  }, []);

  useEffect(() => {
    fetchData();
  }, [dropdown.value]);

  const handleDelete = useCallback(
    async id => {
      try {
        setLoading(true);
        const action = await PostData({
          operation: TRANSACTION_ENDPOINT,
          endpoint: 'deleteTransaction',
          payload: {id},
        });
        if (action) {
          ToastAndroid.show(
            'Delete Transaction Successfully!',
            ToastAndroid.SHORT,
          );
          setPage(1); // Reset page to 1 to refresh the list after deletion
          fetchData();
        }
      } catch (error) {
        ToastAndroid.show('Error deleting transaction', ToastAndroid.SHORT);
      } finally {
        setLoading(false);
      }
    },
    [fetchData],
  );

  const renderItem = useCallback(
    ({item}) => (
      <View>
        <View style={[styles.icon, {flexDirection: 'row'}]}>
          <Receipt width={35} height={35} />
          <TouchableOpacity
            onLongPress={() =>
              Alert.alert(
                'Delete Transaction',
                'Delete transaction',
                [{text: 'Batal'}, {text: 'OK', onPress: () => handleDelete()}],
                {cancelable: true},
              )
            }
            onPress={() => navigation.navigate('Detail History', {data: item})}
            // onPress={() => console.log('item: ', item)}
            style={styles.itemContainer}>
            <View style={styles.itemRow}>
              <Text variant="titleMedium" style={styles.paymentMethod}>
                {item.paymentmethod === '0' ? 'Cash' : 'Transfer'}
              </Text>
              <Text variant="titleMedium" style={styles.totalPrice}>
                {FormatRP(item.totalprice)}
              </Text>
            </View>
            <View style={styles.itemRow}>
              <Text variant="titleMedium" style={styles.itemDate}>
                {FormatDateTime(item.transactiondate).realDate}
              </Text>
              <Text variant="titleMedium" style={styles.itemTime}>
                {FormatDateTime(item.transactiondate).realTime}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [navigation],
  );

  const renderLoader = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="small" style={styles.loader} />
      <Text>Please Wait ...</Text>
    </View>
  );

  if (data.loading) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dropdownContainer}>
          <Dropdown
            mode="modal"
            style={[
              styles.dropdown,
              dropdown.focus && {borderColor: Colors.btnColor},
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={listBranch.sort((a, b) => a.label.localeCompare(b.label))}
            itemTextStyle={styles.itemTextStyle}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Pilih Cabang"
            searchPlaceholder="Search ..."
            value={dropdown.value}
            onFocus={() => setDropdown(prev => ({...prev, focus: true}))}
            onBlur={() => setDropdown(prev => ({...prev, focus: false}))}
            onChange={item =>
              setDropdown(prev => ({
                ...prev,
                value: item.value,
                focus: false,
              }))
            }
            renderLeftIcon={() => (
              <View style={styles.iconContainer}>
                <Icon name="storefront" size={25} color={Colors.btnColor} />
              </View>
            )}
          />
        </View>
      </View>
      <View style={styles.listContainer}>
        {dropdown.value !== null ? (
          data.transaction.length !== 0 ? (
            <View>
              <FlatList
                data={data.transaction.sort((a, b) =>
                  b.transactiondate.localeCompare(a.transactiondate),
                )}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
              />
            </View>
          ) : (
            <View></View>
          )
        ) : (
          <View
            style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <StoreFront width={250} height={250} />
            <Text
              style={{
                fontSize: 20,
                fontStyle: 'italic',
                color: Colors.btnColor,
              }}>
              Silakan pilih cabang terlebih dahulu
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default React.memo(History);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 16,
  },
  headerTitle: {
    fontSize: 20,
  },
  dropdownContainer: {
    marginTop: 10,
  },
  dropdown: {
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.btnColor,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  itemTextStyle: {
    fontWeight: '700',
  },
  iconContainer: {
    marginRight: 20,
  },
  listContainer: {
    backgroundColor: 'rgba(0,0,0,0.0001)',
    flex: 1,
  },
  icon: {
    marginVertical: 5,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.3,
    marginHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  itemContainer: {
    paddingLeft: 15,
    flex: 1,
    justifyContent: 'center',
    rowGap: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethod: {
    fontWeight: '600',
    color: 'grey',
  },
  totalPrice: {
    color: 'green',
    fontWeight: '700',
  },
  itemDate: {
    fontWeight: '700',
  },
  itemTime: {
    color: 'grey',
  },
  loaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 10,
  },
  loader: {
    marginVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontWeight: '700',
  },
});
