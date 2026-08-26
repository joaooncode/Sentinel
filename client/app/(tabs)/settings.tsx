import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useClerk, useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-3xl font-sans-bold text-primary mb-6">
        Configurações
      </Text>

      <View className="bg-card rounded-3xl p-5 border border-black/5 mb-6 items-center">
        <Image
          source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
          className="size-20 rounded-full mb-3"
        />
        <Text className="text-xl font-sans-bold text-primary">
          {user?.fullName || user?.firstName || "Usuário"}
        </Text>
        <Text className="text-sm font-sans text-muted-foreground mt-1">
          {user?.primaryEmailAddress?.emailAddress || "Sem email"}
        </Text>
      </View>

      <View className="mt-auto mb-20">
        <TouchableOpacity
          onPress={handleSignOut}
          activeOpacity={0.8}
          className="bg-destructive/10 border border-destructive/20 py-4 px-6 rounded-2xl items-center"
        >
          <Text className="text-destructive font-sans-bold text-base">
            Sair da conta
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
