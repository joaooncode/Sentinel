import { InsightsController } from "./insights.controller";
import { GetMonthlySpendSummaryUseCase } from "@application/use-cases/insights/get-monthly-spend-summary.use-case";
import { GetUpcomingRenewalsUseCase } from "@application/use-cases/insights/get-upcoming-renewals.use-case";
import { GetCategoryInsightsUseCase } from "@application/use-cases/insights/get-category-insights.use-case";
import { GetBillingHistoryUseCase } from "@application/use-cases/insights/get-billing-history.use-case";
import { AuthenticatedUser } from "@common/decorators/current-user.decorator";

describe("InsightsController", () => {
  let controller: InsightsController;
  let summaryUseCase: jest.Mocked<GetMonthlySpendSummaryUseCase>;
  let upcomingUseCase: jest.Mocked<GetUpcomingRenewalsUseCase>;
  let categoriesUseCase: jest.Mocked<GetCategoryInsightsUseCase>;
  let historyUseCase: jest.Mocked<GetBillingHistoryUseCase>;

  const mockUser: AuthenticatedUser = {
    userId: "user_123",
    email: "test@sentinel.app",
  };

  beforeEach(() => {
    summaryUseCase = {
      execute: jest.fn().mockResolvedValue({
        totalMonthlySpend: 150.0,
        totalYearlySpend: 1800.0,
        activeSubscriptionsCount: 3,
        pausedSubscriptionsCount: 1,
        canceledSubscriptionsCount: 0,
        totalSubscriptionsCount: 4,
        currency: "BRL",
      }),
    } as unknown as jest.Mocked<GetMonthlySpendSummaryUseCase>;

    upcomingUseCase = {
      execute: jest.fn().mockResolvedValue([
        {
          id: "sub_1",
          name: "Spotify",
          plan: "Premium",
          category: "Música",
          paymentMethod: "Cartão",
          price: 21.9,
          currency: "BRL",
          billing: "MENSAL",
          renewalDate: "2026-09-01T00:00:00.000Z",
          daysLeft: 6,
          isOverdue: false,
          color: "#1DB954",
          lucideIcon: "Music",
          brandLogoUri: null,
          brandHex: "#1DB954",
        },
      ]),
    } as unknown as jest.Mocked<GetUpcomingRenewalsUseCase>;

    categoriesUseCase = {
      execute: jest.fn().mockResolvedValue({
        totalMonthlySpend: 150.0,
        categories: [
          {
            category: "Música",
            totalMonthly: 21.9,
            percentage: 14.6,
            subscriptionsCount: 1,
          },
        ],
      }),
    } as unknown as jest.Mocked<GetCategoryInsightsUseCase>;

    historyUseCase = {
      execute: jest.fn().mockResolvedValue([
        {
          id: "bill_1",
          userId: "user_123",
          subscriptionId: "sub_1",
          amount: 21.9,
          currency: "BRL",
          paidAt: new Date("2026-08-01"),
          status: "pago",
          notes: null,
          createdAt: new Date("2026-08-01"),
        },
      ]),
    } as unknown as jest.Mocked<GetBillingHistoryUseCase>;

    controller = new InsightsController(
      summaryUseCase,
      upcomingUseCase,
      categoriesUseCase,
      historyUseCase,
    );
  });

  it("deve retornar o resumo de gastos mensais", async () => {
    const result = await controller.getSummary(mockUser);
    expect(summaryUseCase.execute).toHaveBeenCalledWith({
      userId: "user_123",
    });
    expect(result.totalMonthlySpend).toBe(150.0);
  });

  it("deve retornar próximas renovações com query params", async () => {
    const result = await controller.getUpcoming(mockUser, {
      daysAhead: 15,
      limit: 5,
    });
    expect(upcomingUseCase.execute).toHaveBeenCalledWith({
      userId: "user_123",
      daysAhead: 15,
      limit: 5,
    });
    expect(result).toHaveLength(1);
  });

  it("deve retornar métricas por categoria", async () => {
    const result = await controller.getCategories(mockUser);
    expect(categoriesUseCase.execute).toHaveBeenCalledWith({
      userId: "user_123",
    });
    expect(result.categories).toHaveLength(1);
  });

  it("deve retornar histórico de faturas", async () => {
    const result = await controller.getHistory(mockUser, {
      subscriptionId: "sub_1",
    });
    expect(historyUseCase.execute).toHaveBeenCalledWith({
      userId: "user_123",
      subscriptionId: "sub_1",
    });
    expect(result).toHaveLength(1);
  });
});
