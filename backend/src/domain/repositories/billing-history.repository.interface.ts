import { BillingHistory } from "../entities/billing-history.entity";

export const BILLING_HISTORY_REPOSITORY = Symbol("IBillingHistoryRepository");

export interface IBillingHistoryRepository {
  create(billingHistory: BillingHistory): Promise<void>;
  findByUserId(userId: string): Promise<BillingHistory[]>;
  findBySubscriptionId(
    subscriptionId: string,
    userId?: string,
  ): Promise<BillingHistory[]>;
}
