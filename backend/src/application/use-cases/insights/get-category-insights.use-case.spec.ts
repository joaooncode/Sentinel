import { InMemorySubscriptionRepository } from "../../../infrastructure/repositories/in-memory-subscription.repository";
import { Subscription } from "../../../domain/entities/subscription.entity";
import { GetCategoryInsightsUseCase } from "./get-category-insights.use-case";

describe("GetCategoryInsightsUseCase", () => {
  let subscriptionRepository: InMemorySubscriptionRepository;
  let sut: GetCategoryInsightsUseCase;

  beforeEach(() => {
    subscriptionRepository = new InMemorySubscriptionRepository();
    sut = new GetCategoryInsightsUseCase(subscriptionRepository);
  });

  it("should return empty categories and 0 spend when user has no active subscriptions", async () => {
    const result = await sut.execute({ userId: "user_empty" });

    expect(result).toEqual({
      totalMonthlySpend: 0,
      categories: [],
    });
  });

  it("should group active subscriptions by category, calculate monthly spend and percentages sorted descending", async () => {
    // Streaming: Netflix (50/mo) + Spotify (30/mo) = 80/mo
    const sub1 = Subscription.create({
      userId: "user_1",
      name: "Netflix",
      price: 50,
      category: "Streaming",
      billing: "MENSAL",
      renewalDate: new Date(),
      status: "ATIVO",
    });

    const sub2 = Subscription.create({
      userId: "user_1",
      name: "Spotify",
      price: 30,
      category: "Streaming",
      billing: "MENSAL",
      renewalDate: new Date(),
      status: "ATIVO",
    });

    // Produtividade: ChatGPT (20/mo)
    const sub3 = Subscription.create({
      userId: "user_1",
      name: "ChatGPT",
      price: 20,
      category: "Produtividade",
      billing: "MENSAL",
      renewalDate: new Date(),
      status: "ATIVO",
    });

    // Paused / Canceled shouldn't affect category totals
    const sub4 = Subscription.create({
      userId: "user_1",
      name: "Old Gym",
      price: 100,
      category: "Saúde",
      billing: "MENSAL",
      renewalDate: new Date(),
      status: "CANCELADO",
    });

    await subscriptionRepository.create(sub1);
    await subscriptionRepository.create(sub2);
    await subscriptionRepository.create(sub3);
    await subscriptionRepository.create(sub4);

    const result = await sut.execute({ userId: "user_1" });

    // Total: 80 + 20 = 100
    expect(result.totalMonthlySpend).toBe(100);
    expect(result.categories).toHaveLength(2);

    expect(result.categories[0]).toEqual({
      category: "Streaming",
      totalMonthly: 80,
      percentage: 80,
      subscriptionsCount: 2,
    });

    expect(result.categories[1]).toEqual({
      category: "Produtividade",
      totalMonthly: 20,
      percentage: 20,
      subscriptionsCount: 1,
    });
  });

  it("should handle yearly and weekly subscriptions when grouping by category", async () => {
    // Software: Yearly 120/yr = 10/mo
    const sub1 = Subscription.create({
      userId: "user_2",
      name: "JetBrains",
      price: 120,
      category: "Software",
      billing: "ANUAL",
      renewalDate: new Date(),
      status: "ATIVO",
    });

    // Fitness: Weekly 10/wk = 43.33/mo
    const sub2 = Subscription.create({
      userId: "user_2",
      name: "CrossFit",
      price: 10,
      category: "Fitness",
      billing: "SEMANAL",
      renewalDate: new Date(),
      status: "ATIVO",
    });

    await subscriptionRepository.create(sub1);
    await subscriptionRepository.create(sub2);

    const result = await sut.execute({ userId: "user_2" });

    // Total: 10 + 43.33 = 53.33
    expect(result.totalMonthlySpend).toBe(53.33);
    expect(result.categories).toHaveLength(2);

    expect(result.categories[0].category).toBe("Fitness");
    expect(result.categories[0].totalMonthly).toBe(43.33);
    // 43.33 / 53.33 * 100 = 81.25%
    expect(result.categories[0].percentage).toBe(81.25);
    expect(result.categories[0].subscriptionsCount).toBe(1);

    expect(result.categories[1].category).toBe("Software");
    expect(result.categories[1].totalMonthly).toBe(10);
    // 10 / 53.33 * 100 = 18.75%
    expect(result.categories[1].percentage).toBe(18.75);
    expect(result.categories[1].subscriptionsCount).toBe(1);
  });
});
