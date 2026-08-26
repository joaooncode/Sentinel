import { InMemorySubscriptionRepository } from "@infrastructure/repositories/in-memory-subscription.repository";
import { Subscription } from "@domain/entities/subscription.entity";
import { SubscriptionNotFoundException } from "@domain/errors/subscription-not-found.exception";
import { UpdateSubscriptionUseCase } from "./update-subscription.use-case";

describe("UpdateSubscriptionUseCase", () => {
  let repository: InMemorySubscriptionRepository;
  let sut: UpdateSubscriptionUseCase;

  beforeEach(async () => {
    repository = new InMemorySubscriptionRepository();
    sut = new UpdateSubscriptionUseCase(repository);

    await repository.create(
      Subscription.create({
        id: "sub-netflix",
        userId: "user-123",
        name: "Netflix",
        plan: "Padrão",
        category: "Streaming",
        paymentMethod: "Cartão de Crédito",
        price: 39.9,
        currency: "BRL",
        billing: "MENSAL",
        renewalDate: new Date("2026-09-01T00:00:00.000Z"),
      }),
    );
  });

  it("should update subscription fields successfully", async () => {
    const output = await sut.execute({
      id: "sub-netflix",
      userId: "user-123",
      data: {
        name: "Netflix 4K Ultra",
        plan: "Premium",
        price: 55.9,
        billing: "MENSAL",
        color: "#E50914",
      },
    });

    expect(output.name).toBe("Netflix 4K Ultra");
    expect(output.plan).toBe("Premium");
    expect(output.price).toBe(55.9);
    expect(output.color).toBe("#E50914");

    const saved = await repository.findById("sub-netflix");
    expect(saved?.name).toBe("Netflix 4K Ultra");
    expect(saved?.price.amount).toBe(55.9);
  });

  it("should throw SubscriptionNotFoundException when updating non-existent subscription", async () => {
    await expect(
      sut.execute({
        id: "sub-non-existent",
        userId: "user-123",
        data: { name: "Disney+" },
      }),
    ).rejects.toThrow(SubscriptionNotFoundException);
  });

  it("should throw SubscriptionNotFoundException when updating subscription of another user", async () => {
    await expect(
      sut.execute({
        id: "sub-netflix",
        userId: "user-other",
        data: { name: "Hacked Netflix" },
      }),
    ).rejects.toThrow(SubscriptionNotFoundException);
  });

  it("should throw error if updated price is negative", async () => {
    await expect(
      sut.execute({
        id: "sub-netflix",
        userId: "user-123",
        data: { price: -20 },
      }),
    ).rejects.toThrow("O valor da assinatura não pode ser negativo.");
  });
});
