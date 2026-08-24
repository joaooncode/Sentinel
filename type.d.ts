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
}

export * from "./types/subscription";
export * from "./types/navigation";
export * from "./types/auth";
