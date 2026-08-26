import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { IBillingHistoryRepository } from "@domain/repositories/billing-history.repository.interface";
import { BillingHistory } from "@domain/entities/billing-history.entity";
import { PrismaService } from "../prisma/prisma.service";
import { BillingHistoryMapper } from "../mappers/billing-history.mapper";

@Injectable()
export class PrismaBillingHistoryRepository implements IBillingHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(billingHistory: BillingHistory): Promise<void> {
    const data = BillingHistoryMapper.toPersistence(billingHistory);
    await this.prisma.billingHistory.create({
      data,
    });
  }

  async findByUserId(userId: string): Promise<BillingHistory[]> {
    const list = await this.prisma.billingHistory.findMany({
      where: { userId },
      orderBy: { paidAt: "desc" },
    });

    return list.map(BillingHistoryMapper.toDomain);
  }

  async findBySubscriptionId(
    subscriptionId: string,
    userId?: string,
  ): Promise<BillingHistory[]> {
    const where: Prisma.BillingHistoryWhereInput = {
      subscriptionId,
      ...(userId ? { userId } : {}),
    };

    const list = await this.prisma.billingHistory.findMany({
      where,
      orderBy: { paidAt: "desc" },
    });

    return list.map(BillingHistoryMapper.toDomain);
  }
}
