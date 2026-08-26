import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from "@nestjs/swagger";
import { ClerkAuthGuard } from "@infrastructure/auth/clerk-auth.guard";
import {
  CurrentUser,
  AuthenticatedUser,
} from "@common/decorators/current-user.decorator";
import { CreateSubscriptionUseCase } from "@application/use-cases/subscriptions/create-subscription.use-case";
import { ListUserSubscriptionsUseCase } from "@application/use-cases/subscriptions/list-user-subscriptions.use-case";
import { GetSubscriptionByIdUseCase } from "@application/use-cases/subscriptions/get-subscription-by-id.use-case";
import { UpdateSubscriptionUseCase } from "@application/use-cases/subscriptions/update-subscription.use-case";
import { ChangeSubscriptionStatusUseCase } from "@application/use-cases/subscriptions/change-subscription-status.use-case";
import { DeleteSubscriptionUseCase } from "@application/use-cases/subscriptions/delete-subscription.use-case";
import { SubscriptionOutput } from "@application/use-cases/subscriptions/subscription.output";
import { CreateSubscriptionDto } from "../dtos/create-subscription.dto";
import { UpdateSubscriptionDto } from "../dtos/update-subscription.dto";
import { ChangeSubscriptionStatusDto } from "../dtos/change-subscription-status.dto";
import { ListSubscriptionsQueryDto } from "../dtos/list-subscriptions-query.dto";

@ApiTags("Subscriptions")
@ApiBearerAuth("clerk-jwt")
@UseGuards(ClerkAuthGuard)
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
    private readonly listUserSubscriptionsUseCase: ListUserSubscriptionsUseCase,
    private readonly getSubscriptionByIdUseCase: GetSubscriptionByIdUseCase,
    private readonly updateSubscriptionUseCase: UpdateSubscriptionUseCase,
    private readonly changeSubscriptionStatusUseCase: ChangeSubscriptionStatusUseCase,
    private readonly deleteSubscriptionUseCase: DeleteSubscriptionUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Criar uma nova assinatura" })
  @ApiResponse({ status: 201, description: "Assinatura criada com sucesso." })
  @ApiResponse({ status: 400, description: "Dados inválidos." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSubscriptionDto,
  ): Promise<SubscriptionOutput> {
    return this.createSubscriptionUseCase.execute({
      userId: user.userId,
      name: dto.name,
      plan: dto.plan,
      category: dto.category,
      paymentMethod: dto.paymentMethod,
      price: dto.price,
      currency: dto.currency,
      billing: dto.billing,
      status: dto.status,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      renewalDate: dto.renewalDate,
      color: dto.color,
      lucideIcon: dto.lucideIcon,
      brandLogoUri: dto.brandLogoUri,
      brandHex: dto.brandHex,
    });
  }

  @Get()
  @ApiOperation({
    summary: "Listar todas as assinaturas do usuário autenticado",
  })
  @ApiResponse({ status: 200, description: "Lista de assinaturas retornada." })
  async list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListSubscriptionsQueryDto,
  ): Promise<SubscriptionOutput[]> {
    return this.listUserSubscriptionsUseCase.execute({
      userId: user.userId,
      filters: {
        status: query.status,
        category: query.category,
        search: query.search,
      },
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Obter detalhes de uma assinatura pelo ID" })
  @ApiParam({ name: "id", description: "ID único da assinatura" })
  @ApiResponse({
    status: 200,
    description: "Detalhes da assinatura retornados.",
  })
  @ApiResponse({ status: 404, description: "Assinatura não encontrada." })
  async getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ): Promise<SubscriptionOutput> {
    return this.getSubscriptionByIdUseCase.execute({
      id,
      userId: user.userId,
    });
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar campos de uma assinatura" })
  @ApiParam({ name: "id", description: "ID único da assinatura" })
  @ApiResponse({
    status: 200,
    description: "Assinatura atualizada com sucesso.",
  })
  @ApiResponse({ status: 404, description: "Assinatura não encontrada." })
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: UpdateSubscriptionDto,
  ): Promise<SubscriptionOutput> {
    return this.updateSubscriptionUseCase.execute({
      id,
      userId: user.userId,
      data: dto,
    });
  }

  @Patch(":id/status")
  @ApiOperation({
    summary:
      "Alterar status do ciclo de vida da assinatura (pausar, reativar, cancelar)",
  })
  @ApiParam({ name: "id", description: "ID único da assinatura" })
  @ApiResponse({ status: 200, description: "Status alterado com sucesso." })
  @ApiResponse({ status: 400, description: "Transição de status inválida." })
  @ApiResponse({ status: 404, description: "Assinatura não encontrada." })
  async changeStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: ChangeSubscriptionStatusDto,
  ): Promise<SubscriptionOutput> {
    return this.changeSubscriptionStatusUseCase.execute({
      id,
      userId: user.userId,
      action: dto.action,
      status: dto.status,
    });
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Excluir permanentemente uma assinatura" })
  @ApiParam({ name: "id", description: "ID único da assinatura" })
  @ApiResponse({ status: 204, description: "Assinatura removida com sucesso." })
  @ApiResponse({ status: 404, description: "Assinatura não encontrada." })
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ): Promise<void> {
    await this.deleteSubscriptionUseCase.execute({
      id,
      userId: user.userId,
    });
  }
}
