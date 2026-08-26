import { RenewalDate } from "./renewal-date.vo";
import { BillingPeriod } from "./billing-period.vo";

describe("RenewalDate Value Object", () => {
  it("should create a valid RenewalDate from Date instance", () => {
    const target = new Date("2026-09-01T10:00:00Z");
    const renewal = RenewalDate.create(target);
    expect(renewal.value.getTime()).toBe(target.getTime());
  });

  it("should create a valid RenewalDate from ISO string", () => {
    const renewal = RenewalDate.create("2026-09-01T10:00:00.000Z");
    expect(renewal.value.toISOString()).toBe("2026-09-01T10:00:00.000Z");
  });

  it("should throw error for invalid Date", () => {
    expect(() => RenewalDate.create(new Date("invalid-date"))).toThrow(
      "Data de renovação inválida.",
    );
    expect(() => RenewalDate.create("data-invalida")).toThrow(
      "Data de renovação inválida.",
    );
  });

  describe("daysUntilRenewal calculation", () => {
    it("should return positive days for future date", () => {
      const now = new Date("2026-08-26T00:00:00Z");
      const future = RenewalDate.create(new Date("2026-08-30T00:00:00Z"));
      expect(future.daysUntilRenewal(now)).toBe(4);
      expect(future.isOverdue(now)).toBe(false);
    });

    it("should return 0 for renewal date today", () => {
      const now = new Date("2026-08-26T15:00:00Z");
      const today = RenewalDate.create(new Date("2026-08-26T09:00:00Z"));
      expect(today.daysUntilRenewal(now)).toBe(0);
      expect(today.isOverdue(now)).toBe(false);
    });

    it("should return negative days for past date and mark as overdue", () => {
      const now = new Date("2026-08-26T00:00:00Z");
      const past = RenewalDate.create(new Date("2026-08-20T00:00:00Z"));
      expect(past.daysUntilRenewal(now)).toBe(-6);
      expect(past.isOverdue(now)).toBe(true);
    });
  });

  describe("nextCycle advancement", () => {
    it("should advance 1 week for SEMANAL billing cycle", () => {
      const current = RenewalDate.create(new Date("2026-08-26T12:00:00Z"));
      const next = current.nextCycle("SEMANAL");
      expect(next.value.toISOString()).toBe("2026-09-02T12:00:00.000Z");
    });

    it("should advance 1 month for MENSAL billing cycle", () => {
      const current = RenewalDate.create(new Date("2026-08-26T12:00:00Z"));
      const next = current.nextCycle(BillingPeriod.create("MENSAL"));
      expect(next.value.toISOString()).toBe("2026-09-26T12:00:00.000Z");
    });

    it("should advance 1 year for ANUAL billing cycle", () => {
      const current = RenewalDate.create(new Date("2026-08-26T12:00:00Z"));
      const next = current.nextCycle(BillingPeriod.create("ANUAL"));
      expect(next.value.toISOString()).toBe("2027-08-26T12:00:00.000Z");
    });
  });
});
