import { Inject, Injectable } from "@nestjs/common";
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from "../../../domain/repositories/subscription.repository.interface";

export interface GetCategoryInsightsInput {
  userId: string;
}

export interface CategoryInsightItem {
  category: string;
  totalMonthly: number;
  percentage: number;
  subscriptionsCount: number;
}

export interface CategoryInsightsOutput {
  totalMonthlySpend: number;
  categories: CategoryInsightItem[];
}

@Injectable()
export class GetCategoryInsightsUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(
    input: GetCategoryInsightsInput,
  ): Promise<CategoryInsightsOutput> {
    const subscriptions = await this.subscriptionRepository.findByUserId(
      input.userId,
    );

    const activeSubs = subscriptions.filter((sub) => sub.status.isActive());

    if (activeSubs.length === 0) {
      return {
        totalMonthlySpend: 0,
        categories: [],
      };
    }

    let totalMonthlySpend = 0;
    const categoryMap = new Map<
      string,
      { totalMonthly: number; count: number }
    >();

    for (const sub of activeSubs) {
      const monthly = sub.billing.toMonthlyAmount(sub.price.amount);
      totalMonthlySpend += monthly;

      const category = sub.category?.trim() || "Outros";
      const existing = categoryMap.get(category) ?? {
        totalMonthly: 0,
        count: 0,
      };
      existing.totalMonthly += monthly;
      existing.count += 1;
      categoryMap.set(category, existing);
    }

    const roundedTotalMonthlySpend = Math.round(totalMonthlySpend * 100) / 100;

    const categories: CategoryInsightItem[] = Array.from(
      categoryMap.entries(),
    ).map(([category, data]) => {
      const roundedTotal = Math.round(data.totalMonthly * 100) / 100;
      const percentage =
        roundedTotalMonthlySpend > 0
          ? Math.round((roundedTotal / roundedTotalMonthlySpend) * 100 * 100) /
            100
          : 0;

      return {
        category,
        totalMonthly: roundedTotal,
        percentage,
        subscriptionsCount: data.count,
      };
    });

    categories.sort((a, b) => b.totalMonthly - a.totalMonthly);

    return {
      totalMonthlySpend: roundedTotalMonthlySpend,
      categories,
    };
  }
}
