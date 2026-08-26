import { randomUUID } from "crypto";
import { SupportedCurrency } from "./user.entity";
import { Price } from "../value-objects/price.vo";
import {
  BillingPeriod,
  BillingCycle,
} from "../value-objects/billing-period.vo";
import {
  SubscriptionStatus,
  SubscriptionStatusType,
} from "../value-objects/subscription-status.vo";
import { RenewalDate } from "../value-objects/renewal-date.vo";

export interface SubscriptionProps {
  id: string;
  userId: string;
  name: string;
  plan: string | null;
  category: string;
  paymentMethod: string | null;
  status: SubscriptionStatus;
  price: Price;
  billing: BillingPeriod;
  startDate: Date;
  renewalDate: RenewalDate;
  color: string | null;
  lucideIcon: string | null;
  brandLogoUri: string | null;
  brandHex: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionProps {
  id?: string;
  userId: string;
  name: string;
  plan?: string | null;
  category?: string;
  paymentMethod?: string | null;
  status?: SubscriptionStatus | SubscriptionStatusType;
  price: Price | number;
  currency?: SupportedCurrency;
  billing?: BillingPeriod | BillingCycle;
  startDate?: Date;
  renewalDate: RenewalDate | Date | string;
  color?: string | null;
  lucideIcon?: string | null;
  brandLogoUri?: string | null;
  brandHex?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateSubscriptionProps {
  name?: string;
  plan?: string | null;
  category?: string;
  paymentMethod?: string | null;
  price?: Price | number;
  currency?: SupportedCurrency;
  billing?: BillingPeriod | BillingCycle;
  renewalDate?: RenewalDate | Date | string;
  color?: string | null;
  lucideIcon?: string | null;
  brandLogoUri?: string | null;
  brandHex?: string | null;
}

export class Subscription {
  private readonly _id: string;
  private readonly _userId: string;
  private _name: string;
  private _plan: string | null;
  private _category: string;
  private _paymentMethod: string | null;
  private _status: SubscriptionStatus;
  private _price: Price;
  private _billing: BillingPeriod;
  private _startDate: Date;
  private _renewalDate: RenewalDate;
  private _color: string | null;
  private _lucideIcon: string | null;
  private _brandLogoUri: string | null;
  private _brandHex: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: SubscriptionProps) {
    this.validate(props);
    this._id = props.id;
    this._userId = props.userId;
    this._name = props.name.trim();
    this._plan = props.plan !== undefined ? props.plan : "Padrão";
    this._category = props.category ? props.category.trim() : "Outros";
    this._paymentMethod =
      props.paymentMethod !== undefined ? props.paymentMethod : "Não informado";
    this._status = props.status;
    this._price = props.price;
    this._billing = props.billing;
    this._startDate = props.startDate;
    this._renewalDate = props.renewalDate;
    this._color = props.color ?? null;
    this._lucideIcon = props.lucideIcon ?? null;
    this._brandLogoUri = props.brandLogoUri ?? null;
    this._brandHex = props.brandHex ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(props: CreateSubscriptionProps): Subscription {
    const id = props.id ?? randomUUID();
    const status =
      props.status instanceof SubscriptionStatus
        ? props.status
        : SubscriptionStatus.create(props.status ?? "ATIVO");

    const price =
      props.price instanceof Price
        ? props.price
        : Price.create(props.price, props.currency ?? "BRL");

    const billing =
      props.billing instanceof BillingPeriod
        ? props.billing
        : BillingPeriod.create(props.billing ?? "MENSAL");

    const renewalDate =
      props.renewalDate instanceof RenewalDate
        ? props.renewalDate
        : RenewalDate.create(props.renewalDate);

    const now = new Date();

    return new Subscription({
      id,
      userId: props.userId,
      name: props.name,
      plan: props.plan !== undefined ? props.plan : "Padrão",
      category: props.category ?? "Outros",
      paymentMethod:
        props.paymentMethod !== undefined
          ? props.paymentMethod
          : "Não informado",
      status,
      price,
      billing,
      startDate: props.startDate ?? now,
      renewalDate,
      color: props.color ?? null,
      lucideIcon: props.lucideIcon ?? null,
      brandLogoUri: props.brandLogoUri ?? null,
      brandHex: props.brandHex ?? null,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }

  public static restore(props: SubscriptionProps): Subscription {
    return new Subscription(props);
  }

  private validate(props: SubscriptionProps): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error("O ID da assinatura não pode ser vazio.");
    }
    if (!props.userId || props.userId.trim().length === 0) {
      throw new Error("O ID do usuário não pode ser vazio.");
    }
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("O nome da assinatura não pode ser vazio.");
    }
  }

  public get id(): string {
    return this._id;
  }

  public get userId(): string {
    return this._userId;
  }

  public get name(): string {
    return this._name;
  }

  public get plan(): string | null {
    return this._plan;
  }

  public get category(): string {
    return this._category;
  }

  public get paymentMethod(): string | null {
    return this._paymentMethod;
  }

  public get status(): SubscriptionStatus {
    return this._status;
  }

  public get price(): Price {
    return this._price;
  }

  public get billing(): BillingPeriod {
    return this._billing;
  }

  public get startDate(): Date {
    return this._startDate;
  }

  public get renewalDate(): RenewalDate {
    return this._renewalDate;
  }

  public get color(): string | null {
    return this._color;
  }

  public get lucideIcon(): string | null {
    return this._lucideIcon;
  }

  public get brandLogoUri(): string | null {
    return this._brandLogoUri;
  }

  public get brandHex(): string | null {
    return this._brandHex;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public update(props: UpdateSubscriptionProps): void {
    if (props.name !== undefined) {
      if (!props.name || props.name.trim().length === 0) {
        throw new Error("O nome da assinatura não pode ser vazio.");
      }
      this._name = props.name.trim();
    }
    if (props.plan !== undefined) {
      this._plan = props.plan;
    }
    if (props.category !== undefined) {
      this._category = props.category.trim();
    }
    if (props.paymentMethod !== undefined) {
      this._paymentMethod = props.paymentMethod;
    }
    if (props.price !== undefined) {
      this._price =
        props.price instanceof Price
          ? props.price
          : Price.create(props.price, props.currency ?? this._price.currency);
    }
    if (props.billing !== undefined) {
      this._billing =
        props.billing instanceof BillingPeriod
          ? props.billing
          : BillingPeriod.create(props.billing);
    }
    if (props.renewalDate !== undefined) {
      this._renewalDate =
        props.renewalDate instanceof RenewalDate
          ? props.renewalDate
          : RenewalDate.create(props.renewalDate);
    }
    if (props.color !== undefined) {
      this._color = props.color;
    }
    if (props.lucideIcon !== undefined) {
      this._lucideIcon = props.lucideIcon;
    }
    if (props.brandLogoUri !== undefined) {
      this._brandLogoUri = props.brandLogoUri;
    }
    if (props.brandHex !== undefined) {
      this._brandHex = props.brandHex;
    }
    this._updatedAt = new Date();
  }

  public pause(): void {
    this._status = this._status.pause();
    this._updatedAt = new Date();
  }

  public resume(): void {
    this._status = this._status.resume();
    this._updatedAt = new Date();
  }

  public cancel(): void {
    this._status = this._status.cancel();
    this._updatedAt = new Date();
  }

  public renew(): void {
    this._renewalDate = this._renewalDate.nextCycle(this._billing);
    this._updatedAt = new Date();
  }
}
