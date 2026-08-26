import { IBillingHistoryRepository } from "../../domain/repositories/billing-history.repository.interface";
import { BillingHistory } from "../../domain/entities/billing-history.entity";

export class InMemoryBillingHistoryRepository implements IBillingHistoryRepository {
  public items: BillingHistory[] = [];

  async create(billingHistory: BillingHistory): Promise<void> {
    this.items.push(billingHistory);
  }

  async findByUserId(userId: string): Promise<BillingHistory[]> {
    return this.items.filter((item) => item.userId === userId);
  }

  async findBySubscriptionId(
    subscriptionId: string,
    userId?: string,
  ): Promise<BillingHistory[]> {
    return this.items.filter((item) => {
      if (item.subscriptionId !== subscriptionId) return false;
      if (userId && item.userId !== userId) return false;
      return true;
    });
  }
}
