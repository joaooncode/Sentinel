import { InMemorySubscriptionRepository } from "@infrastructure/repositories/in-memory-subscription.repository";
import { Subscription } from "@domain/entities/subscription.entity";
import { SubscriptionNotFoundException } from "@domain/errors/subscription-not-found.exception";
import { DeleteSubscriptionUseCase } from "./delete-subscription.use-case";

describe("DeleteSubscriptionUseCase", () => {
  let repository: InMemorySubscriptionRepository;
  let sut: DeleteSubscriptionUseCase;

  beforeEach(async () => {
    repository = new InMemorySubscriptionRepository();
    sut = new DeleteSubscriptionUseCase(repository);

    await repository.create(
      Subscription.create({
        id: "sub-to-delete",
        userId: "user-123",
        name: "Serviço Desnecessário",
        price: 19.9,
        renewalDate: new Date("2026-09-01"),
      }),
    );
  });

  it("should delete an existing subscription successfully", async () => {
    await sut.execute({
      id: "sub-to-delete",
      userId: "user-123",
    });

    const deleted = await repository.findById("sub-to-delete");
    expect(deleted).toBeNull();
  });

  it("should throw SubscriptionNotFoundException when attempting to delete non-existent subscription", async () => {
    await expect(
      sut.execute({
        id: "sub-non-existent",
        userId: "user-123",
      }),
    ).rejects.toThrow(SubscriptionNotFoundException);
  });

  it("should throw SubscriptionNotFoundException when deleting subscription of another user", async () => {
    await expect(
      sut.execute({
        id: "sub-to-delete",
        userId: "user-intruder",
      }),
    ).rejects.toThrow(SubscriptionNotFoundException);
  });
});
