import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { ListHeadingProps } from "@/types/subscription";

const ListHeading = ({
  title,
  actionText = "Ver todos",
  onActionPress,
  showAction = true,
}: ListHeadingProps) => {
  const shouldShowAction = showAction && Boolean(onActionPress);

  return (
    <View className="list-head">
      <Text className="list-title">{title}</Text>
      {shouldShowAction && (
        <TouchableOpacity
          onPress={onActionPress}
          activeOpacity={0.7}
          className="list-action"
          accessibilityRole="button"
          accessibilityLabel={actionText}
        >
          <Text className="list-action-text">{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ListHeading;
