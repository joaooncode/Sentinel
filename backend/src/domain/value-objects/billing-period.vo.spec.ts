import { BillingPeriod } from "./billing-period.vo";

describe("BillingPeriod Value Object", () => {
  it("should create a valid BillingPeriod for MENSAL", () => {
    const period = BillingPeriod.create("MENSAL");
    expect(period.value).toBe("MENSAL");
    expect(period.isMonthly()).toBe(true);
  });

  it("should create a valid BillingPeriod for SEMANAL", () => {
    const period = BillingPeriod.create("SEMANAL");
    expect(period.value).toBe("SEMANAL");
    expect(period.isWeekly()).toBe(true);
  });

  it("should create a valid BillingPeriod for ANUAL", () => {
    const period = BillingPeriod.create("ANUAL");
    expect(period.value).toBe("ANUAL");
    expect(period.isYearly()).toBe(true);
  });

  it("should calculate equivalent monthly amount accurately", () => {
    const monthly = BillingPeriod.create("MENSAL");
    expect(monthly.toMonthlyAmount(100)).toBe(100);

    const yearly = BillingPeriod.create("ANUAL");
    expect(yearly.toMonthlyAmount(1200)).toBe(100);

    const weekly = BillingPeriod.create("SEMANAL");
    // 10 * 52 / 12 = 43.333333333333336 -> rounded to 43.33
    expect(weekly.toMonthlyAmount(10)).toBe(43.33);
  });

  it("should calculate equivalent yearly amount accurately", () => {
    const monthly = BillingPeriod.create("MENSAL");
    expect(monthly.toYearlyAmount(100)).toBe(1200);

    const yearly = BillingPeriod.create("ANUAL");
    expect(yearly.toYearlyAmount(1200)).toBe(1200);

    const weekly = BillingPeriod.create("SEMANAL");
    expect(weekly.toYearlyAmount(10)).toBe(520);
  });

  it("should throw error for invalid billing cycle", () => {
    expect(() => BillingPeriod.create("DIARIO" as unknown as "MENSAL")).toThrow(
      "Ciclo de cobrança inválido: DIARIO",
    );
  });

  it("should check equality", () => {
    const p1 = BillingPeriod.create("MENSAL");
    const p2 = BillingPeriod.create("MENSAL");
    const p3 = BillingPeriod.create("ANUAL");

    expect(p1.equals(p2)).toBe(true);
    expect(p1.equals(p3)).toBe(false);
  });
});
