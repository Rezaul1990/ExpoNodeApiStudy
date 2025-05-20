// services/authService.ts
import { API_BASE_URL, ENDPOINTS } from '@/constants/Api';
import axios from 'axios';
import { User } from '../models/User';

export const login = async (user: User) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${ENDPOINTS.LOGIN}`,
      JSON.stringify(user),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // return token or user info
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
