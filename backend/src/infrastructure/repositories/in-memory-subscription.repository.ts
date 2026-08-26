import {
  ISubscriptionRepository,
  SubscriptionFilters,
} from "../../domain/repositories/subscription.repository.interface";
import { Subscription } from "../../domain/entities/subscription.entity";

export class InMemorySubscriptionRepository implements ISubscriptionRepository {
  public items: Subscription[] = [];

  async create(subscription: Subscription): Promise<void> {
    this.items.push(subscription);
  }

  async findById(id: string, userId?: string): Promise<Subscription | null> {
    const item = this.items.find(
      (sub) => sub.id === id && (!userId || sub.userId === userId),
    );
    return item ?? null;
  }

  async findByUserId(
    userId: string,
    filters?: SubscriptionFilters,
  ): Promise<Subscription[]> {
    return this.items.filter((sub) => {
      if (sub.userId !== userId) return false;

      if (filters?.status && sub.status.value !== filters.status) {
        return false;
      }

      if (
        filters?.category &&
        sub.category.toLowerCase() !== filters.category.toLowerCase()
      ) {
        return false;
      }

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = sub.name.toLowerCase().includes(searchLower);
        const matchesPlan =
          sub.plan?.toLowerCase().includes(searchLower) ?? false;
        if (!matchesName && !matchesPlan) {
          return false;
        }
      }

      return true;
    });
  }

  async update(subscription: Subscription): Promise<void> {
    const index = this.items.findIndex((sub) => sub.id === subscription.id);
    if (index >= 0) {
      this.items[index] = subscription;
    }
  }

  async delete(id: string, userId?: string): Promise<void> {
    this.items = this.items.filter(
      (sub) => !(sub.id === id && (!userId || sub.userId === userId)),
    );
  }
}
