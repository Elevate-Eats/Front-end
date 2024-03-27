import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_KEY, API_URL} from '@env';

const PostLogin = async ({endpoint, payload}) => {
  try {
    axios
      .post(`${API_URL}/${endpoint}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          apikey: API_KEY,
        },
      })
      .then(async res => {
        await AsyncStorage.setItem('userToken', res.data.token);
      });
  } catch (error) {}
};

export default PostLogin;
