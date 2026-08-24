import type { ImageSourcePropType } from "react-native";

export interface Subscription {
  id: string;
  icon: ImageSourcePropType;
  lucideIcon?: string;
  brandLogoUri?: string;
  brandSvgPath?: string;
  brandHex?: string;
  name: string;
  plan?: string;
  category?: string;
  paymentMethod?: string;
  status?: string;
  startDate?: string;
  price: number;
  currency?: string;
  billing: string;
  frequency?: string;
  renewalDate?: string;
  color?: string;
}

export interface SubscriptionCardProps extends Omit<Subscription, "id"> {
  expanded: boolean;
  onPress: () => void;
  onCancelPress?: () => void;
  isCancelling?: boolean;
}

export interface UpcomingSubscription {
  id: string;
  icon: ImageSourcePropType;
  lucideIcon?: string;
  brandLogoUri?: string;
  brandSvgPath?: string;
  brandHex?: string;
  name: string;
  price: number;
  currency?: string;
  daysLeft: number;
}

export type UpcomingSubscriptionCardProps = Omit<UpcomingSubscription, "id">;

export interface ListHeadingProps {
  title: string;
}
