import { Inject, Injectable } from "@nestjs/common";
import {
  ISubscriptionRepository,
  SUBSCRIPTION_REPOSITORY,
} from "@domain/repositories/subscription.repository.interface";
import { SubscriptionNotFoundException } from "@domain/errors/subscription-not-found.exception";
import { InvalidSubscriptionOperationException } from "@domain/errors/invalid-subscription-operation.exception";
import { SubscriptionStatusType } from "@domain/value-objects/subscription-status.vo";
import {
  SubscriptionOutput,
  toSubscriptionOutput,
} from "./subscription.output";

export type SubscriptionStatusAction = "pause" | "resume" | "cancel";

export interface ChangeSubscriptionStatusInput {
  id: string;
  userId?: string;
  action?: SubscriptionStatusAction;
  status?: SubscriptionStatusType;
}

@Injectable()
export class ChangeSubscriptionStatusUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(
    input: ChangeSubscriptionStatusInput,
  ): Promise<SubscriptionOutput> {
    const subscription = await this.subscriptionRepository.findById(
      input.id,
      input.userId,
    );

    if (!subscription) {
      throw new SubscriptionNotFoundException(input.id);
    }

    const action = input.action ?? this.mapStatusToAction(input.status);

    switch (action) {
      case "pause":
        subscription.pause();
        break;
      case "resume":
        subscription.resume();
        break;
      case "cancel":
        subscription.cancel();
        break;
      default:
        throw new InvalidSubscriptionOperationException(
          `Ação de alteração de status inválida ou não informada.`,
        );
    }

    await this.subscriptionRepository.update(subscription);

    return toSubscriptionOutput(subscription);
  }

  private mapStatusToAction(
    status?: SubscriptionStatusType,
  ): SubscriptionStatusAction | undefined {
    if (!status) return undefined;
    switch (status) {
      case "PAUSADO":
        return "pause";
      case "ATIVO":
        return "resume";
      case "CANCELADO":
        return "cancel";
      default:
        return undefined;
    }
  }
}
