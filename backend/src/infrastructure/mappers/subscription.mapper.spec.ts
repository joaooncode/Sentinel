import { SubscriptionMapper } from "./subscription.mapper";
import { Subscription } from "../../domain/entities/subscription.entity";
import {
  Prisma,
  Subscription as PrismaSubscriptionModel,
} from "@prisma/client";

describe("SubscriptionMapper", () => {
  it("should map from Prisma model to Domain Entity", () => {
    const raw: PrismaSubscriptionModel = {
      id: "sub-123",
      userId: "user-456",
      name: "Netflix",
      plan: "Premium",
      category: "Streaming",
      paymentMethod: "Cartão",
      status: "ATIVO",
      price: new Prisma.Decimal(55.9),
      currency: "BRL",
      billing: "MENSAL",
      startDate: new Date("2026-01-01"),
      renewalDate: new Date("2026-09-01"),
      color: "#FF0000",
      lucideIcon: "tv",
      brandLogoUri: "https://logo.com/netflix.png",
      brandHex: "#E50914",
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };

    const domain = SubscriptionMapper.toDomain(raw);

    expect(domain.id).toBe("sub-123");
    expect(domain.userId).toBe("user-456");
    expect(domain.name).toBe("Netflix");
    expect(domain.price.amount).toBe(55.9);
    expect(domain.price.currency).toBe("BRL");
    expect(domain.billing.value).toBe("MENSAL");
    expect(domain.status.value).toBe("ATIVO");
  });

  it("should map from Domain Entity to Persistence Prisma input", () => {
    const domain = Subscription.create({
      id: "sub-123",
      userId: "user-456",
      name: "Spotify",
      price: 34.9,
      currency: "BRL",
      billing: "MENSAL",
      renewalDate: new Date("2026-09-10"),
    });

    const persistence = SubscriptionMapper.toPersistence(domain);

    expect(persistence.id).toBe("sub-123");
    expect(persistence.userId).toBe("user-456");
    expect(persistence.name).toBe("Spotify");
    expect(persistence.price).toEqual(new Prisma.Decimal(34.9));
    expect(persistence.currency).toBe("BRL");
    expect(persistence.billing).toBe("MENSAL");
    expect(persistence.status).toBe("ATIVO");
  });
});
