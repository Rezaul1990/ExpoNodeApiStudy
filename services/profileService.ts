import { API_BASE_URL, ENDPOINTS } from '@/constants/Api';
import { Profile } from '@/models/Profile';
import { getAuthHeader } from '@/utils/AuthHeaders';
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
  const headers = await getAuthHeader(true); // ✅ multipart
  await axios.post(`${API_BASE_URL}${ENDPOINTS.PROFILES}`, formData, { headers });
};

export const updateProfile = async (id: string, formData: FormData) => {
  const headers = await getAuthHeader(true); // ✅ multipart
  await axios.put(`${API_BASE_URL}${ENDPOINTS.PROFILES}/${id}`, formData, { headers });
};

export const deleteProfile = async (id: string) => {
  const headers = await getAuthHeader(); // ✅ default json
  await axios.delete(`${API_BASE_URL}${ENDPOINTS.PROFILES}/${id}`, { headers });
};
