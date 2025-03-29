import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

export default function RootLayout() {
  useFrameworkReady();
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Set viewport meta tags for web
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(meta);

      // Add iOS-specific meta tags
      const appleMeta = document.createElement('meta');
      appleMeta.name = 'apple-mobile-web-app-capable';
      appleMeta.content = 'yes';
      document.head.appendChild(appleMeta);

      return () => {
        document.head.removeChild(meta);
        document.head.removeChild(appleMeta);
      };
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack 
        screenOptions={{
          headerShown: false,
          contentStyle: {
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          }
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
});