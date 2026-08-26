import { Inject, Injectable } from "@nestjs/common";
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from "@domain/repositories/subscription.repository.interface";
import { SubscriptionNotFoundException } from "@domain/errors/subscription-not-found.exception";

export interface DeleteSubscriptionInput {
  id: string;
  userId?: string;
}

@Injectable()
export class DeleteSubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(input: DeleteSubscriptionInput): Promise<void> {
    const subscription = await this.subscriptionRepository.findById(
      input.id,
      input.userId,
    );

    if (!subscription) {
      throw new SubscriptionNotFoundException(input.id);
    }

    await this.subscriptionRepository.delete(input.id, input.userId);
  }
}
