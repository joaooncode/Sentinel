import {
  BillingHistory as PrismaBillingHistoryModel,
  Prisma,
} from "@prisma/client";
import { BillingHistory } from "../../domain/entities/billing-history.entity";
import { SupportedCurrency } from "../../domain/entities/user.entity";

export class BillingHistoryMapper {
  public static toDomain(raw: PrismaBillingHistoryModel): BillingHistory {
    return BillingHistory.restore({
      id: raw.id,
      userId: raw.userId,
      subscriptionId: raw.subscriptionId,
      amount: Number(raw.amount),
      currency: raw.currency as SupportedCurrency,
      paidAt: raw.paidAt,
      status: raw.status,
      notes: raw.notes,
      createdAt: raw.createdAt,
    });
  }

  public static toPersistence(
    billingHistory: BillingHistory,
  ): Prisma.BillingHistoryUncheckedCreateInput {
    return {
      id: billingHistory.id,
      userId: billingHistory.userId,
      subscriptionId: billingHistory.subscriptionId,
      amount: new Prisma.Decimal(billingHistory.amount),
      currency: billingHistory.currency,
      paidAt: billingHistory.paidAt,
      status: billingHistory.status,
      notes: billingHistory.notes,
      createdAt: billingHistory.createdAt,
    };
  }
}
