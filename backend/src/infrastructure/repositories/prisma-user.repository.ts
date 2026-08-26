import { Injectable } from "@nestjs/common";
import { IUserRepository } from "@domain/repositories/user.repository.interface";
import { User } from "@domain/entities/user.entity";
import { PrismaService } from "../prisma/prisma.service";
import { UserMapper } from "../mappers/user.mapper";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({
      where: { id },
    });

    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    return raw ? UserMapper.toDomain(raw) : null;
  }

  async save(user: User): Promise<void> {
    const data = UserMapper.toPersistence(user);

    await this.prisma.user.upsert({
      where: { id: user.id },
      create: data,
      update: {
        email: data.email,
        name: data.name,
        avatarUrl: data.avatarUrl,
        currency: data.currency,
        updatedAt: data.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
