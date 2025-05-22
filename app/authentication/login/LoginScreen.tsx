import { login } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
    const credentials = { email, password };
    const result = await login(credentials); // expects { token, user }

    const token = result.token;
    const user = result.user;

    if (token && user) {
      // ✅ Save token
      await AsyncStorage.setItem('authToken', token);

      // ✅ Store user in zustand + AsyncStorage
      useAuthStore.getState().setUser(user);

      console.log('Login success. User ID:', user._id);
      router.replace('/authentication/profile/ProfileScreen');
    } else {
      throw 'Token or user not found in response';
    }
  } catch (err) {
    console.error('Login failed:', err);
    Alert.alert('Error', typeof err === 'string' ? err : 'Login failed');
  }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: '80%' }}>
        <Text style={{ fontSize: 24, marginBottom: 20, textAlign: 'center' }}>Login Page</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{ borderWidth: 1, marginVertical: 10, padding: 8, borderRadius: 6 }}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderWidth: 1, marginVertical: 10, padding: 8, borderRadius: 6 }}
        />

        <Button title="Login" onPress={handleLogin} />
      </View>
      <TouchableOpacity onPress={() => router.push('/authentication/register/RegisterScreen')}>
          <Text style={{ marginTop: 20, color: 'blue', textAlign: 'center' }}>
            New here? Register now
          </Text>
        </TouchableOpacity>
    </View>
  );
}
