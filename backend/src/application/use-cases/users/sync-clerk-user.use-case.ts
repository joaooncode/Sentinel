import { Inject, Injectable } from "@nestjs/common";
import {
  IUserRepository,
  USER_REPOSITORY,
} from "@domain/repositories/user.repository.interface";
import { User } from "@domain/entities/user.entity";

export interface SyncClerkUserData {
  id: string;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}

export interface SyncClerkUserInput {
  eventType: string;
  data: SyncClerkUserData;
}

export interface SyncClerkUserOutput {
  action: "created" | "updated" | "deleted" | "ignored";
  user?: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
    currency: string;
  };
}

@Injectable()
export class SyncClerkUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: SyncClerkUserInput): Promise<SyncClerkUserOutput> {
    const { eventType, data } = input;

    if (eventType === "user.deleted") {
      await this.userRepository.delete(data.id);
      return { action: "deleted" };
    }

    const fullName = [data.firstName, data.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    const name = fullName.length > 0 ? fullName : null;

    let user = await this.userRepository.findById(data.id);

    if (!user) {
      if (!data.email) {
        throw new Error("Email obrigatório para criação de novo usuário.");
      }
      user = User.create({
        id: data.id,
        email: data.email,
        name,
        avatarUrl: data.imageUrl,
      });
      await this.userRepository.save(user);

      return {
        action: "created",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          currency: user.currency,
        },
      };
    }

    user.updateProfile({
      name,
      avatarUrl: data.imageUrl,
    });
    await this.userRepository.save(user);

    return {
      action: "updated",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        currency: user.currency,
      },
    };
  }
}
