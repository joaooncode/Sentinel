import React from "react";
import { Text, View } from "react-native";
import type { HistoryTransaction } from "@/types/subscription";
import SubscriptionIcon from "@/components/SubscriptionIcon";
import { formatCurrency } from "@/lib/utils";

interface HistoryCardProps {
  item: HistoryTransaction;
}

export default function HistoryCard({ item }: HistoryCardProps) {
  const backgroundColor = item.color || "#8fd1bd";

  return (
    <View style={{ backgroundColor }} className="insights-history-card">
      <View className="flex-1 flex-row items-center gap-3.5">
        {/* Rounded Icon Box with translucent background */}
        <View className="size-14 items-center justify-center rounded-2xl bg-white/40">
          <SubscriptionIcon
            icon={item.icon}
            name={item.name}
            brandLogoUri={item.brandLogoUri}
            brandHex={item.brandHex}
            lucideIcon={item.lucideIcon}
            size={28}
          />
        </View>

        {/* Name and Date */}
        <View className="flex-1">
          <Text
            className="text-lg font-sans-bold text-primary"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text className="mt-0.5 text-xs font-sans-semibold text-primary/60">
            {item.date}
          </Text>
        </View>
      </View>

      {/* Price and Billing Frequency */}
      <View className="items-end pl-2">
        <Text className="text-lg font-sans-bold text-primary">
          {formatCurrency(item.price, item.currency)}
        </Text>
        <Text className="mt-0.5 text-xs font-sans-medium text-primary/60">
          {item.billing}
        </Text>
      </View>
    </View>
  );
}
