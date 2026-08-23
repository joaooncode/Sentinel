import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useSSO } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type SocialAuthButtonsProps = {
  mode: "signIn" | "signUp";
  onError?: (message: string) => void;
  disabled?: boolean;
};

export default function SocialAuthButtons({
  mode,
  onError,
  disabled,
}: SocialAuthButtonsProps) {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [ssoLoading, setSsoLoading] = useState<"google" | "github" | null>(
    null,
  );

  const handleSSO = async (strategy: "oauth_google" | "oauth_github") => {
    onError?.("");
    setSsoLoading(strategy === "oauth_google" ? "google" : "github");

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      console.error("SSO Error:", err);
      onError?.(
        err?.errors?.[0]?.message ||
          err?.message ||
          "Erro ao autenticar com o provedor.",
      );
    } finally {
      setSsoLoading(null);
    }
  };

  const actionText = mode === "signUp" ? "Cadastrar" : "Continuar";
  const isBusy = disabled || ssoLoading !== null;

  return (
    <>
      <View className="gap-3">
        <TouchableOpacity
          onPress={() => handleSSO("oauth_google")}
          disabled={isBusy}
          activeOpacity={0.8}
          className="flex-row items-center justify-center rounded-2xl border border-border bg-background px-4 py-3.5 shadow-sm"
        >
          {ssoLoading === "google" ? (
            <ActivityIndicator size="small" color="#081126" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text className="ml-3 font-sans-semibold text-base text-primary">
                {actionText} com Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSSO("oauth_github")}
          disabled={isBusy}
          activeOpacity={0.8}
          className="flex-row items-center justify-center rounded-2xl border border-border bg-background px-4 py-3.5 shadow-sm"
        >
          {ssoLoading === "github" ? (
            <ActivityIndicator size="small" color="#081126" />
          ) : (
            <>
              <Ionicons name="logo-github" size={20} color="#24292e" />
              <Text className="ml-3 font-sans-semibold text-base text-primary">
                {actionText} com GitHub
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View className="auth-divider-row">
        <View className="auth-divider-line" />
        <Text className="auth-divider-text">ou com e-mail</Text>
        <View className="auth-divider-line" />
      </View>
    </>
  );
}
