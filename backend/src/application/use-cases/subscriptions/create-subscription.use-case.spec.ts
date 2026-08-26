import { InMemorySubscriptionRepository } from "@infrastructure/repositories/in-memory-subscription.repository";
import { CreateSubscriptionUseCase } from "./create-subscription.use-case";

describe("CreateSubscriptionUseCase", () => {
  let repository: InMemorySubscriptionRepository;
  let sut: CreateSubscriptionUseCase;

  beforeEach(() => {
    repository = new InMemorySubscriptionRepository();
    sut = new CreateSubscriptionUseCase(repository);
  });

  it("should create a new subscription with valid data", async () => {
    const output = await sut.execute({
      userId: "user_test_123",
      name: "Spotify",
      plan: "Premium Individual",
      category: "Música",
      paymentMethod: "Cartão de Crédito",
      price: 21.9,
      currency: "BRL",
      billing: "MENSAL",
      renewalDate: new Date("2026-09-26T00:00:00.000Z"),
      color: "#1DB954",
      lucideIcon: "music",
      brandLogoUri: "https://logo.clearbit.com/spotify.com",
      brandHex: "#1DB954",
    });

    expect(output.id).toBeDefined();
    expect(output.userId).toBe("user_test_123");
    expect(output.name).toBe("Spotify");
    expect(output.plan).toBe("Premium Individual");
    expect(output.category).toBe("Música");
    expect(output.paymentMethod).toBe("Cartão de Crédito");
    expect(output.status).toBe("ATIVO");
    expect(output.price).toBe(21.9);
    expect(output.currency).toBe("BRL");
    expect(output.billing).toBe("MENSAL");
    expect(output.color).toBe("#1DB954");
    expect(output.brandLogoUri).toBe("https://logo.clearbit.com/spotify.com");

    const saved = await repository.findById(output.id);
    expect(saved).not.toBeNull();
    expect(saved?.name).toBe("Spotify");
  });

  it("should create with default values when optional fields are omitted", async () => {
    const output = await sut.execute({
      userId: "user_test_123",
      name: "Netflix",
      price: 55.9,
      renewalDate: new Date("2026-09-01T00:00:00.000Z"),
    });

    expect(output.plan).toBe("Padrão");
    expect(output.category).toBe("Outros");
    expect(output.paymentMethod).toBe("Não informado");
    expect(output.status).toBe("ATIVO");
    expect(output.currency).toBe("BRL");
    expect(output.billing).toBe("MENSAL");
  });

  it("should throw error if name is empty", async () => {
    await expect(
      sut.execute({
        userId: "user_test_123",
        name: "",
        price: 30,
        renewalDate: new Date(),
      }),
    ).rejects.toThrow("O nome da assinatura não pode ser vazio.");
  });

  it("should throw error if price is negative", async () => {
    await expect(
      sut.execute({
        userId: "user_test_123",
        name: "Serviço Inválido",
        price: -10,
        renewalDate: new Date(),
      }),
    ).rejects.toThrow("O valor da assinatura não pode ser negativo.");
  });
});
