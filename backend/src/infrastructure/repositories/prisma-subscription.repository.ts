import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  ISubscriptionRepository,
  SubscriptionFilters,
} from "@domain/repositories/subscription.repository.interface";
import { Subscription } from "@domain/entities/subscription.entity";
import { PrismaService } from "../prisma/prisma.service";
import { SubscriptionMapper } from "../mappers/subscription.mapper";

@Injectable()
export class PrismaSubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(subscription: Subscription): Promise<void> {
    const data = SubscriptionMapper.toPersistence(subscription);
    await this.prisma.subscription.create({
      data,
    });
  }

  async findById(id: string, userId?: string): Promise<Subscription | null> {
    const where: Prisma.SubscriptionWhereInput = {
      id,
      ...(userId ? { userId } : {}),
    };

    const raw = await this.prisma.subscription.findFirst({
      where,
    });

    return raw ? SubscriptionMapper.toDomain(raw) : null;
  }

  async findByUserId(
    userId: string,
    filters?: SubscriptionFilters,
  ): Promise<Subscription[]> {
    const where: Prisma.SubscriptionWhereInput = {
      userId,
      ...(filters?.status
        ? { status: filters.status as Prisma.EnumSubscriptionStatusFilter }
        : {}),
      ...(filters?.category
        ? { category: { equals: filters.category, mode: "insensitive" } }
        : {}),
      ...(filters?.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" } },
              { plan: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const list = await this.prisma.subscription.findMany({
      where,
      orderBy: { renewalDate: "asc" },
    });

    return list.map(SubscriptionMapper.toDomain);
  }

  async update(subscription: Subscription): Promise<void> {
    const data = SubscriptionMapper.toPersistence(subscription);
    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data,
    });
  }

  async delete(id: string, userId?: string): Promise<void> {
    if (userId) {
      await this.prisma.subscription.deleteMany({
        where: { id, userId },
      });
    } else {
      await this.prisma.subscription.delete({
        where: { id },
      });
    }
  }
}
