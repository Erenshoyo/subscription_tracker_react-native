import "@/global.css";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

SplashScreen.preventAutoHideAsync();

function InitialLayout({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { isLoaded } = useAuth();

  useEffect(() => {
    if (fontsLoaded && isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoaded]);

  if (!fontsLoaded || !isLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "sans-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <InitialLayout fontsLoaded={fontsLoaded} />
    </ClerkProvider>
  );
}
