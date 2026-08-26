import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ClerkAuthGuard } from "@infrastructure/auth/clerk-auth.guard";
import {
  CurrentUser,
  AuthenticatedUser,
} from "@common/decorators/current-user.decorator";
import {
  GetMonthlySpendSummaryUseCase,
  MonthlySpendSummaryOutput,
} from "@application/use-cases/insights/get-monthly-spend-summary.use-case";
import {
  GetUpcomingRenewalsUseCase,
  UpcomingRenewalItem,
} from "@application/use-cases/insights/get-upcoming-renewals.use-case";
import {
  GetCategoryInsightsUseCase,
  CategoryInsightsOutput,
} from "@application/use-cases/insights/get-category-insights.use-case";
import {
  GetBillingHistoryUseCase,
  BillingHistoryOutputItem,
} from "@application/use-cases/insights/get-billing-history.use-case";
import { UpcomingRenewalsQueryDto } from "../dtos/upcoming-renewals-query.dto";
import { BillingHistoryQueryDto } from "../dtos/billing-history-query.dto";

@ApiTags("Insights & Analytics")
@ApiBearerAuth("clerk-jwt")
@UseGuards(ClerkAuthGuard)
@Controller("insights")
export class InsightsController {
  constructor(
    private readonly getMonthlySpendSummaryUseCase: GetMonthlySpendSummaryUseCase,
    private readonly getUpcomingRenewalsUseCase: GetUpcomingRenewalsUseCase,
    private readonly getCategoryInsightsUseCase: GetCategoryInsightsUseCase,
    private readonly getBillingHistoryUseCase: GetBillingHistoryUseCase,
  ) {}

  @Get("summary")
  @ApiOperation({
    summary: "Obter resumo consolidado de gastos mensais e anuais",
  })
  @ApiResponse({ status: 200, description: "Resumo financeiro retornado." })
  async getSummary(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MonthlySpendSummaryOutput> {
    return this.getMonthlySpendSummaryUseCase.execute({
      userId: user.userId,
    });
  }

  @Get("upcoming")
  @ApiOperation({
    summary: "Obter próximas renovações ordenadas por proximidade",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de próximas renovações retornada.",
  })
  async getUpcoming(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: UpcomingRenewalsQueryDto,
  ): Promise<UpcomingRenewalItem[]> {
    return this.getUpcomingRenewalsUseCase.execute({
      userId: user.userId,
      daysAhead: query.daysAhead,
      limit: query.limit,
    });
  }

  @Get("categories")
  @ApiOperation({ summary: "Obter distribuição de gastos por categoria" })
  @ApiResponse({
    status: 200,
    description: "Métricas por categoria retornadas.",
  })
  async getCategories(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CategoryInsightsOutput> {
    return this.getCategoryInsightsUseCase.execute({
      userId: user.userId,
    });
  }

  @Get("history")
  @ApiOperation({ summary: "Obter histórico de cobranças e faturas" })
  @ApiResponse({ status: 200, description: "Histórico de faturas retornado." })
  async getHistory(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: BillingHistoryQueryDto,
  ): Promise<BillingHistoryOutputItem[]> {
    return this.getBillingHistoryUseCase.execute({
      userId: user.userId,
      subscriptionId: query.subscriptionId,
    });
  }
}
