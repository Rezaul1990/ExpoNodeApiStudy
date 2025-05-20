import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function AuthenticationLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 200,
        contentStyle: { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }
      }}
    >
      <Stack.Screen name="login/LoginScreen" />
      <Stack.Screen name="register/RegisterScreen" />
      <Stack.Screen name="profile/ProfileScreen" />
    </Stack>
  );
} 