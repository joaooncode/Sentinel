import { Link } from "expo-router";
import { Text } from "react-native";
import "../../global.css";

import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Index() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-7xl font-sans-extrabold">Home</Text>
      <Link
        className="mt-4 p-4 text-center font-sans-bold rounded bg-primary text-white"
        href="/onboarding"
      >
        Get Started
      </Link>
      <Link
        className="mt-4 p-4 text-center font-sans-bold rounded bg-primary text-white"
        href="/sign-in"
      >
        Sign In
      </Link>
      <Link
        className="mt-4 p-4 text-center font-sans-bold rounded bg-primary text-white"
        href="/sign-up"
      >
        Sign Up
      </Link>
    </SafeAreaView>
  );
}
