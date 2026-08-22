import { Link } from "expo-router";
import { Text, View } from "react-native";
import "../global.css";
export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="font-bold text-success">
        Sentinel - Your Expense Tracker
      </Text>
      <Link href="/onboarding">
        <Text className="text-blue-500">Get Started</Text>
      </Link>
      <Link href="/sign-in">
        <Text className="text-blue-500">Sign In</Text>
      </Link>
      <Link href="/sign-up">
        <Text className="text-blue-500">Sign Up</Text>
      </Link>
      <Link href="/subscriptions/spotify">
        <Text className="text-blue-500">Spotify Subscription</Text>
      </Link>
      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "claude" },
        }}
      >
        <Text className="text-blue-500">Claude Max Subscription</Text>
      </Link>
    </View>
  );
}
