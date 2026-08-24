import { FlatList, Image, Text, View } from "react-native";
import "../../global.css";

import { useUser } from "@clerk/expo";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import { icons } from "@/constants/icons";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  HOME_USER,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { useState } from "react";
import SubscriptionCard from "@/components/SubscriptionCard";

const SafeAreaView = styled(RNSafeAreaView);

export default function Index() {
  const { user } = useUser();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const displayName =
    user?.firstName ||
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress ||
    HOME_USER.name;

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={
                    user?.imageUrl ? { uri: user.imageUrl } : images.avatar
                  }
                  className="home-avatar"
                />
                <Text className="home-user-name">{displayName}</Text>
              </View>
              <Image source={icons.add} className="home-add-icon" />
            </View>
            <View className="home-balance-card">
              <Text className="home-balance-label">Saldo</Text>
              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("DD/MM")}
                </Text>
              </View>
            </View>
            <View className="mb-5">
              <ListHeading title="Próximas assinaturas" />
              <FlatList
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    Nenhuma assinatura próxima
                  </Text>
                }
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                horizontal
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
              />
            </View>
            <ListHeading title="Todas as assinaturas" />
          </>
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text>Você ainda não tem assinaturas.</Text>}
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        contentContainerClassName="pb-20"
      />
    </SafeAreaView>
  );
}
