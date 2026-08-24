export interface AuthErrorState {
  message: string;
  fieldErrors?: Record<string, string>;
}

export type SocialAuthStrategy = "oauth_google" | "oauth_github";

export interface SocialAuthButtonsProps {
  mode: "signIn" | "signUp";
  onError?: (message: string) => void;
  disabled?: boolean;
}
