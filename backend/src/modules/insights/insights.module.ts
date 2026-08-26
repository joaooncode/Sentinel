import { Module } from "@nestjs/common";
import { SUBSCRIPTION_REPOSITORY } from "@domain/repositories/subscription.repository.interface";
import { BILLING_HISTORY_REPOSITORY } from "@domain/repositories/billing-history.repository.interface";
import { PrismaSubscriptionRepository } from "@infrastructure/repositories/prisma-subscription.repository";
import { PrismaBillingHistoryRepository } from "@infrastructure/repositories/prisma-billing-history.repository";
import { GetMonthlySpendSummaryUseCase } from "@application/use-cases/insights/get-monthly-spend-summary.use-case";
import { GetUpcomingRenewalsUseCase } from "@application/use-cases/insights/get-upcoming-renewals.use-case";
import { GetCategoryInsightsUseCase } from "@application/use-cases/insights/get-category-insights.use-case";
import { GetBillingHistoryUseCase } from "@application/use-cases/insights/get-billing-history.use-case";
import { InsightsController } from "@presentation/controllers/insights.controller";
import { ClerkAuthGuard } from "@infrastructure/auth/clerk-auth.guard";

@Module({
  controllers: [InsightsController],
  providers: [
    {
      provide: SUBSCRIPTION_REPOSITORY,
      useClass: PrismaSubscriptionRepository,
    },
    {
      provide: BILLING_HISTORY_REPOSITORY,
      useClass: PrismaBillingHistoryRepository,
    },
    GetMonthlySpendSummaryUseCase,
    GetUpcomingRenewalsUseCase,
    GetCategoryInsightsUseCase,
    GetBillingHistoryUseCase,
    ClerkAuthGuard,
  ],
  exports: [
    BILLING_HISTORY_REPOSITORY,
    GetMonthlySpendSummaryUseCase,
    GetUpcomingRenewalsUseCase,
    GetCategoryInsightsUseCase,
    GetBillingHistoryUseCase,
  ],
})
export class InsightsModule {}
