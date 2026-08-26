import { randomUUID } from "crypto";
import { SupportedCurrency, SUPPORTED_CURRENCIES } from "./user.entity";

export interface BillingHistoryProps {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: SupportedCurrency;
  paidAt: Date;
  status: string;
  notes: string | null;
  createdAt: Date;
}

export interface CreateBillingHistoryProps {
  id?: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency?: SupportedCurrency;
  paidAt?: Date;
  status?: string;
  notes?: string | null;
  createdAt?: Date;
}

export class BillingHistory {
  private readonly _id: string;
  private readonly _userId: string;
  private readonly _subscriptionId: string;
  private readonly _amount: number;
  private readonly _currency: SupportedCurrency;
  private readonly _paidAt: Date;
  private readonly _status: string;
  private readonly _notes: string | null;
  private readonly _createdAt: Date;

  private constructor(props: BillingHistoryProps) {
    this.validate(props);
    this._id = props.id;
    this._userId = props.userId.trim();
    this._subscriptionId = props.subscriptionId.trim();
    this._amount = Math.round(props.amount * 100) / 100;
    this._currency = props.currency;
    this._paidAt = props.paidAt;
    this._status = props.status;
    this._notes = props.notes ?? null;
    this._createdAt = props.createdAt;
  }

  public static create(props: CreateBillingHistoryProps): BillingHistory {
    const id = props.id ?? randomUUID();
    const now = new Date();
    const currency = props.currency ?? "BRL";
    const status = props.status ?? "pago";

    return new BillingHistory({
      id,
      userId: props.userId,
      subscriptionId: props.subscriptionId,
      amount: props.amount,
      currency,
      paidAt: props.paidAt ?? now,
      status,
      notes: props.notes ?? null,
      createdAt: props.createdAt ?? now,
    });
  }

  public static restore(props: BillingHistoryProps): BillingHistory {
    return new BillingHistory(props);
  }

  private validate(props: BillingHistoryProps): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error("O ID do histórico de cobrança não pode ser vazio.");
    }
    if (!props.userId || props.userId.trim().length === 0) {
      throw new Error("O ID do usuário não pode ser vazio.");
    }
    if (!props.subscriptionId || props.subscriptionId.trim().length === 0) {
      throw new Error("O ID da assinatura não pode ser vazio.");
    }
    if (
      typeof props.amount !== "number" ||
      isNaN(props.amount) ||
      !isFinite(props.amount)
    ) {
      throw new Error("O valor da fatura é inválido.");
    }
    if (props.amount < 0) {
      throw new Error("O valor da fatura não pode ser negativo.");
    }
    if (!SUPPORTED_CURRENCIES.includes(props.currency)) {
      throw new Error(`Moeda não suportada: ${props.currency}`);
    }
  }

  public get id(): string {
    return this._id;
  }

  public get userId(): string {
    return this._userId;
  }

  public get subscriptionId(): string {
    return this._subscriptionId;
  }

  public get amount(): number {
    return this._amount;
  }

  public get currency(): SupportedCurrency {
    return this._currency;
  }

  public get paidAt(): Date {
    return this._paidAt;
  }

  public get status(): string {
    return this._status;
  }

  public get notes(): string | null {
    return this._notes;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }
}
