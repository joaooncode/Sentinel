import {Link} from "expo-router";
import {Text} from "react-native";
import "../../global.css";

import {styled} from "nativewind"
import {SafeAreaView as RNSafeAreaView} from 'react-native-safe-area-context'

const SafeAreaView = styled(RNSafeAreaView)

export default function Index() {
    return (
        <SafeAreaView className="flex-1 p-5 bg-background">
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
            <Link
                href={{
                    pathname: "/subscriptions/[id]",
                    params: {id: "claude"},
                }}
            >
                <Text className="text-blue-500">Claude Max Subscription</Text>
            </Link>
        </SafeAreaView>
    );
}
