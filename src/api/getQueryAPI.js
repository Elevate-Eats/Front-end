import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const GetQueryAPI = async ({operation, endpoint, query}) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(
      `${API_URL}/${operation}/${endpoint}?${query}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export default GetQueryAPI;
