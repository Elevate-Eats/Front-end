import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL, API_KEY} from '@env';

const PostData = async ({operation, endpoint, payload}) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const res = await axios.post(
      `${API_URL}/${operation}/${endpoint}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default PostData;
