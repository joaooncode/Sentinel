import { SubscriptionStatus } from "./subscription-status.vo";
import { InvalidSubscriptionOperationException } from "../errors/invalid-subscription-operation.exception";

describe("SubscriptionStatus Value Object", () => {
  it("should create a valid SubscriptionStatus with default ATIVO", () => {
    const status = SubscriptionStatus.create();
    expect(status.value).toBe("ATIVO");
    expect(status.isActive()).toBe(true);
    expect(status.isPaused()).toBe(false);
    expect(status.isCanceled()).toBe(false);
  });

  it("should create with explicit status", () => {
    const status = SubscriptionStatus.create("PAUSADO");
    expect(status.value).toBe("PAUSADO");
    expect(status.isPaused()).toBe(true);
  });

  it("should throw error on invalid status", () => {
    expect(() =>
      SubscriptionStatus.create("INVALIDO" as unknown as "ATIVO"),
    ).toThrow("Status de assinatura inválido: INVALIDO");
  });

  describe("State transitions from ATIVO", () => {
    const active = SubscriptionStatus.create("ATIVO");

    it("should allow pausing", () => {
      const paused = active.pause();
      expect(paused.value).toBe("PAUSADO");
      expect(paused.isPaused()).toBe(true);
    });

    it("should allow canceling", () => {
      const canceled = active.cancel();
      expect(canceled.value).toBe("CANCELADO");
      expect(canceled.isCanceled()).toBe(true);
    });

    it("should reject resuming when already active", () => {
      expect(() => active.resume()).toThrow(
        InvalidSubscriptionOperationException,
      );
    });
  });

  describe("State transitions from PAUSADO", () => {
    const paused = SubscriptionStatus.create("PAUSADO");

    it("should allow resuming to ATIVO", () => {
      const active = paused.resume();
      expect(active.value).toBe("ATIVO");
      expect(active.isActive()).toBe(true);
    });

    it("should allow canceling", () => {
      const canceled = paused.cancel();
      expect(canceled.value).toBe("CANCELADO");
      expect(canceled.isCanceled()).toBe(true);
    });

    it("should reject pausing when already paused", () => {
      expect(() => paused.pause()).toThrow(
        InvalidSubscriptionOperationException,
      );
    });
  });

  describe("State transitions from CANCELADO", () => {
    const canceled = SubscriptionStatus.create("CANCELADO");

    it("should reject pausing", () => {
      expect(() => canceled.pause()).toThrow(
        InvalidSubscriptionOperationException,
      );
    });

    it("should reject resuming", () => {
      expect(() => canceled.resume()).toThrow(
        InvalidSubscriptionOperationException,
      );
    });

    it("should reject canceling when already canceled", () => {
      expect(() => canceled.cancel()).toThrow(
        InvalidSubscriptionOperationException,
      );
    });
  });

  it("should check equality", () => {
    const s1 = SubscriptionStatus.create("ATIVO");
    const s2 = SubscriptionStatus.create("ATIVO");
    const s3 = SubscriptionStatus.create("PAUSADO");

    expect(s1.equals(s2)).toBe(true);
    expect(s1.equals(s3)).toBe(false);
  });
});
