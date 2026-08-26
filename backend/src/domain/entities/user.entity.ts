export const SUPPORTED_CURRENCIES = ["BRL", "USD", "EUR"] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export interface UserProps {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  currency?: SupportedCurrency;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private readonly _id: string;
  private _email: string;
  private _name: string | null;
  private _avatarUrl: string | null;
  private _currency: SupportedCurrency;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    this.validate(props);
    this._id = props.id;
    this._email = props.email.toLowerCase().trim();
    this._name = props.name ?? null;
    this._avatarUrl = props.avatarUrl ?? null;
    this._currency = props.currency ?? "BRL";
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  public static create(
    props: Omit<UserProps, "createdAt" | "updatedAt">,
  ): User {
    return new User(props);
  }

  public static restore(props: UserProps): User {
    return new User(props);
  }

  private validate(props: UserProps): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error("User ID não pode ser vazio.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!props.email || !emailRegex.test(props.email)) {
      throw new Error("Email inválido.");
    }
    if (props.currency && !SUPPORTED_CURRENCIES.includes(props.currency)) {
      throw new Error(`Moeda não suportada: ${props.currency}`);
    }
  }

  public get id(): string {
    return this._id;
  }

  public get email(): string {
    return this._email;
  }

  public get name(): string | null {
    return this._name;
  }

  public get avatarUrl(): string | null {
    return this._avatarUrl;
  }

  public get currency(): SupportedCurrency {
    return this._currency;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public updateProfile(props: {
    name?: string | null;
    avatarUrl?: string | null;
  }): void {
    if (props.name !== undefined) this._name = props.name;
    if (props.avatarUrl !== undefined) this._avatarUrl = props.avatarUrl;
    this._updatedAt = new Date();
  }

  public updateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error("Email inválido.");
    }
    this._email = email.toLowerCase().trim();
    this._updatedAt = new Date();
  }

  public updateCurrency(currency: string): void {
    if (!SUPPORTED_CURRENCIES.includes(currency as SupportedCurrency)) {
      throw new Error(`Moeda não suportada: ${currency}`);
    }
    this._currency = currency as SupportedCurrency;
    this._updatedAt = new Date();
  }
}
