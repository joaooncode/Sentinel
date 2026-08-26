import { InMemorySubscriptionRepository } from "../../../infrastructure/repositories/in-memory-subscription.repository";
import { Subscription } from "../../../domain/entities/subscription.entity";
import { GetUpcomingRenewalsUseCase } from "./get-upcoming-renewals.use-case";

describe("GetUpcomingRenewalsUseCase", () => {
  let subscriptionRepository: InMemorySubscriptionRepository;
  let sut: GetUpcomingRenewalsUseCase;

  const fixedNow = new Date("2026-08-26T12:00:00Z");

  beforeEach(() => {
    subscriptionRepository = new InMemorySubscriptionRepository();
    sut = new GetUpcomingRenewalsUseCase(subscriptionRepository);
  });

  it("should return an empty list when user has no active subscriptions", async () => {
    const result = await sut.execute({
      userId: "user_empty",
      referenceDate: fixedNow,
    });

    expect(result).toEqual([]);
  });

  it("should return upcoming renewals sorted by renewal date ascending", async () => {
    const sub1 = Subscription.create({
      id: "sub_1",
      userId: "user_1",
      name: "Netflix",
      price: 55.9,
      billing: "MENSAL",
      renewalDate: new Date("2026-08-30T12:00:00Z"), // in 4 days
      color: "#E50914",
      lucideIcon: "tv",
      category: "Streaming",
      status: "ATIVO",
    });

    const sub2 = Subscription.create({
      id: "sub_2",
      userId: "user_1",
      name: "Spotify",
      price: 34.9,
      billing: "MENSAL",
      renewalDate: new Date("2026-08-27T12:00:00Z"), // in 1 day
      brandHex: "#1DB954",
      category: "Streaming",
      status: "ATIVO",
    });

    const sub3 = Subscription.create({
      id: "sub_3",
      userId: "user_1",
      name: "GitHub Copilot",
      price: 10,
      currency: "USD",
      billing: "MENSAL",
      renewalDate: new Date("2026-09-10T12:00:00Z"), // in 15 days
      category: "Desenvolvimento",
      status: "ATIVO",
    });

    await subscriptionRepository.create(sub1);
    await subscriptionRepository.create(sub2);
    await subscriptionRepository.create(sub3);

    const result = await sut.execute({
      userId: "user_1",
      referenceDate: fixedNow,
    });

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("sub_2");
    expect(result[0].name).toBe("Spotify");
    expect(result[0].daysLeft).toBe(1);
    expect(result[0].isOverdue).toBe(false);

    expect(result[1].id).toBe("sub_1");
    expect(result[1].name).toBe("Netflix");
    expect(result[1].daysLeft).toBe(4);

    expect(result[2].id).toBe("sub_3");
    expect(result[2].name).toBe("GitHub Copilot");
    expect(result[2].daysLeft).toBe(15);
  });

  it("should ignore paused and canceled subscriptions", async () => {
    const activeSub = Subscription.create({
      id: "sub_active",
      userId: "user_1",
      name: "Active Sub",
      price: 20,
      renewalDate: new Date("2026-08-28T12:00:00Z"),
      status: "ATIVO",
    });

    const pausedSub = Subscription.create({
      id: "sub_paused",
      userId: "user_1",
      name: "Paused Sub",
      price: 30,
      renewalDate: new Date("2026-08-27T12:00:00Z"),
      status: "PAUSADO",
    });

    const canceledSub = Subscription.create({
      id: "sub_canceled",
      userId: "user_1",
      name: "Canceled Sub",
      price: 40,
      renewalDate: new Date("2026-08-27T12:00:00Z"),
      status: "CANCELADO",
    });

    await subscriptionRepository.create(activeSub);
    await subscriptionRepository.create(pausedSub);
    await subscriptionRepository.create(canceledSub);

    const result = await sut.execute({
      userId: "user_1",
      referenceDate: fixedNow,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("sub_active");
  });

  it("should filter by daysAhead and respect limit", async () => {
    const subClose = Subscription.create({
      userId: "user_1",
      name: "Close Sub",
      price: 15,
      renewalDate: new Date("2026-08-28T12:00:00Z"), // in 2 days
      status: "ATIVO",
    });

    const subMedium = Subscription.create({
      userId: "user_1",
      name: "Medium Sub",
      price: 25,
      renewalDate: new Date("2026-09-02T12:00:00Z"), // in 7 days
      status: "ATIVO",
    });

    const subFar = Subscription.create({
      userId: "user_1",
      name: "Far Sub",
      price: 35,
      renewalDate: new Date("2026-10-15T12:00:00Z"), // in 50 days
      status: "ATIVO",
    });

    await subscriptionRepository.create(subClose);
    await subscriptionRepository.create(subMedium);
    await subscriptionRepository.create(subFar);

    const result30Days = await sut.execute({
      userId: "user_1",
      daysAhead: 30,
      referenceDate: fixedNow,
    });

    expect(result30Days).toHaveLength(2);
    expect(result30Days.map((s) => s.name)).toEqual([
      "Close Sub",
      "Medium Sub",
    ]);

    const resultLimit1 = await sut.execute({
      userId: "user_1",
      limit: 1,
      referenceDate: fixedNow,
    });

    expect(resultLimit1).toHaveLength(1);
    expect(resultLimit1[0].name).toBe("Close Sub");
  });
});
