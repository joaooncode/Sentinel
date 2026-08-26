import { InvalidSubscriptionOperationException } from "../errors/invalid-subscription-operation.exception";

export const SUBSCRIPTION_STATUSES = ["ATIVO", "PAUSADO", "CANCELADO"] as const;
export type SubscriptionStatusType = (typeof SUBSCRIPTION_STATUSES)[number];

export class SubscriptionStatus {
  private readonly _value: SubscriptionStatusType;

  private constructor(value: SubscriptionStatusType) {
    this.validate(value);
    this._value = value;
  }

  public static create(
    value: SubscriptionStatusType = "ATIVO",
  ): SubscriptionStatus {
    return new SubscriptionStatus(value);
  }

  public static restore(value: SubscriptionStatusType): SubscriptionStatus {
    return new SubscriptionStatus(value);
  }

  private validate(value: SubscriptionStatusType): void {
    if (!SUBSCRIPTION_STATUSES.includes(value)) {
      throw new Error(`Status de assinatura inválido: ${value}`);
    }
  }

  public get value(): SubscriptionStatusType {
    return this._value;
  }

  public isActive(): boolean {
    return this._value === "ATIVO";
  }

  public isPaused(): boolean {
    return this._value === "PAUSADO";
  }

  public isCanceled(): boolean {
    return this._value === "CANCELADO";
  }

  public pause(): SubscriptionStatus {
    if (this._value === "PAUSADO") {
      throw new InvalidSubscriptionOperationException(
        "Assinatura já está pausada.",
      );
    }
    if (this._value === "CANCELADO") {
      throw new InvalidSubscriptionOperationException(
        "Não é possível pausar uma assinatura cancelada.",
      );
    }
    return new SubscriptionStatus("PAUSADO");
  }

  public resume(): SubscriptionStatus {
    if (this._value === "ATIVO") {
      throw new InvalidSubscriptionOperationException(
        "Assinatura já está ativa.",
      );
    }
    if (this._value === "CANCELADO") {
      throw new InvalidSubscriptionOperationException(
        "Não é possível reativar uma assinatura cancelada diretamente.",
      );
    }
    return new SubscriptionStatus("ATIVO");
  }

  public cancel(): SubscriptionStatus {
    if (this._value === "CANCELADO") {
      throw new InvalidSubscriptionOperationException(
        "Assinatura já está cancelada.",
      );
    }
    return new SubscriptionStatus("CANCELADO");
  }

  public equals(other: SubscriptionStatus): boolean {
    if (!other) return false;
    return this._value === other._value;
  }
}
