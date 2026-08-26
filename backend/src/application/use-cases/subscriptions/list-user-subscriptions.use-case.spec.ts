import { InMemorySubscriptionRepository } from "@infrastructure/repositories/in-memory-subscription.repository";
import { Subscription } from "@domain/entities/subscription.entity";
import { ListUserSubscriptionsUseCase } from "./list-user-subscriptions.use-case";

describe("ListUserSubscriptionsUseCase", () => {
  let repository: InMemorySubscriptionRepository;
  let sut: ListUserSubscriptionsUseCase;

  beforeEach(async () => {
    repository = new InMemorySubscriptionRepository();
    sut = new ListUserSubscriptionsUseCase(repository);

    await repository.create(
      Subscription.create({
        id: "sub-1",
        userId: "user-1",
        name: "Netflix",
        plan: "4K Premium",
        category: "Streaming",
        price: 55.9,
        renewalDate: new Date("2026-09-01"),
      }),
    );

    await repository.create(
      Subscription.create({
        id: "sub-2",
        userId: "user-1",
        name: "Spotify",
        plan: "Família",
        category: "Música",
        price: 34.9,
        renewalDate: new Date("2026-09-10"),
      }),
    );

    const pausedSub = Subscription.create({
      id: "sub-3",
      userId: "user-1",
      name: "Gympass",
      plan: "Silver",
      category: "Saúde",
      price: 99.9,
      renewalDate: new Date("2026-09-15"),
    });
    pausedSub.pause();
    await repository.create(pausedSub);

    // Another user's subscription
    await repository.create(
      Subscription.create({
        id: "sub-4",
        userId: "user-2",
        name: "HBO Max",
        category: "Streaming",
        price: 34.9,
        renewalDate: new Date("2026-09-05"),
      }),
    );
  });

  it("should list all subscriptions for a given user", async () => {
    const list = await sut.execute({ userId: "user-1" });
    expect(list).toHaveLength(3);
    expect(list.map((s) => s.id)).toEqual(["sub-1", "sub-2", "sub-3"]);
  });

  it("should filter subscriptions by status", async () => {
    const activeList = await sut.execute({
      userId: "user-1",
      filters: { status: "ATIVO" },
    });
    expect(activeList).toHaveLength(2);
    expect(activeList.map((s) => s.id)).toEqual(["sub-1", "sub-2"]);

    const pausedList = await sut.execute({
      userId: "user-1",
      filters: { status: "PAUSADO" },
    });
    expect(pausedList).toHaveLength(1);
    expect(pausedList[0].id).toBe("sub-3");
  });

  it("should filter subscriptions by category", async () => {
    const streamingList = await sut.execute({
      userId: "user-1",
      filters: { category: "Streaming" },
    });
    expect(streamingList).toHaveLength(1);
    expect(streamingList[0].id).toBe("sub-1");
  });

  it("should filter subscriptions by search query (name or plan)", async () => {
    const searchByName = await sut.execute({
      userId: "user-1",
      filters: { search: "netfl" },
    });
    expect(searchByName).toHaveLength(1);
    expect(searchByName[0].name).toBe("Netflix");

    const searchByPlan = await sut.execute({
      userId: "user-1",
      filters: { search: "família" },
    });
    expect(searchByPlan).toHaveLength(1);
    expect(searchByPlan[0].name).toBe("Spotify");
  });
});
