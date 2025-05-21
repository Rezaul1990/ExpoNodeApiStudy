// services/coachService.ts
import { API_BASE_URL } from '@/constants/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const getAllCoaches = async () => {
  const token = await AsyncStorage.getItem('authToken');
  const response = await axios.get(`${API_BASE_URL}/coaches`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};