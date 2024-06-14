import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const GetAPI = async ({operation, endpoint}) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`${API_URL}/${operation}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default GetAPI;
