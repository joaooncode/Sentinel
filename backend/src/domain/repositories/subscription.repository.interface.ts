import { Subscription } from "../entities/subscription.entity";

export const SUBSCRIPTION_REPOSITORY = Symbol("ISubscriptionRepository");

export interface SubscriptionFilters {
  status?: string;
  category?: string;
  search?: string;
}

export interface ISubscriptionRepository {
  create(subscription: Subscription): Promise<void>;
  findById(id: string, userId?: string): Promise<Subscription | null>;
  findByUserId(
    userId: string,
    filters?: SubscriptionFilters,
  ): Promise<Subscription[]>;
  update(subscription: Subscription): Promise<void>;
  delete(id: string, userId?: string): Promise<void>;
}
