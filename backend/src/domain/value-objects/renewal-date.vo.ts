import * as dayjsImport from "dayjs";
const dayjs = (dayjsImport as any).default || dayjsImport;
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
    const startOfRenewal = dayjs(this._value).startOf("day");
    const startOfNow = dayjs(now).startOf("day");
    return startOfRenewal.diff(startOfNow, "day");
  }

  public isOverdue(now: Date = new Date()): boolean {
    return this.daysUntilRenewal(now) < 0;
  }

  public nextCycle(billingPeriod: BillingPeriod | BillingCycle): RenewalDate {
    const cycle =
      billingPeriod instanceof BillingPeriod
        ? billingPeriod.value
        : billingPeriod;

    let nextDate: Date;
    switch (cycle) {
      case "SEMANAL":
        nextDate = dayjs(this._value).add(1, "week").toDate();
        break;
      case "MENSAL":
        nextDate = dayjs(this._value).add(1, "month").toDate();
        break;
      case "ANUAL":
        nextDate = dayjs(this._value).add(1, "year").toDate();
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
