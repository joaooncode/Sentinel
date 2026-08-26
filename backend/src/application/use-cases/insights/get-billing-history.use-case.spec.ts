import { InMemoryBillingHistoryRepository } from "../../../infrastructure/repositories/in-memory-billing-history.repository";
import { BillingHistory } from "../../../domain/entities/billing-history.entity";
import { GetBillingHistoryUseCase } from "./get-billing-history.use-case";

describe("GetBillingHistoryUseCase", () => {
  let billingHistoryRepository: InMemoryBillingHistoryRepository;
  let sut: GetBillingHistoryUseCase;

  beforeEach(() => {
    billingHistoryRepository = new InMemoryBillingHistoryRepository();
    sut = new GetBillingHistoryUseCase(billingHistoryRepository);
  });

  it("should return an empty list when user has no billing records", async () => {
    const result = await sut.execute({ userId: "user_empty" });

    expect(result).toEqual([]);
  });

  it("should return billing history for a user sorted by paidAt descending", async () => {
    const hist1 = BillingHistory.create({
      id: "hist_1",
      userId: "user_1",
      subscriptionId: "sub_1",
      amount: 49.9,
      paidAt: new Date("2026-06-01T10:00:00Z"),
    });

    const hist2 = BillingHistory.create({
      id: "hist_2",
      userId: "user_1",
      subscriptionId: "sub_2",
      amount: 29.9,
      paidAt: new Date("2026-08-01T10:00:00Z"),
    });

    const hist3 = BillingHistory.create({
      id: "hist_3",
      userId: "user_1",
      subscriptionId: "sub_1",
      amount: 49.9,
      paidAt: new Date("2026-07-01T10:00:00Z"),
    });

    // Another user's record
    const histOther = BillingHistory.create({
      id: "hist_other",
      userId: "user_other",
      subscriptionId: "sub_other",
      amount: 99.0,
      paidAt: new Date("2026-08-15T10:00:00Z"),
    });

    await billingHistoryRepository.create(hist1);
    await billingHistoryRepository.create(hist2);
    await billingHistoryRepository.create(hist3);
    await billingHistoryRepository.create(histOther);

    const result = await sut.execute({ userId: "user_1" });

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("hist_2"); // Aug 1
    expect(result[1].id).toBe("hist_3"); // Jul 1
    expect(result[2].id).toBe("hist_1"); // Jun 1
  });

  it("should filter billing history by subscriptionId when provided", async () => {
    const hist1 = BillingHistory.create({
      id: "hist_1",
      userId: "user_1",
      subscriptionId: "sub_1",
      amount: 55.0,
      paidAt: new Date("2026-07-01T10:00:00Z"),
    });

    const hist2 = BillingHistory.create({
      id: "hist_2",
      userId: "user_1",
      subscriptionId: "sub_2",
      amount: 30.0,
      paidAt: new Date("2026-08-01T10:00:00Z"),
    });

    await billingHistoryRepository.create(hist1);
    await billingHistoryRepository.create(hist2);

    const result = await sut.execute({
      userId: "user_1",
      subscriptionId: "sub_1",
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("hist_1");
    expect(result[0].subscriptionId).toBe("sub_1");
    expect(result[0].amount).toBe(55.0);
  });
});
