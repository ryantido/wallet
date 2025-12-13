import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import "@/global.css"

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{          
          presentation: "formSheet",
          title: "Modal",
          animation: "slide_from_bottom",
          sheetCornerRadius: 10,
          sheetAllowedDetents: [0.5, 0.9],                   
        }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
