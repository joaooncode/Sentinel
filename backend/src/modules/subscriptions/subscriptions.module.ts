import { Module } from "@nestjs/common";
import { SUBSCRIPTION_REPOSITORY } from "@domain/repositories/subscription.repository.interface";
import { PrismaSubscriptionRepository } from "@infrastructure/repositories/prisma-subscription.repository";
import { CreateSubscriptionUseCase } from "@application/use-cases/subscriptions/create-subscription.use-case";
import { ListUserSubscriptionsUseCase } from "@application/use-cases/subscriptions/list-user-subscriptions.use-case";
import { GetSubscriptionByIdUseCase } from "@application/use-cases/subscriptions/get-subscription-by-id.use-case";
import { UpdateSubscriptionUseCase } from "@application/use-cases/subscriptions/update-subscription.use-case";
import { ChangeSubscriptionStatusUseCase } from "@application/use-cases/subscriptions/change-subscription-status.use-case";
import { DeleteSubscriptionUseCase } from "@application/use-cases/subscriptions/delete-subscription.use-case";
import { SubscriptionsController } from "@presentation/controllers/subscriptions.controller";
import { ClerkAuthGuard } from "@infrastructure/auth/clerk-auth.guard";

@Module({
  controllers: [SubscriptionsController],
  providers: [
    {
      provide: SUBSCRIPTION_REPOSITORY,
      useClass: PrismaSubscriptionRepository,
    },
    CreateSubscriptionUseCase,
    ListUserSubscriptionsUseCase,
    GetSubscriptionByIdUseCase,
    UpdateSubscriptionUseCase,
    ChangeSubscriptionStatusUseCase,
    DeleteSubscriptionUseCase,
    ClerkAuthGuard,
  ],
  exports: [
    SUBSCRIPTION_REPOSITORY,
    CreateSubscriptionUseCase,
    ListUserSubscriptionsUseCase,
    GetSubscriptionByIdUseCase,
    UpdateSubscriptionUseCase,
    ChangeSubscriptionStatusUseCase,
    DeleteSubscriptionUseCase,
  ],
})
export class SubscriptionsModule {}
