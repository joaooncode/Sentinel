import { InMemorySubscriptionRepository } from "@infrastructure/repositories/in-memory-subscription.repository";
import { Subscription } from "@domain/entities/subscription.entity";
import { SubscriptionNotFoundException } from "@domain/errors/subscription-not-found.exception";
import { GetSubscriptionByIdUseCase } from "./get-subscription-by-id.use-case";

describe("GetSubscriptionByIdUseCase", () => {
  let repository: InMemorySubscriptionRepository;
  let sut: GetSubscriptionByIdUseCase;

  beforeEach(async () => {
    repository = new InMemorySubscriptionRepository();
    sut = new GetSubscriptionByIdUseCase(repository);

    await repository.create(
      Subscription.create({
        id: "sub-123",
        userId: "user-abc",
        name: "iCloud+",
        plan: "200 GB",
        category: "Armazenamento",
        price: 14.9,
        renewalDate: new Date("2026-09-05T00:00:00.000Z"),
      }),
    );
  });

  it("should return the subscription when found with matching userId", async () => {
    const result = await sut.execute({
      id: "sub-123",
      userId: "user-abc",
    });

    expect(result.id).toBe("sub-123");
    expect(result.name).toBe("iCloud+");
    expect(result.plan).toBe("200 GB");
  });

  it("should throw SubscriptionNotFoundException when subscription does not exist", async () => {
    await expect(
      sut.execute({
        id: "sub-non-existent",
        userId: "user-abc",
      }),
    ).rejects.toThrow(SubscriptionNotFoundException);
  });

  it("should throw SubscriptionNotFoundException when subscription belongs to another user", async () => {
    await expect(
      sut.execute({
        id: "sub-123",
        userId: "user-intruder",
      }),
    ).rejects.toThrow(SubscriptionNotFoundException);
  });
});
