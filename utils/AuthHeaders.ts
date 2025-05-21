import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAuthHeader = async (isMultipart = false) => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) throw new Error('Auth token missing');

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
  };
};
