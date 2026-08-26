import React from "react";
import { Text, View } from "react-native";
import { formatCurrency } from "@/lib/utils";
import UpcomingSubscription from "@/type";
import SubscriptionIcon from "@/components/SubscriptionIcon";

const UpcomingSubscriptionCard = ({
  name,
  price,
  daysLeft,
  icon,
  lucideIcon,
  brandLogoUri,
  brandSvgPath,
  brandHex,
  currency,
}: UpcomingSubscription) => {
  return (
    <View className="upcoming-card">
      <View className="upcoming-row">
        <SubscriptionIcon
          icon={icon}
          name={name}
          lucideIcon={lucideIcon}
          brandLogoUri={brandLogoUri}
          brandHex={brandHex}
          size={24}
          className="upcoming-icon"
        />
        <View className="flex-1 min-w-0">
          <Text
            className="upcoming-price"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatCurrency(price, currency)}
          </Text>
          <Text className="upcoming-meta" numberOfLines={1}>
            Em {daysLeft} {daysLeft === 1 ? "dia" : "dias"}
          </Text>
        </View>
      </View>
      <Text className="upcoming-name" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
};

export default UpcomingSubscriptionCard;
