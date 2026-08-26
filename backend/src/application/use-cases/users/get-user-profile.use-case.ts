import { Inject, Injectable } from "@nestjs/common";
import {
  IUserRepository,
  USER_REPOSITORY,
} from "@domain/repositories/user.repository.interface";
import { UserNotFoundException } from "@domain/errors/user-not-found.exception";

export interface GetUserProfileInput {
  userId: string;
}

export interface UserProfileOutput {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class GetUserProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: GetUserProfileInput): Promise<UserProfileOutput> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new UserNotFoundException(input.userId);
    }

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
