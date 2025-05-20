// services/profileService.ts
import { API_BASE_URL, ENDPOINTS } from '@/constants/Api';
import { Profile } from '@/models/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const getProfileData = async (token: string): Promise<Profile[]> => {
  const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.PROFILES}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addProfile = async (formData: FormData) => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) throw new Error('Auth token missing');
  await axios.post(`${API_BASE_URL}${ENDPOINTS.PROFILES}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProfile = async (id: string, formData: FormData) => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) throw new Error('Auth token missing');
  await axios.put(`${API_BASE_URL}${ENDPOINTS.PROFILES}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProfile = async (id: string) => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) throw new Error('Auth token missing');

  await axios.delete(`${API_BASE_URL}${ENDPOINTS.PROFILES}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
