import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const PostAPI = async ({operation, endpoint, payload}) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.post(
      `${API_URL}/${operation}/${endpoint}`,
      payload,
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

export default PostAPI;
