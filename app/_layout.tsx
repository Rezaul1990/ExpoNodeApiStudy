import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import CustomBottomTab from '@/components/CustomBottomTab';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const pathname = usePathname(); // e.g. "/screens/dashboard"
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  
  const showTab = pathname.startsWith('/screens');

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 200,
            contentStyle: { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="authentication" />
          <Stack.Screen name="screens" />
        </Stack>
        <StatusBar style="auto" />
        {showTab && <CustomBottomTab />}
      </View>

    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: {
    flex: 1,
    backgroundColor: '#0E477C',
    justifyContent: 'center',
    alignItems: 'center',
  },
});