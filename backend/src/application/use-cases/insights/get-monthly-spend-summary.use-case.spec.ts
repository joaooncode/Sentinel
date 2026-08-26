import { InMemorySubscriptionRepository } from "../../../infrastructure/repositories/in-memory-subscription.repository";
import { Subscription } from "../../../domain/entities/subscription.entity";
import { GetMonthlySpendSummaryUseCase } from "./get-monthly-spend-summary.use-case";

describe("GetMonthlySpendSummaryUseCase", () => {
  let subscriptionRepository: InMemorySubscriptionRepository;
  let sut: GetMonthlySpendSummaryUseCase;

  beforeEach(() => {
    subscriptionRepository = new InMemorySubscriptionRepository();
    sut = new GetMonthlySpendSummaryUseCase(subscriptionRepository);
  });

  it("should return zero spend and zero counts when user has no subscriptions", async () => {
    const result = await sut.execute({ userId: "user_empty" });

    expect(result).toEqual({
      totalMonthlySpend: 0,
      totalYearlySpend: 0,
      activeSubscriptionsCount: 0,
      pausedSubscriptionsCount: 0,
      canceledSubscriptionsCount: 0,
      totalSubscriptionsCount: 0,
      currency: "BRL",
    });
  });

  it("should calculate monthly spend consolidations accurately for weekly, monthly and yearly cycles", async () => {
    // Weekly: 10 * 52 / 12 = 43.33
    const weeklySub = Subscription.create({
      userId: "user_1",
      name: "Weekly Box",
      price: 10,
      billing: "SEMANAL",
      renewalDate: new Date("2026-09-01"),
      status: "ATIVO",
    });

    // Monthly: 50
    const monthlySub = Subscription.create({
      userId: "user_1",
      name: "Netflix",
      price: 50,
      billing: "MENSAL",
      renewalDate: new Date("2026-09-05"),
      status: "ATIVO",
    });

    // Yearly: 120 / 12 = 10
    const yearlySub = Subscription.create({
      userId: "user_1",
      name: "Amazon Prime",
      price: 120,
      billing: "ANUAL",
      renewalDate: new Date("2026-12-01"),
      status: "ATIVO",
    });

    await subscriptionRepository.create(weeklySub);
    await subscriptionRepository.create(monthlySub);
    await subscriptionRepository.create(yearlySub);

    const result = await sut.execute({ userId: "user_1" });

    // 43.33 + 50 + 10 = 103.33
    expect(result.totalMonthlySpend).toBe(103.33);
    // Yearly spend: (10*52) + (50*12) + 120 = 520 + 600 + 120 = 1240
    expect(result.totalYearlySpend).toBe(1240);
    expect(result.activeSubscriptionsCount).toBe(3);
    expect(result.pausedSubscriptionsCount).toBe(0);
    expect(result.canceledSubscriptionsCount).toBe(0);
    expect(result.totalSubscriptionsCount).toBe(3);
    expect(result.currency).toBe("BRL");
  });

  it("should only include active subscriptions in spend calculation but track paused and canceled in counts", async () => {
    const activeSub = Subscription.create({
      userId: "user_2",
      name: "Spotify",
      price: 34.9,
      billing: "MENSAL",
      renewalDate: new Date("2026-09-10"),
      status: "ATIVO",
    });

    const pausedSub = Subscription.create({
      userId: "user_2",
      name: "Gympass",
      price: 99.9,
      billing: "MENSAL",
      renewalDate: new Date("2026-09-15"),
      status: "PAUSADO",
    });

    const canceledSub = Subscription.create({
      userId: "user_2",
      name: "Old Gym",
      price: 80.0,
      billing: "MENSAL",
      renewalDate: new Date("2026-08-01"),
      status: "CANCELADO",
    });

    await subscriptionRepository.create(activeSub);
    await subscriptionRepository.create(pausedSub);
    await subscriptionRepository.create(canceledSub);

    const result = await sut.execute({ userId: "user_2" });

    expect(result.totalMonthlySpend).toBe(34.9);
    expect(result.totalYearlySpend).toBe(418.8);
    expect(result.activeSubscriptionsCount).toBe(1);
    expect(result.pausedSubscriptionsCount).toBe(1);
    expect(result.canceledSubscriptionsCount).toBe(1);
    expect(result.totalSubscriptionsCount).toBe(3);
  });

  it("should respect user currency when available", async () => {
    const subUsd = Subscription.create({
      userId: "user_usd",
      name: "ChatGPT Plus",
      price: 20,
      currency: "USD",
      billing: "MENSAL",
      renewalDate: new Date("2026-09-20"),
      status: "ATIVO",
    });

    await subscriptionRepository.create(subUsd);

    const result = await sut.execute({
      userId: "user_usd",
      defaultCurrency: "USD",
    });

    expect(result.totalMonthlySpend).toBe(20);
    expect(result.currency).toBe("USD");
  });
});
