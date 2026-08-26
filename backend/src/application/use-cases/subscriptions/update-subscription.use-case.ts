import { Inject, Injectable } from "@nestjs/common";
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from "@domain/repositories/subscription.repository.interface";
import { SubscriptionNotFoundException } from "@domain/errors/subscription-not-found.exception";
import { SupportedCurrency } from "@domain/entities/user.entity";
import { BillingCycle } from "@domain/value-objects/billing-period.vo";
import {
  SubscriptionOutput,
  toSubscriptionOutput,
} from "./subscription.output";

export interface UpdateSubscriptionData {
  name?: string;
  plan?: string | null;
  category?: string;
  paymentMethod?: string | null;
  price?: number;
  currency?: SupportedCurrency;
  billing?: BillingCycle;
  renewalDate?: Date | string;
  color?: string | null;
  lucideIcon?: string | null;
  brandLogoUri?: string | null;
  brandHex?: string | null;
}

export interface UpdateSubscriptionInput {
  id: string;
  userId?: string;
  data: UpdateSubscriptionData;
}

@Injectable()
export class UpdateSubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(input: UpdateSubscriptionInput): Promise<SubscriptionOutput> {
    const subscription = await this.subscriptionRepository.findById(
      input.id,
      input.userId,
    );

    if (!subscription) {
      throw new SubscriptionNotFoundException(input.id);
    }

    subscription.update(input.data);

    await this.subscriptionRepository.update(subscription);

    return toSubscriptionOutput(subscription);
  }
}
