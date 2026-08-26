import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "@infrastructure/prisma/prisma.module";
import { UsersModule } from "./modules/users/users.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";
import { InsightsModule } from "./modules/insights/insights.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    PrismaModule,
    UsersModule,
    SubscriptionsModule,
    InsightsModule,
  ],
})
export class AppModule {}
