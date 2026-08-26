export const BILLING_CYCLES = ["SEMANAL", "MENSAL", "ANUAL"] as const;
export type BillingCycle = (typeof BILLING_CYCLES)[number];

export class BillingPeriod {
  private readonly _value: BillingCycle;

  private constructor(value: BillingCycle) {
    this.validate(value);
    this._value = value;
  }

  public static create(value: BillingCycle = "MENSAL"): BillingPeriod {
    return new BillingPeriod(value);
  }

  public static restore(value: BillingCycle): BillingPeriod {
    return new BillingPeriod(value);
  }

  private validate(value: BillingCycle): void {
    if (!BILLING_CYCLES.includes(value)) {
      throw new Error(`Ciclo de cobrança inválido: ${value}`);
    }
  }

  public get value(): BillingCycle {
    return this._value;
  }

  public isWeekly(): boolean {
    return this._value === "SEMANAL";
  }

  public isMonthly(): boolean {
    return this._value === "MENSAL";
  }

  public isYearly(): boolean {
    return this._value === "ANUAL";
  }

  public toMonthlyAmount(amount: number): number {
    switch (this._value) {
      case "SEMANAL":
        return Math.round(((amount * 52) / 12) * 100) / 100;
      case "MENSAL":
        return amount;
      case "ANUAL":
        return Math.round((amount / 12) * 100) / 100;
      default:
        return amount;
    }
  }

  public toYearlyAmount(amount: number): number {
    switch (this._value) {
      case "SEMANAL":
        return Math.round(amount * 52 * 100) / 100;
      case "MENSAL":
        return Math.round(amount * 12 * 100) / 100;
      case "ANUAL":
        return amount;
      default:
        return amount;
    }
  }

  public equals(other: BillingPeriod): boolean {
    if (!other) return false;
    return this._value === other._value;
  }
}
