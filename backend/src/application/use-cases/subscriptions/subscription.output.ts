import { Subscription } from "@domain/entities/subscription.entity";

export interface SubscriptionOutput {
  id: string;
  userId: string;
  name: string;
  plan: string | null;
  category: string;
  paymentMethod: string | null;
  status: string;
  price: number;
  currency: string;
  billing: string;
  startDate: Date;
  renewalDate: Date;
  daysUntilRenewal: number;
  isOverdue: boolean;
  color: string | null;
  lucideIcon: string | null;
  brandLogoUri: string | null;
  brandHex: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toSubscriptionOutput(
  subscription: Subscription,
  now: Date = new Date(),
): SubscriptionOutput {
  return {
    id: subscription.id,
    userId: subscription.userId,
    name: subscription.name,
    plan: subscription.plan,
    category: subscription.category,
    paymentMethod: subscription.paymentMethod,
    status: subscription.status.value,
    price: subscription.price.amount,
    currency: subscription.price.currency,
    billing: subscription.billing.value,
    startDate: subscription.startDate,
    renewalDate: subscription.renewalDate.value,
    daysUntilRenewal: subscription.renewalDate.daysUntilRenewal(now),
    isOverdue: subscription.renewalDate.isOverdue(now),
    color: subscription.color,
    lucideIcon: subscription.lucideIcon,
    brandLogoUri: subscription.brandLogoUri,
    brandHex: subscription.brandHex,
    createdAt: subscription.createdAt,
    updatedAt: subscription.updatedAt,
  };
}
