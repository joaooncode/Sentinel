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
import { useSignUp, useSSO } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ssoLoading, setSsoLoading] = useState<"google" | "github" | null>(
    null,
  );

  const isSubmitting = fetchStatus === "fetching" || ssoLoading !== null;

  const handleSignUp = async () => {
    if (!emailAddress || !password) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }
    setErrorMessage("");

    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Erro ao criar conta.");
        return;
      }

      await signUp.verifications.sendEmailCode();
      setPendingVerification(true);
    } catch (err: any) {
      setErrorMessage(err?.message || "Ocorreu um erro ao criar conta.");
    }
  };

  const handleVerify = async () => {
    if (!code) {
      setErrorMessage("Informe o código de verificação recebido.");
      return;
    }
    setErrorMessage("");

    try {
      const { error } = await signUp.verifications.verifyEmailCode({
        code,
      });

      if (error) {
        setErrorMessage(error.message || "Código inválido.");
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({
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
      setErrorMessage(err?.message || "Ocorreu um erro ao verificar o código.");
    }
  };

  const handleSSO = async (strategy: "oauth_google" | "oauth_github") => {
    setErrorMessage("");
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
      setErrorMessage(
        err?.errors?.[0]?.message ||
          err?.message ||
          "Erro ao autenticar com o provedor.",
      );
    } finally {
      setSsoLoading(null);
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
              {pendingVerification ? "Verificar E-mail" : "Criar Conta"}
            </Text>
            <Text className="text-base font-sans text-muted-foreground">
              {pendingVerification
                ? `Digite o código de 6 dígitos enviado para ${emailAddress}`
                : "Crie sua conta para começar a organizar suas finanças"}
            </Text>
          </View>

          {errorMessage ||
          errors?.fields?.emailAddress ||
          errors?.fields?.password ||
          errors?.fields?.code ? (
            <View className="mb-4 p-3.5 bg-destructive/10 rounded-2xl border border-destructive/20">
              <Text className="text-destructive font-sans-medium text-sm">
                {errorMessage ||
                  errors?.fields?.emailAddress?.message ||
                  errors?.fields?.password?.message ||
                  errors?.fields?.code?.message}
              </Text>
            </View>
          ) : null}

          {!pendingVerification ? (
            <>
              {/* Social Sign-Up Buttons */}
              <View className="gap-3 mb-6">
                <TouchableOpacity
                  onPress={() => handleSSO("oauth_google")}
                  disabled={isSubmitting}
                  activeOpacity={0.8}
                  className="flex-row items-center justify-center bg-card border border-black/10 rounded-2xl py-3.5 px-4 shadow-sm"
                >
                  {ssoLoading === "google" ? (
                    <ActivityIndicator size="small" color="#081126" />
                  ) : (
                    <>
                      <Ionicons name="logo-google" size={20} color="#EA4335" />
                      <Text className="ml-3 font-sans-semibold text-base text-primary">
                        Cadastrar com Google
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleSSO("oauth_github")}
                  disabled={isSubmitting}
                  activeOpacity={0.8}
                  className="flex-row items-center justify-center bg-card border border-black/10 rounded-2xl py-3.5 px-4 shadow-sm"
                >
                  {ssoLoading === "github" ? (
                    <ActivityIndicator size="small" color="#081126" />
                  ) : (
                    <>
                      <Ionicons name="logo-github" size={20} color="#24292e" />
                      <Text className="ml-3 font-sans-semibold text-base text-primary">
                        Cadastrar com GitHub
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center my-4">
                <View className="flex-1 h-[1px] bg-black/10" />
                <Text className="mx-3 text-xs font-sans-medium text-muted-foreground uppercase">
                  ou com e-mail
                </Text>
                <View className="flex-1 h-[1px] bg-black/10" />
              </View>

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
                  onPress={handleSignUp}
                  disabled={isSubmitting}
                  activeOpacity={0.8}
                  className="bg-primary rounded-2xl py-4 items-center justify-center mt-2 shadow-sm"
                >
                  {fetchStatus === "fetching" ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-sans-bold text-base">
                      Continuar
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View className="gap-4">
              <View>
                <Text className="text-sm font-sans-medium text-primary mb-1.5">
                  Código de Verificação
                </Text>
                <TextInput
                  keyboardType="number-pad"
                  placeholder="123456"
                  placeholderTextColor="rgba(0,0,0,0.3)"
                  value={code}
                  onChangeText={setCode}
                  className="bg-card border border-black/10 rounded-2xl px-4 py-3.5 text-base font-sans text-primary text-center tracking-widest text-xl"
                />
              </View>

              <TouchableOpacity
                onPress={handleVerify}
                disabled={isSubmitting}
                activeOpacity={0.8}
                className="bg-primary rounded-2xl py-4 items-center justify-center mt-2 shadow-sm"
              >
                {fetchStatus === "fetching" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-sans-bold text-base">
                    Confirmar e Entrar
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setPendingVerification(false)}
                className="py-2 items-center"
              >
                <Text className="text-sm font-sans-medium text-muted-foreground">
                  Voltar para o cadastro
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Gate 10: bot protection captcha mount point */}
          <View nativeID="clerk-captcha" />

          <View className="mt-8 flex-row justify-center items-center gap-1.5">
            <Text className="text-sm font-sans text-muted-foreground">
              Já tem uma conta?
            </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text className="text-sm font-sans-bold text-accent">
                  Entrar
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
