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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-10"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8">
            <Text className="text-4xl font-sans-extrabold text-primary mb-2">
              Sentinel
            </Text>
            <Text className="text-base font-sans text-muted-foreground">
              Acesse sua conta para gerenciar suas assinaturas
            </Text>
          </View>

          {errorMessage ||
          errors?.fields?.identifier ||
          errors?.fields?.password ? (
            <View className="mb-4 p-3.5 bg-destructive/10 rounded-2xl border border-destructive/20">
              <Text className="text-destructive font-sans-medium text-sm">
                {errorMessage ||
                  errors?.fields?.identifier?.message ||
                  errors?.fields?.password?.message}
              </Text>
            </View>
          ) : null}

          {/* Social Sign-In Buttons */}
          <SocialAuthButtons
            mode="signIn"
            onError={setErrorMessage}
            disabled={isSubmitting}
          />

          <View className="gap-4">
            <View>
              <Text className="text-sm font-sans-medium text-primary mb-1.5">
                E-mail
              </Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="seu@email.com"
                placeholderTextColor="rgba(0,0,0,0.3)"
                value={emailAddress}
                onChangeText={setEmailAddress}
                className="bg-card border border-black/10 rounded-2xl px-4 py-3.5 text-base font-sans text-primary"
              />
            </View>

            <View>
              <Text className="text-sm font-sans-medium text-primary mb-1.5">
                Senha
              </Text>
              <TextInput
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="rgba(0,0,0,0.3)"
                value={password}
                onChangeText={setPassword}
                className="bg-card border border-black/10 rounded-2xl px-4 py-3.5 text-base font-sans text-primary"
              />
            </View>

            <TouchableOpacity
              onPress={handleSignIn}
              disabled={isSubmitting}
              activeOpacity={0.8}
              className="bg-primary rounded-2xl py-4 items-center justify-center mt-2 shadow-sm"
            >
              {fetchStatus === "fetching" ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-sans-bold text-base">
                  Entrar
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="mt-8 flex-row justify-center items-center gap-1.5">
            <Text className="text-sm font-sans text-muted-foreground">
              Não tem uma conta?
            </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text className="text-sm font-sans-bold text-accent">
                  Criar conta
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
