import { InMemorySubscriptionRepository } from "@infrastructure/repositories/in-memory-subscription.repository";
import { Subscription } from "@domain/entities/subscription.entity";
import { SubscriptionNotFoundException } from "@domain/errors/subscription-not-found.exception";
import { InvalidSubscriptionOperationException } from "@domain/errors/invalid-subscription-operation.exception";
import { ChangeSubscriptionStatusUseCase } from "./change-subscription-status.use-case";

describe("ChangeSubscriptionStatusUseCase", () => {
  let repository: InMemorySubscriptionRepository;
  let sut: ChangeSubscriptionStatusUseCase;

  beforeEach(async () => {
    repository = new InMemorySubscriptionRepository();
    sut = new ChangeSubscriptionStatusUseCase(repository);

    await repository.create(
      Subscription.create({
        id: "sub-gym",
        userId: "user-123",
        name: "Academia Smart Fit",
        price: 129.9,
        renewalDate: new Date("2026-09-01T00:00:00.000Z"),
      }),
    );
  });

  it("should pause an active subscription using action 'pause'", async () => {
    const output = await sut.execute({
      id: "sub-gym",
      userId: "user-123",
      action: "pause",
    });

    expect(output.status).toBe("PAUSADO");
    const saved = await repository.findById("sub-gym");
    expect(saved?.status.isPaused()).toBe(true);
  });

  it("should resume a paused subscription using action 'resume'", async () => {
    await sut.execute({
      id: "sub-gym",
      userId: "user-123",
      action: "pause",
    });

    const output = await sut.execute({
      id: "sub-gym",
      userId: "user-123",
      action: "resume",
    });

    expect(output.status).toBe("ATIVO");
    const saved = await repository.findById("sub-gym");
    expect(saved?.status.isActive()).toBe(true);
  });

  it("should cancel a subscription using action 'cancel'", async () => {
    const output = await sut.execute({
      id: "sub-gym",
      userId: "user-123",
      action: "cancel",
    });

    expect(output.status).toBe("CANCELADO");
    const saved = await repository.findById("sub-gym");
    expect(saved?.status.isCanceled()).toBe(true);
  });

  it("should support target status directly", async () => {
    const output = await sut.execute({
      id: "sub-gym",
      userId: "user-123",
      status: "PAUSADO",
    });

    expect(output.status).toBe("PAUSADO");
  });

  it("should throw SubscriptionNotFoundException for non-existent subscription", async () => {
    await expect(
      sut.execute({
        id: "sub-unknown",
        userId: "user-123",
        action: "pause",
      }),
    ).rejects.toThrow(SubscriptionNotFoundException);
  });

  it("should throw InvalidSubscriptionOperationException on illegal state transition", async () => {
    // Cancel it first
    await sut.execute({
      id: "sub-gym",
      userId: "user-123",
      action: "cancel",
    });

    // Attempting to pause a canceled subscription
    await expect(
      sut.execute({
        id: "sub-gym",
        userId: "user-123",
        action: "pause",
      }),
    ).rejects.toThrow(InvalidSubscriptionOperationException);
  });
});
