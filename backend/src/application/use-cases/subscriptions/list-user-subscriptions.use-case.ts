import { Inject, Injectable } from "@nestjs/common";
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
  SubscriptionFilters,
} from "@domain/repositories/subscription.repository.interface";
import {
  SubscriptionOutput,
  toSubscriptionOutput,
} from "./subscription.output";

export interface ListUserSubscriptionsInput {
  userId: string;
  filters?: SubscriptionFilters;
}

@Injectable()
export class ListUserSubscriptionsUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(
    input: ListUserSubscriptionsInput,
  ): Promise<SubscriptionOutput[]> {
    const subscriptions = await this.subscriptionRepository.findByUserId(
      input.userId,
      input.filters,
    );

    const now = new Date();
    return subscriptions.map((sub) => toSubscriptionOutput(sub, now));
  }
}
