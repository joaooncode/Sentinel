import { SupportedCurrency, SUPPORTED_CURRENCIES } from "../entities/user.entity";

export class Price {
  private readonly _amount: number;
  private readonly _currency: SupportedCurrency;

  private constructor(amount: number, currency: SupportedCurrency = "BRL") {
    this.validate(amount, currency);
    this._amount = Math.round(amount * 100) / 100;
    this._currency = currency;
  }

  public static create(
    amount: number,
    currency: SupportedCurrency = "BRL",
  ): Price {
    return new Price(amount, currency);
  }

  public static restore(
    amount: number,
    currency: SupportedCurrency = "BRL",
  ): Price {
    return new Price(amount, currency);
  }

  private validate(amount: number, currency: SupportedCurrency): void {
    if (typeof amount !== "number" || isNaN(amount) || !isFinite(amount)) {
      throw new Error("O valor da assinatura é inválido.");
    }
    if (amount < 0) {
      throw new Error("O valor da assinatura não pode ser negativo.");
    }
    if (!SUPPORTED_CURRENCIES.includes(currency)) {
      throw new Error(`Moeda não suportada: ${currency}`);
    }
  }

  public get amount(): number {
    return this._amount;
  }

  public get currency(): SupportedCurrency {
    return this._currency;
  }

  public isFree(): boolean {
    return this._amount === 0;
  }

  public formatted(): string {
    switch (this._currency) {
      case "BRL":
        return `R$ ${this._amount.toFixed(2).replace(".", ",")}`;
      case "USD":
        return `$${this._amount.toFixed(2)}`;
      case "EUR":
        return `€${this._amount.toFixed(2)}`;
      default:
        return `${this._currency} ${this._amount.toFixed(2)}`;
    }
  }

  public equals(other: Price): boolean {
    if (!other) return false;
    return this._amount === other._amount && this._currency === other._currency;
  }
}
