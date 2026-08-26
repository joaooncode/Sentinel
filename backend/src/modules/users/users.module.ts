import { Module } from "@nestjs/common";
import { USER_REPOSITORY } from "@domain/repositories/user.repository.interface";
import { PrismaUserRepository } from "@infrastructure/repositories/prisma-user.repository";
import { SyncClerkUserUseCase } from "@application/use-cases/users/sync-clerk-user.use-case";
import { GetUserProfileUseCase } from "@application/use-cases/users/get-user-profile.use-case";
import { UsersController } from "@presentation/controllers/users.controller";
import { WebhooksController } from "@presentation/controllers/webhooks.controller";
import { ClerkAuthGuard } from "@infrastructure/auth/clerk-auth.guard";

@Module({
  controllers: [UsersController, WebhooksController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    SyncClerkUserUseCase,
    GetUserProfileUseCase,
    ClerkAuthGuard,
  ],
  exports: [USER_REPOSITORY, GetUserProfileUseCase, SyncClerkUserUseCase],
})
export class UsersModule {}
