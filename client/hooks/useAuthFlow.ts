import { useState, useCallback } from "react";
import { Platform } from "react-native";
import { useSignIn, useSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";

export function useAuthFlow() {
  const {
    signIn,
    errors: signInErrors,
    fetchStatus: signInFetchStatus,
  } = useSignIn();
  const {
    signUp,
    errors: signUpErrors,
    fetchStatus: signUpFetchStatus,
  } = useSignUp();
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  const isSignInSubmitting = signInFetchStatus === "fetching";
  const isSignUpSubmitting = signUpFetchStatus === "fetching";

  const handleNavigateAfterAuth = useCallback(
    async (url: string) => {
      if (url.startsWith("http")) {
        if (Platform.OS === "web" && typeof window !== "undefined") {
          window.location.href = url;
        } else {
          await WebBrowser.openBrowserAsync(url);
        }
      } else {
        router.replace("/(tabs)");
      }
    },
    [router],
  );

  const loginWithPassword = useCallback(
    async (emailAddress: string, password: string) => {
      if (!emailAddress || !password) {
        setErrorMessage("Preencha todos os campos.");
        return false;
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
          return false;
        }

        if (signIn.status === "complete") {
          await signIn.finalize({
            navigate: async ({ session, decorateUrl }) => {
              if (session?.currentTask) return;
              const url = decorateUrl("/");
              await handleNavigateAfterAuth(url);
            },
          });
          return true;
        }
        return false;
      } catch (err: any) {
        setErrorMessage(err?.message || "Ocorreu um erro ao entrar.");
        return false;
      }
    },
    [signIn, handleNavigateAfterAuth],
  );

  const registerWithPassword = useCallback(
    async (emailAddress: string, password: string) => {
      if (!emailAddress || !password) {
        setErrorMessage("Preencha todos os campos.");
        return false;
      }
      setErrorMessage("");

      try {
        const { error } = await signUp.password({
          emailAddress,
          password,
        });

        if (error) {
          setErrorMessage(error.message || "Erro ao criar conta.");
          return false;
        }

        await signUp.verifications.sendEmailCode();
        setPendingVerification(true);
        return true;
      } catch (err: any) {
        setErrorMessage(err?.message || "Ocorreu um erro ao criar conta.");
        return false;
      }
    },
    [signUp],
  );

  const verifyCode = useCallback(
    async (code: string) => {
      if (!code) {
        setErrorMessage("Informe o código de verificação recebido.");
        return false;
      }
      setErrorMessage("");

      try {
        const { error } = await signUp.verifications.verifyEmailCode({
          code,
        });

        if (error) {
          setErrorMessage(error.message || "Código inválido.");
          return false;
        }

        if (signUp.status === "complete") {
          await signUp.finalize({
            navigate: async ({ session, decorateUrl }) => {
              if (session?.currentTask) return;
              const url = decorateUrl("/");
              await handleNavigateAfterAuth(url);
            },
          });
          return true;
        }
        return false;
      } catch (err: any) {
        setErrorMessage(
          err?.message || "Ocorreu um erro ao verificar o código.",
        );
        return false;
      }
    },
    [signUp, handleNavigateAfterAuth],
  );

  return {
    errorMessage,
    setErrorMessage,
    pendingVerification,
    setPendingVerification,
    isSignInSubmitting,
    isSignUpSubmitting,
    signInErrors,
    signUpErrors,
    loginWithPassword,
    registerWithPassword,
    verifyCode,
  };
}
