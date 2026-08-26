import { BillingHistory } from "./billing-history.entity";

describe("BillingHistory Entity", () => {
  it("should create a valid BillingHistory instance with default values", () => {
    const history = BillingHistory.create({
      userId: "user_123",
      subscriptionId: "sub_456",
      amount: 49.9,
    });

    expect(history.id).toBeDefined();
    expect(history.userId).toBe("user_123");
    expect(history.subscriptionId).toBe("sub_456");
    expect(history.amount).toBe(49.9);
    expect(history.currency).toBe("BRL");
    expect(history.status).toBe("pago");
    expect(history.notes).toBeNull();
    expect(history.paidAt).toBeInstanceOf(Date);
    expect(history.createdAt).toBeInstanceOf(Date);
  });

  it("should create a BillingHistory instance with custom props", () => {
    const paidAt = new Date("2026-01-15T10:00:00Z");
    const history = BillingHistory.create({
      id: "hist_custom_1",
      userId: "user_123",
      subscriptionId: "sub_456",
      amount: 19.99,
      currency: "USD",
      paidAt,
      status: "falhou",
      notes: "Cartão expirado",
    });

    expect(history.id).toBe("hist_custom_1");
    expect(history.userId).toBe("user_123");
    expect(history.subscriptionId).toBe("sub_456");
    expect(history.amount).toBe(19.99);
    expect(history.currency).toBe("USD");
    expect(history.status).toBe("falhou");
    expect(history.notes).toBe("Cartão expirado");
    expect(history.paidAt).toEqual(paidAt);
  });

  it("should restore a BillingHistory instance correctly", () => {
    const paidAt = new Date("2026-02-01T12:00:00Z");
    const createdAt = new Date("2026-02-01T12:00:00Z");

    const history = BillingHistory.restore({
      id: "hist_restored_1",
      userId: "user_123",
      subscriptionId: "sub_456",
      amount: 99.9,
      currency: "EUR",
      paidAt,
      status: "pago",
      notes: "Nota fiscal #1234",
      createdAt,
    });

    expect(history.id).toBe("hist_restored_1");
    expect(history.userId).toBe("user_123");
    expect(history.subscriptionId).toBe("sub_456");
    expect(history.amount).toBe(99.9);
    expect(history.currency).toBe("EUR");
    expect(history.paidAt).toEqual(paidAt);
    expect(history.status).toBe("pago");
    expect(history.notes).toBe("Nota fiscal #1234");
    expect(history.createdAt).toEqual(createdAt);
  });

  it("should round amount to 2 decimal places", () => {
    const history = BillingHistory.create({
      userId: "user_123",
      subscriptionId: "sub_456",
      amount: 29.999,
    });

    expect(history.amount).toBe(30);
  });

  it("should throw an error when userId is empty", () => {
    expect(() => {
      BillingHistory.create({
        userId: "   ",
        subscriptionId: "sub_456",
        amount: 20,
      });
    }).toThrow("O ID do usuário não pode ser vazio.");
  });

  it("should throw an error when subscriptionId is empty", () => {
    expect(() => {
      BillingHistory.create({
        userId: "user_123",
        subscriptionId: "",
        amount: 20,
      });
    }).toThrow("O ID da assinatura não pode ser vazio.");
  });

  it("should throw an error when amount is invalid or negative", () => {
    expect(() => {
      BillingHistory.create({
        userId: "user_123",
        subscriptionId: "sub_456",
        amount: -10,
      });
    }).toThrow("O valor da fatura não pode ser negativo.");

    expect(() => {
      BillingHistory.create({
        userId: "user_123",
        subscriptionId: "sub_456",
        amount: NaN,
      });
    }).toThrow("O valor da fatura é inválido.");
  });

  it("should throw an error when currency is unsupported", () => {
    expect(() => {
      BillingHistory.create({
        userId: "user_123",
        subscriptionId: "sub_456",
        amount: 50,
        currency: "GBP" as never,
      });
    }).toThrow("Moeda não suportada: GBP");
  });
});
