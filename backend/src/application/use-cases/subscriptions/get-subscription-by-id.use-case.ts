import { Inject, Injectable } from "@nestjs/common";
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from "@domain/repositories/subscription.repository.interface";
import { SubscriptionNotFoundException } from "@domain/errors/subscription-not-found.exception";
import {
  SubscriptionOutput,
  toSubscriptionOutput,
} from "./subscription.output";

export interface GetSubscriptionByIdInput {
  id: string;
  userId?: string;
}

@Injectable()
export class GetSubscriptionByIdUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(input: GetSubscriptionByIdInput): Promise<SubscriptionOutput> {
    const subscription = await this.subscriptionRepository.findById(
      input.id,
      input.userId,
    );

    if (!subscription) {
      throw new SubscriptionNotFoundException(input.id);
    }

    return toSubscriptionOutput(subscription);
  }
}
