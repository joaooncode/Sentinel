import "../global.css";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";

import { SubscriptionProvider } from "@/context/SubscriptionContext";

// Garante o fechamento correto de sessões OAuth no mobile/web
WebBrowser.maybeCompleteAuthSession();

SplashScreen.preventAutoHideAsync().catch(() => {
  /* Ignorar rejeição em reloads rápidos */
});

// Error Boundary Global do Expo Router
export function ErrorBoundary({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <Text className="mb-2 text-xl font-sans-bold text-destructive">
        Ops! Algo deu errado.
      </Text>
      <Text className="mb-6 text-center text-sm font-sans text-muted-foreground">
        {error?.message || "Ocorreu um erro inesperado."}
      </Text>
      <TouchableOpacity
        onPress={retry}
        className="rounded-2xl bg-primary px-6 py-3"
      >
        <Text className="font-sans-semibold text-white">Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

function InitialLayout() {
  const { isLoaded: authLoaded } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    "sans-regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extrabold": require("@/assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("@/assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && authLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, authLoaded]);

  if ((!fontsLoaded && !fontError) || !authLoaded) return null;

  return (
    <SubscriptionProvider>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)" />
    </SubscriptionProvider>
  );
}

export default function RootLayout() {
  if (!publishableKey) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-center text-lg font-sans-bold text-destructive">
          Configuração Ausente
        </Text>
        <Text className="mt-2 text-center text-sm font-sans text-muted-foreground">
          Defina EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY no arquivo .env para iniciar
          o app.
        </Text>
      </View>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <InitialLayout />
    </ClerkProvider>
  );
}
