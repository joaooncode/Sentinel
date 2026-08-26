import { User as PrismaUserModel } from "../prisma/generated-client";
import { User, SupportedCurrency } from "@domain/entities/user.entity";

export class UserMapper {
  public static toDomain(raw: PrismaUserModel): User {
    return User.restore({
      id: raw.id,
      email: raw.email,
      name: raw.name,
      avatarUrl: raw.avatarUrl,
      currency: raw.currency as SupportedCurrency,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  public static toPersistence(user: User): PrismaUserModel {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      currency: user.currency,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
