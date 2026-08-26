import { Inject, Injectable } from "@nestjs/common";
import {
  IBillingHistoryRepository,
  BILLING_HISTORY_REPOSITORY,
} from "../../../domain/repositories/billing-history.repository.interface";

export interface GetBillingHistoryInput {
  userId: string;
  subscriptionId?: string;
}

export interface BillingHistoryOutputItem {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  paidAt: Date;
  status: string;
  notes: string | null;
  createdAt: Date;
}

@Injectable()
export class GetBillingHistoryUseCase {
  constructor(
    @Inject(BILLING_HISTORY_REPOSITORY)
    private readonly billingHistoryRepository: IBillingHistoryRepository,
  ) {}

  async execute(
    input: GetBillingHistoryInput,
  ): Promise<BillingHistoryOutputItem[]> {
    const items = input.subscriptionId
      ? await this.billingHistoryRepository.findBySubscriptionId(
          input.subscriptionId,
          input.userId,
        )
      : await this.billingHistoryRepository.findByUserId(input.userId);

    items.sort((a, b) => b.paidAt.getTime() - a.paidAt.getTime());

    return items.map((item) => ({
      id: item.id,
      userId: item.userId,
      subscriptionId: item.subscriptionId,
      amount: item.amount,
      currency: item.currency,
      paidAt: item.paidAt,
      status: item.status,
      notes: item.notes,
      createdAt: item.createdAt,
    }));
  }
}
