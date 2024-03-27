import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL, API_KEY} from '@env';

const postData = async ({operation, endpoint, payload}) => {
  const token = await AsyncStorage.setItem('userToken');
};
