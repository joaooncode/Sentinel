import type {
  Subscription as ISubscription,
  SubscriptionCardProps as ISubscriptionCardProps,
  UpcomingSubscription as IUpcomingSubscription,
  UpcomingSubscriptionCardProps as IUpcomingSubscriptionCardProps,
  ListHeadingProps as IListHeadingProps,
} from "./types/subscription";
import type {
  AppTab as IAppTab,
  TabIconProps as ITabIconProps,
} from "./types/navigation";
import type {
  SocialAuthButtonsProps as ISocialAuthButtonsProps,
  SocialAuthStrategy as ISocialAuthStrategy,
} from "./types/auth";

import type {
  NewSubscriptionFormData as INewSubscriptionFormData,
  BillingCycle as IBillingCycle,
} from "./schemas/subscription";

declare global {
  type AppTab = IAppTab;
  type TabIconProps = ITabIconProps;
  type Subscription = ISubscription;
  type SubscriptionCardProps = ISubscriptionCardProps;
  type UpcomingSubscription = IUpcomingSubscription;
  type UpcomingSubscriptionCardProps = IUpcomingSubscriptionCardProps;
  type ListHeadingProps = IListHeadingProps;
  type SocialAuthButtonsProps = ISocialAuthButtonsProps;
  type SocialAuthStrategy = ISocialAuthStrategy;
  type NewSubscriptionFormData = INewSubscriptionFormData;
  type BillingCycle = IBillingCycle;
}

export * from "./types/subscription";
export * from "./types/navigation";
export * from "./types/auth";
export * from "./schemas/subscription";
