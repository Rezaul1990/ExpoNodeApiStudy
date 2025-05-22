import { API_BASE_URL, ENDPOINTS } from '@/constants/Api';
import { getAuthHeader } from '@/utils/AuthHeaders';
import axios from 'axios';



// ✅ GET all classes
export const getAllClasses = async () => {
  const headers = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.CLASSES}`, { headers });
  return response.data;
};

// ✅ POST - Create
export const createClass = async (payload: { name: string; description?: string }) => {
  const headers = await getAuthHeader();
  const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.CLASSES}`, payload, { headers });
  return response.data;
};

// ✅ PUT - Update
export const updateClassById = async (
  id: string,
  payload: { name: string; description?: string }
) => {
  const headers = await getAuthHeader();
  const response = await axios.put(`${API_BASE_URL}${ENDPOINTS.CLASSES}/${id}`, payload, {
    headers,
  });
  return response.data;
};

// ✅ DELETE
export const deleteClassById = async (id: string) => {
  const headers = await getAuthHeader();
  await axios.delete(`${API_BASE_URL}${ENDPOINTS.CLASSES}/${id}`, { headers });
};

// ✅ ENROLL in class
export const enrollInClass = async (classId: string) => {
  const headers = await getAuthHeader();
  const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.CLASSES}/enroll/${classId}`, {}, { headers });
  return response.data;
};

// ✅ GET: Enrolled classes for logged-in user
export const getEnrolledClasses = async () => {
  const headers = await getAuthHeader();
  const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.USER_ENROLLED_CLASSES}`, {
     headers 
  });
  return response.data;
};

// ✅ GET: All enrolled classes (admin view)
export const getAdminEnrolledClasses = async () => {
  const headers = await getAuthHeader();

  const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.ADMIN_ENROLLED_CLASSES}`, {
    headers,
  });

  return response.data; // expects array of classes with enrolledUsers
};
