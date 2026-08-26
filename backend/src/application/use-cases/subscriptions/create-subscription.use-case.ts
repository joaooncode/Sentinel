import { Inject, Injectable } from "@nestjs/common";
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from "@domain/repositories/subscription.repository.interface";
import { Subscription } from "@domain/entities/subscription.entity";
import { SupportedCurrency } from "@domain/entities/user.entity";
import { BillingCycle } from "@domain/value-objects/billing-period.vo";
import { SubscriptionStatusType } from "@domain/value-objects/subscription-status.vo";
import {
  SubscriptionOutput,
  toSubscriptionOutput,
} from "./subscription.output";

export interface CreateSubscriptionInput {
  userId: string;
  name: string;
  plan?: string | null;
  category?: string;
  paymentMethod?: string | null;
  status?: SubscriptionStatusType;
  price: number;
  currency?: SupportedCurrency;
  billing?: BillingCycle;
  startDate?: Date;
  renewalDate: Date | string;
  color?: string | null;
  lucideIcon?: string | null;
  brandLogoUri?: string | null;
  brandHex?: string | null;
}

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(input: CreateSubscriptionInput): Promise<SubscriptionOutput> {
    const subscription = Subscription.create({
      userId: input.userId,
      name: input.name,
      plan: input.plan,
      category: input.category,
      paymentMethod: input.paymentMethod,
      status: input.status,
      price: input.price,
      currency: input.currency,
      billing: input.billing,
      startDate: input.startDate,
      renewalDate: input.renewalDate,
      color: input.color,
      lucideIcon: input.lucideIcon,
      brandLogoUri: input.brandLogoUri,
      brandHex: input.brandHex,
    });

    await this.subscriptionRepository.create(subscription);

    return toSubscriptionOutput(subscription);
  }
}
