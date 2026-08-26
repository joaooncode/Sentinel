import { BillingPeriod, BillingCycle } from "./billing-period.vo";

export class RenewalDate {
  private readonly _value: Date;

  private constructor(value: Date | string) {
    this._value = this.validateAndParse(value);
  }

  public static create(value: Date | string): RenewalDate {
    return new RenewalDate(value);
  }

  public static restore(value: Date | string): RenewalDate {
    return new RenewalDate(value);
  }

  private validateAndParse(value: Date | string): Date {
    const parsed = value instanceof Date ? value : new Date(value);
    if (isNaN(parsed.getTime())) {
      throw new Error("Data de renovação inválida.");
    }
    return parsed;
  }

  public get value(): Date {
    return new Date(this._value.getTime());
  }

  public daysUntilRenewal(now: Date = new Date()): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    const utcRenewal = Date.UTC(
      this._value.getUTCFullYear(),
      this._value.getUTCMonth(),
      this._value.getUTCDate(),
    );
    const utcNow = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
    );
    return Math.round((utcRenewal - utcNow) / msPerDay);
  }

  public isOverdue(now: Date = new Date()): boolean {
    return this.daysUntilRenewal(now) < 0;
  }

  public nextCycle(billingPeriod: BillingPeriod | BillingCycle): RenewalDate {
    const cycle =
      billingPeriod instanceof BillingPeriod
        ? billingPeriod.value
        : billingPeriod;

    const nextDate = new Date(this._value.getTime());
    switch (cycle) {
      case "SEMANAL":
        nextDate.setUTCDate(nextDate.getUTCDate() + 7);
        break;
      case "MENSAL":
        nextDate.setUTCMonth(nextDate.getUTCMonth() + 1);
        break;
      case "ANUAL":
        nextDate.setUTCFullYear(nextDate.getUTCFullYear() + 1);
        break;
      default:
        throw new Error(`Ciclo de cobrança inválido: ${cycle}`);
    }

    return new RenewalDate(nextDate);
  }

  public toISOString(): string {
    return this._value.toISOString();
  }

  public equals(other: RenewalDate): boolean {
    if (!other) return false;
    return this._value.getTime() === other._value.getTime();
  }
}
