import { Inject, Injectable } from "@nestjs/common";
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from "../../../domain/repositories/subscription.repository.interface";

export interface GetUpcomingRenewalsInput {
  userId: string;
  daysAhead?: number;
  limit?: number;
  referenceDate?: Date;
}

export interface UpcomingRenewalItem {
  id: string;
  name: string;
  plan: string | null;
  category: string;
  paymentMethod: string | null;
  price: number;
  currency: string;
  billing: string;
  renewalDate: string;
  daysLeft: number;
  isOverdue: boolean;
  color: string | null;
  lucideIcon: string | null;
  brandLogoUri: string | null;
  brandHex: string | null;
}

@Injectable()
export class GetUpcomingRenewalsUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(
    input: GetUpcomingRenewalsInput,
  ): Promise<UpcomingRenewalItem[]> {
    const subscriptions = await this.subscriptionRepository.findByUserId(
      input.userId,
    );

    const now = input.referenceDate ?? new Date();

    const activeSubs = subscriptions.filter((sub) => sub.status.isActive());

    const mapped = activeSubs.map((sub) => {
      const daysLeft = sub.renewalDate.daysUntilRenewal(now);
      const isOverdue = sub.renewalDate.isOverdue(now);

      return {
        id: sub.id,
        name: sub.name,
        plan: sub.plan,
        category: sub.category,
        paymentMethod: sub.paymentMethod,
        price: sub.price.amount,
        currency: sub.price.currency,
        billing: sub.billing.value,
        renewalDate: sub.renewalDate.toISOString(),
        daysLeft,
        isOverdue,
        color: sub.color,
        lucideIcon: sub.lucideIcon,
        brandLogoUri: sub.brandLogoUri,
        brandHex: sub.brandHex,
      };
    });

    let filtered = mapped;

    if (typeof input.daysAhead === "number") {
      filtered = filtered.filter((item) => item.daysLeft <= input.daysAhead!);
    }

    filtered.sort((a, b) => a.daysLeft - b.daysLeft);

    if (typeof input.limit === "number" && input.limit > 0) {
      filtered = filtered.slice(0, input.limit);
    }

    return filtered;
  }
}
