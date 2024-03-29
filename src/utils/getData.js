import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const GetData = async ({operation, endpoint, resultKey}) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const res = await axios.get(`${API_URL}/${operation}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (resultKey && res.data[resultKey]) {
      return res.data[resultKey];
    }
    return res.data;
  } catch (error) {
    console.log(error);
    console.log('Erorr');
    throw error;
  }
};

export default GetData;
