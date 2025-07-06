// Powered by OnSpace.AI
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="class/[id]" />
            <Stack.Screen name="ai-assistant" />
            <Stack.Screen name="timer" />
            <Stack.Screen name="settings" />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}