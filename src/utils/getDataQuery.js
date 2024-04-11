import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const getDataQuery = async ({operation, endpoint, resultKey, query}) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const res = await axios.get(
      `${API_URL}/${operation}/${endpoint}?${query}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (resultKey && res.data[resultKey]) {
      return res.data[resultKey];
    }
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default getDataQuery;
