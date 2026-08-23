import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import SocialAuthButtons from "@/components/SocialAuthButtons";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isSubmitting = fetchStatus === "fetching";

  const handleSignIn = async () => {
    if (!emailAddress || !password) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }
    setErrorMessage("");

    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      });

      if (error) {
        setErrorMessage(
          error.message || "Erro ao entrar. Verifique suas credenciais.",
        );
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) return;
            const url = decorateUrl("/");
            if (url.startsWith("http")) {
              window.location.href = url;
            } else {
              router.replace("/(tabs)");
            }
          },
        });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Ocorreu um erro ao entrar.");
    }
  };

  const hasIdentifierError = Boolean(errors?.fields?.identifier);
  const hasPasswordError = Boolean(errors?.fields?.password);

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">S</Text>
              </View>
              <View>
                <Text className="auth-wordmark">Sentinel</Text>
                <Text className="auth-wordmark-sub">Subscription Manager</Text>
              </View>
            </View>
            <Text className="auth-title">Bem-vindo de volta</Text>
            <Text className="auth-subtitle">
              Acesse sua conta para gerenciar suas assinaturas
            </Text>
          </View>

          <View className="auth-card">
            {errorMessage ? (
              <View className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5">
                <Text className="auth-error text-sm">{errorMessage}</Text>
              </View>
            ) : null}

            {/* Social Sign-In Buttons */}
            <SocialAuthButtons
              mode="signIn"
              onError={setErrorMessage}
              disabled={isSubmitting}
            />

            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">E-mail</Text>
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="seu@email.com"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  className={`auth-input ${hasIdentifierError ? "auth-input-error" : ""}`}
                />
                {errors?.fields?.identifier ? (
                  <Text className="auth-error">
                    {errors.fields.identifier.message}
                  </Text>
                ) : null}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Senha</Text>
                <TextInput
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                  value={password}
                  onChangeText={setPassword}
                  className={`auth-input ${hasPasswordError ? "auth-input-error" : ""}`}
                />
                {errors?.fields?.password ? (
                  <Text className="auth-error">
                    {errors.fields.password.message}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                onPress={handleSignIn}
                disabled={isSubmitting}
                activeOpacity={0.8}
                className={`auth-button ${isSubmitting ? "auth-button-disabled" : ""}`}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#081126" />
                ) : (
                  <Text className="auth-button-text">Entrar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View className="auth-link-row">
            <Text className="auth-link-copy">Não tem uma conta?</Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text className="auth-link">Criar conta</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
