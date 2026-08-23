import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Detalhes da Assinatura: {id}</Text>
      <Link href={"/"}>Ir para o início</Link>
    </View>
  );
};

export default SubscriptionDetails;
