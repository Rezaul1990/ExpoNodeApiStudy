import { register } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const result = await register({ username, email, password });
      const token = result.token;
      if (token) {
        await AsyncStorage.setItem('authToken', token);
        router.replace('/authentication/profile/ProfileScreen');
      } else {
        throw 'Token not found in response';
      }
    } catch (err) {
      Alert.alert('Error', 'Registration failed');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: '80%' }}>
        <Text style={{ fontSize: 24, marginBottom: 20, textAlign: 'center' }}>Register</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={{ borderWidth: 1, marginVertical: 10, padding: 8, borderRadius: 6 }}
        />

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

        <Button title="Register" onPress={handleRegister} />
      </View>
    </View>
  );
}
