import { SubscriptionsController } from "./subscriptions.controller";
import { CreateSubscriptionUseCase } from "@application/use-cases/subscriptions/create-subscription.use-case";
import { ListUserSubscriptionsUseCase } from "@application/use-cases/subscriptions/list-user-subscriptions.use-case";
import { GetSubscriptionByIdUseCase } from "@application/use-cases/subscriptions/get-subscription-by-id.use-case";
import { UpdateSubscriptionUseCase } from "@application/use-cases/subscriptions/update-subscription.use-case";
import { ChangeSubscriptionStatusUseCase } from "@application/use-cases/subscriptions/change-subscription-status.use-case";
import { DeleteSubscriptionUseCase } from "@application/use-cases/subscriptions/delete-subscription.use-case";
import { AuthenticatedUser } from "@common/decorators/current-user.decorator";

describe("SubscriptionsController", () => {
  let controller: SubscriptionsController;
  let createUseCase: jest.Mocked<CreateSubscriptionUseCase>;
  let listUseCase: jest.Mocked<ListUserSubscriptionsUseCase>;
  let getByIdUseCase: jest.Mocked<GetSubscriptionByIdUseCase>;
  let updateUseCase: jest.Mocked<UpdateSubscriptionUseCase>;
  let changeStatusUseCase: jest.Mocked<ChangeSubscriptionStatusUseCase>;
  let deleteUseCase: jest.Mocked<DeleteSubscriptionUseCase>;

  const mockUser: AuthenticatedUser = {
    userId: "user_123",
    email: "test@sentinel.app",
  };

  const sampleOutput = {
    id: "sub_123",
    userId: "user_123",
    name: "Netflix",
    plan: "Premium",
    category: "Streaming",
    paymentMethod: "Cartão",
    status: "ATIVO" as const,
    price: 55.9,
    currency: "BRL" as const,
    billing: "MENSAL" as const,
    startDate: new Date("2026-01-01"),
    renewalDate: new Date("2026-09-01"),
    color: "#E50914",
    lucideIcon: "Tv",
    brandLogoUri: null,
    brandHex: "#E50914",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    createUseCase = {
      execute: jest.fn().mockResolvedValue(sampleOutput),
    } as unknown as jest.Mocked<CreateSubscriptionUseCase>;

    listUseCase = {
      execute: jest.fn().mockResolvedValue([sampleOutput]),
    } as unknown as jest.Mocked<ListUserSubscriptionsUseCase>;

    getByIdUseCase = {
      execute: jest.fn().mockResolvedValue(sampleOutput),
    } as unknown as jest.Mocked<GetSubscriptionByIdUseCase>;

    updateUseCase = {
      execute: jest.fn().mockResolvedValue(sampleOutput),
    } as unknown as jest.Mocked<UpdateSubscriptionUseCase>;

    changeStatusUseCase = {
      execute: jest.fn().mockResolvedValue({
        ...sampleOutput,
        status: "PAUSADO",
      }),
    } as unknown as jest.Mocked<ChangeSubscriptionStatusUseCase>;

    deleteUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<DeleteSubscriptionUseCase>;

    controller = new SubscriptionsController(
      createUseCase,
      listUseCase,
      getByIdUseCase,
      updateUseCase,
      changeStatusUseCase,
      deleteUseCase,
    );
  });

  it("deve criar uma assinatura com sucesso", async () => {
    const result = await controller.create(mockUser, {
      name: "Netflix",
      price: 55.9,
      renewalDate: "2026-09-01T00:00:00.000Z",
    });

    expect(createUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user_123",
        name: "Netflix",
        price: 55.9,
      }),
    );
    expect(result.id).toBe("sub_123");
  });

  it("deve listar assinaturas com filtros", async () => {
    const result = await controller.list(mockUser, {
      status: "ATIVO",
      category: "Streaming",
      search: "Net",
    });

    expect(listUseCase.execute).toHaveBeenCalledWith({
      userId: "user_123",
      filters: {
        status: "ATIVO",
        category: "Streaming",
        search: "Net",
      },
    });
    expect(result).toHaveLength(1);
  });

  it("deve buscar uma assinatura por ID", async () => {
    const result = await controller.getById(mockUser, "sub_123");

    expect(getByIdUseCase.execute).toHaveBeenCalledWith({
      id: "sub_123",
      userId: "user_123",
    });
    expect(result.name).toBe("Netflix");
  });

  it("deve atualizar uma assinatura", async () => {
    const result = await controller.update(mockUser, "sub_123", {
      name: "Netflix 4K",
      price: 59.9,
    });

    expect(updateUseCase.execute).toHaveBeenCalledWith({
      id: "sub_123",
      userId: "user_123",
      data: { name: "Netflix 4K", price: 59.9 },
    });
    expect(result).toBeDefined();
  });

  it("deve alterar o status de uma assinatura", async () => {
    const result = await controller.changeStatus(mockUser, "sub_123", {
      action: "pause",
    });

    expect(changeStatusUseCase.execute).toHaveBeenCalledWith({
      id: "sub_123",
      userId: "user_123",
      action: "pause",
      status: undefined,
    });
    expect(result.status).toBe("PAUSADO");
  });

  it("deve deletar uma assinatura", async () => {
    await controller.delete(mockUser, "sub_123");

    expect(deleteUseCase.execute).toHaveBeenCalledWith({
      id: "sub_123",
      userId: "user_123",
    });
  });
});
