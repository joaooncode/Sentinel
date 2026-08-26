import { Subscription } from "./subscription.entity";
import { Price } from "../value-objects/price.vo";
import { BillingPeriod } from "../value-objects/billing-period.vo";
import { RenewalDate } from "../value-objects/renewal-date.vo";
import { InvalidSubscriptionOperationException } from "../errors/invalid-subscription-operation.exception";

describe("Subscription Domain Entity", () => {
  const validRenewalDate = new Date("2026-09-01T00:00:00.000Z");

  it("should create a valid Subscription with default values", () => {
    const subscription = Subscription.create({
      userId: "user_123",
      name: "Netflix",
      price: Price.create(55.9, "BRL"),
      renewalDate: RenewalDate.create(validRenewalDate),
    });

    expect(subscription.id).toBeDefined();
    expect(subscription.userId).toBe("user_123");
    expect(subscription.name).toBe("Netflix");
    expect(subscription.plan).toBe("Padrão");
    expect(subscription.category).toBe("Outros");
    expect(subscription.paymentMethod).toBe("Não informado");
    expect(subscription.status.value).toBe("ATIVO");
    expect(subscription.price.amount).toBe(55.9);
    expect(subscription.billing.value).toBe("MENSAL");
    expect(subscription.renewalDate.value.getTime()).toBe(
      validRenewalDate.getTime(),
    );
    expect(subscription.createdAt).toBeInstanceOf(Date);
    expect(subscription.updatedAt).toBeInstanceOf(Date);
  });

  it("should create subscription allowing primitive values for VOs in create()", () => {
    const subscription = Subscription.create({
      userId: "user_123",
      name: "Spotify",
      plan: "Família",
      category: "Música",
      paymentMethod: "Cartão Nubank",
      price: 34.9,
      currency: "BRL",
      billing: "MENSAL",
      renewalDate: "2026-09-15T00:00:00.000Z",
      color: "#1DB954",
      lucideIcon: "music",
      brandLogoUri: "https://logo.com/spotify.png",
      brandHex: "#1DB954",
    });

    expect(subscription.name).toBe("Spotify");
    expect(subscription.plan).toBe("Família");
    expect(subscription.category).toBe("Música");
    expect(subscription.price.amount).toBe(34.9);
    expect(subscription.price.currency).toBe("BRL");
    expect(subscription.color).toBe("#1DB954");
    expect(subscription.brandHex).toBe("#1DB954");
  });

  it("should throw error if name is empty", () => {
    expect(() =>
      Subscription.create({
        userId: "user_123",
        name: "",
        price: 10,
        renewalDate: validRenewalDate,
      }),
    ).toThrow("O nome da assinatura não pode ser vazio.");
  });

  it("should throw error if userId is empty", () => {
    expect(() =>
      Subscription.create({
        userId: "",
        name: "Netflix",
        price: 10,
        renewalDate: validRenewalDate,
      }),
    ).toThrow("O ID do usuário não pode ser vazio.");
  });

  it("should update subscription details", () => {
    const subscription = Subscription.create({
      userId: "user_123",
      name: "Netflix",
      price: 39.9,
      renewalDate: validRenewalDate,
    });

    const oldUpdatedAt = subscription.updatedAt;

    subscription.update({
      name: "Netflix 4K",
      plan: "Premium Ultra HD",
      category: "Streaming",
      price: Price.create(59.9, "BRL"),
      billing: BillingPeriod.create("MENSAL"),
    });

    expect(subscription.name).toBe("Netflix 4K");
    expect(subscription.plan).toBe("Premium Ultra HD");
    expect(subscription.category).toBe("Streaming");
    expect(subscription.price.amount).toBe(59.9);
    expect(subscription.updatedAt.getTime()).toBeGreaterThanOrEqual(
      oldUpdatedAt.getTime(),
    );
  });

  describe("Lifecycle transitions", () => {
    it("should pause an active subscription", () => {
      const sub = Subscription.create({
        userId: "user_123",
        name: "Academia",
        price: 120,
        renewalDate: validRenewalDate,
      });

      sub.pause();
      expect(sub.status.isPaused()).toBe(true);
    });

    it("should resume a paused subscription", () => {
      const sub = Subscription.create({
        userId: "user_123",
        name: "Academia",
        price: 120,
        renewalDate: validRenewalDate,
      });

      sub.pause();
      sub.resume();
      expect(sub.status.isActive()).toBe(true);
    });

    it("should cancel an active or paused subscription", () => {
      const sub = Subscription.create({
        userId: "user_123",
        name: "Academia",
        price: 120,
        renewalDate: validRenewalDate,
      });

      sub.cancel();
      expect(sub.status.isCanceled()).toBe(true);
    });

    it("should throw error when pausing a canceled subscription", () => {
      const sub = Subscription.create({
        userId: "user_123",
        name: "Academia",
        price: 120,
        renewalDate: validRenewalDate,
      });

      sub.cancel();
      expect(() => sub.pause()).toThrow(InvalidSubscriptionOperationException);
    });
  });

  describe("Renewal advancement", () => {
    it("should advance renewal date to the next cycle on renew()", () => {
      const sub = Subscription.create({
        userId: "user_123",
        name: "Netflix",
        price: 55.9,
        billing: "MENSAL",
        renewalDate: new Date("2026-08-26T00:00:00.000Z"),
      });

      sub.renew();
      expect(sub.renewalDate.value.toISOString()).toBe(
        "2026-09-26T00:00:00.000Z",
      );
    });
  });
});
