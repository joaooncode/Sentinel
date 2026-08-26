import {
  Subscription as PrismaSubscriptionModel,
  SubscriptionStatus as PrismaSubscriptionStatus,
  BillingCycle as PrismaBillingCycle,
  Prisma,
} from "@prisma/client";
import { Subscription } from "../../domain/entities/subscription.entity";
import { Price } from "../../domain/value-objects/price.vo";
import { BillingPeriod } from "../../domain/value-objects/billing-period.vo";
import { SubscriptionStatus } from "../../domain/value-objects/subscription-status.vo";
import { RenewalDate } from "../../domain/value-objects/renewal-date.vo";
import { SupportedCurrency } from "../../domain/entities/user.entity";

export class SubscriptionMapper {
  public static toDomain(raw: PrismaSubscriptionModel): Subscription {
    return Subscription.restore({
      id: raw.id,
      userId: raw.userId,
      name: raw.name,
      plan: raw.plan,
      category: raw.category,
      paymentMethod: raw.paymentMethod,
      status: SubscriptionStatus.restore(
        raw.status as PrismaSubscriptionStatus,
      ),
      price: Price.restore(
        Number(raw.price),
        raw.currency as SupportedCurrency,
      ),
      billing: BillingPeriod.restore(raw.billing as PrismaBillingCycle),
      startDate: raw.startDate,
      renewalDate: RenewalDate.restore(raw.renewalDate),
      color: raw.color,
      lucideIcon: raw.lucideIcon,
      brandLogoUri: raw.brandLogoUri,
      brandHex: raw.brandHex,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  public static toPersistence(
    subscription: Subscription,
  ): Prisma.SubscriptionUncheckedCreateInput {
    return {
      id: subscription.id,
      userId: subscription.userId,
      name: subscription.name,
      plan: subscription.plan,
      category: subscription.category,
      paymentMethod: subscription.paymentMethod,
      status: subscription.status.value as PrismaSubscriptionStatus,
      price: new Prisma.Decimal(subscription.price.amount),
      currency: subscription.price.currency,
      billing: subscription.billing.value as PrismaBillingCycle,
      startDate: subscription.startDate,
      renewalDate: subscription.renewalDate.value,
      color: subscription.color,
      lucideIcon: subscription.lucideIcon,
      brandLogoUri: subscription.brandLogoUri,
      brandHex: subscription.brandHex,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}
