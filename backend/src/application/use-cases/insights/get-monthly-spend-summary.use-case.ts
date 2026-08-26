import { Inject, Injectable } from "@nestjs/common";
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from "../../../domain/repositories/subscription.repository.interface";

export interface GetMonthlySpendSummaryInput {
  userId: string;
  defaultCurrency?: string;
}

export interface MonthlySpendSummaryOutput {
  totalMonthlySpend: number;
  totalYearlySpend: number;
  activeSubscriptionsCount: number;
  pausedSubscriptionsCount: number;
  canceledSubscriptionsCount: number;
  totalSubscriptionsCount: number;
  currency: string;
}

@Injectable()
export class GetMonthlySpendSummaryUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(
    input: GetMonthlySpendSummaryInput,
  ): Promise<MonthlySpendSummaryOutput> {
    const subscriptions = await this.subscriptionRepository.findByUserId(
      input.userId,
    );

    let activeCount = 0;
    let pausedCount = 0;
    let canceledCount = 0;
    let totalMonthlySpend = 0;
    let totalYearlySpend = 0;

    let detectedCurrency = input.defaultCurrency ?? "BRL";

    for (const sub of subscriptions) {
      if (sub.status.isActive()) {
        activeCount++;
        const monthly = sub.billing.toMonthlyAmount(sub.price.amount);
        const yearly = sub.billing.toYearlyAmount(sub.price.amount);
        totalMonthlySpend += monthly;
        totalYearlySpend += yearly;
        if (!input.defaultCurrency && sub.price.currency) {
          detectedCurrency = sub.price.currency;
        }
      } else if (sub.status.isPaused()) {
        pausedCount++;
      } else if (sub.status.isCanceled()) {
        canceledCount++;
      }
    }

    return {
      totalMonthlySpend: Math.round(totalMonthlySpend * 100) / 100,
      totalYearlySpend: Math.round(totalYearlySpend * 100) / 100,
      activeSubscriptionsCount: activeCount,
      pausedSubscriptionsCount: pausedCount,
      canceledSubscriptionsCount: canceledCount,
      totalSubscriptionsCount: subscriptions.length,
      currency: detectedCurrency,
    };
  }
}
