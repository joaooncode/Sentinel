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
import { Link } from "expo-router";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import SocialAuthButtons from "@/components/SocialAuthButtons";

import { useAuthFlow } from "@/hooks/useAuthFlow";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignUpScreen() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const {
    registerWithPassword,
    verifyCode,
    errorMessage,
    setErrorMessage,
    pendingVerification,
    setPendingVerification,
    isSignUpSubmitting,
    signUpErrors,
  } = useAuthFlow();

  const handleSignUp = async () => {
    await registerWithPassword(emailAddress, password);
  };

  const handleVerify = async () => {
    await verifyCode(code);
  };

  const hasEmailError = Boolean(signUpErrors?.fields?.emailAddress);
  const hasPasswordError = Boolean(signUpErrors?.fields?.password);
  const hasCodeError = Boolean(signUpErrors?.fields?.code);

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
            <Text className="auth-title">
              {pendingVerification ? "Verificar E-mail" : "Criar Conta"}
            </Text>
            <Text className="auth-subtitle">
              {pendingVerification
                ? `Digite o código de 6 dígitos enviado para ${emailAddress}`
                : "Crie sua conta para começar a organizar suas finanças"}
            </Text>
          </View>

          <View className="auth-card">
            {errorMessage ? (
              <View className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/10 p-3.5">
                <Text className="auth-error text-sm">{errorMessage}</Text>
              </View>
            ) : null}

            {!pendingVerification ? (
              <>
                {/* Social Sign-Up Buttons */}
                <SocialAuthButtons
                  mode="signUp"
                  onError={setErrorMessage}
                  disabled={isSignUpSubmitting}
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
                      className={`auth-input ${hasEmailError ? "auth-input-error" : ""}`}
                    />
                    {signUpErrors?.fields?.emailAddress ? (
                      <Text className="auth-error">
                        {signUpErrors.fields.emailAddress.message}
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
                    {signUpErrors?.fields?.password ? (
                      <Text className="auth-error">
                        {signUpErrors.fields.password.message}
                      </Text>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    onPress={handleSignUp}
                    disabled={isSignUpSubmitting}
                    activeOpacity={0.8}
                    className={`auth-button ${isSignUpSubmitting ? "auth-button-disabled" : ""}`}
                  >
                    {isSignUpSubmitting ? (
                      <ActivityIndicator color="#081126" />
                    ) : (
                      <Text className="auth-button-text">Continuar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Código de Verificação</Text>
                  <TextInput
                    keyboardType="number-pad"
                    placeholder="123456"
                    placeholderTextColor="rgba(0, 0, 0, 0.4)"
                    value={code}
                    onChangeText={setCode}
                    className={`auth-input text-center tracking-widest text-xl ${hasCodeError ? "auth-input-error" : ""}`}
                  />
                  {signUpErrors?.fields?.code ? (
                    <Text className="auth-error">
                      {signUpErrors.fields.code.message}
                    </Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  onPress={handleVerify}
                  disabled={isSignUpSubmitting}
                  activeOpacity={0.8}
                  className={`auth-button ${isSignUpSubmitting ? "auth-button-disabled" : ""}`}
                >
                  {isSignUpSubmitting ? (
                    <ActivityIndicator color="#081126" />
                  ) : (
                    <Text className="auth-button-text">Confirmar e Entrar</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setPendingVerification(false)}
                  activeOpacity={0.8}
                  className="auth-secondary-button"
                >
                  <Text className="auth-secondary-button-text">
                    Voltar para o cadastro
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Gate 10: bot protection captcha mount point */}
          <View nativeID="clerk-captcha" />

          <View className="auth-link-row">
            <Text className="auth-link-copy">Já tem uma conta?</Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text className="auth-link">Entrar</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
