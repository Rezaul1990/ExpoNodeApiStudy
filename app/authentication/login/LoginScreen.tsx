import { login } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const user = { email, password };
      const result = await login(user); // Assume result contains token

      const token = result.token; // Adjust based on your backend's response shape
      if (token) {
        await AsyncStorage.setItem('authToken', token); // Save token
        router.replace('/screens/dashboard/DashboardScreen'); // Navigate to dashboard
        console.log('Token saved:', token);
        // Navigate to home or protected screen
      } else {
        throw 'Token not found in response';
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
    </View>
  );
}
