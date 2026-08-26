import { Price } from "./price.vo";

describe("Price Value Object", () => {
  it("should create a valid Price with default currency (BRL)", () => {
    const price = Price.create(49.9);
    expect(price.amount).toBe(49.9);
    expect(price.currency).toBe("BRL");
    expect(price.formatted()).toBe("R$ 49,90");
  });

  it("should create a valid Price with USD currency", () => {
    const price = Price.create(15, "USD");
    expect(price.amount).toBe(15);
    expect(price.currency).toBe("USD");
    expect(price.formatted()).toBe("$15.00");
  });

  it("should create a valid Price with EUR currency", () => {
    const price = Price.create(12.5, "EUR");
    expect(price.amount).toBe(12.5);
    expect(price.currency).toBe("EUR");
    expect(price.formatted()).toBe("€12.50");
  });

  it("should allow zero amount (e.g. free trial / tier)", () => {
    const price = Price.create(0);
    expect(price.amount).toBe(0);
    expect(price.isFree()).toBe(true);
  });

  it("should throw error if amount is negative", () => {
    expect(() => Price.create(-10)).toThrow(
      "O valor da assinatura não pode ser negativo.",
    );
  });

  it("should throw error if amount is NaN or infinite", () => {
    expect(() => Price.create(NaN)).toThrow("O valor da assinatura é inválido.");
    expect(() => Price.create(Infinity)).toThrow("O valor da assinatura é inválido.");
  });

  it("should throw error if currency is unsupported", () => {
    expect(() => Price.create(50, "GBP" as any)).toThrow(
      "Moeda não suportada: GBP",
    );
  });

  it("should correctly compare equality between two Price instances", () => {
    const price1 = Price.create(35.5, "BRL");
    const price2 = Price.create(35.5, "BRL");
    const price3 = Price.create(35.5, "USD");
    const price4 = Price.create(40, "BRL");

    expect(price1.equals(price2)).toBe(true);
    expect(price1.equals(price3)).toBe(false);
    expect(price1.equals(price4)).toBe(false);
  });
});
