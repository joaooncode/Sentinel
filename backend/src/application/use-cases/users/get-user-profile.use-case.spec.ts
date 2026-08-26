import { GetUserProfileUseCase } from "./get-user-profile.use-case";
import { InMemoryUserRepository } from "@infrastructure/repositories/in-memory-user.repository";
import { User } from "@domain/entities/user.entity";
import { UserNotFoundException } from "@domain/errors/user-not-found.exception";

describe("GetUserProfileUseCase", () => {
  let inMemoryRepo: InMemoryUserRepository;
  let useCase: GetUserProfileUseCase;

  beforeEach(() => {
    inMemoryRepo = new InMemoryUserRepository();
    useCase = new GetUserProfileUseCase(inMemoryRepo);
  });

  it("should return user profile when user exists", async () => {
    const user = User.create({
      id: "user_123",
      email: "joao@example.com",
      name: "João Vitor",
      avatarUrl: "https://example.com/avatar.png",
      currency: "BRL",
    });
    await inMemoryRepo.save(user);

    const profile = await useCase.execute({ userId: "user_123" });

    expect(profile.id).toBe("user_123");
    expect(profile.email).toBe("joao@example.com");
    expect(profile.name).toBe("João Vitor");
    expect(profile.avatarUrl).toBe("https://example.com/avatar.png");
    expect(profile.currency).toBe("BRL");
    expect(profile.createdAt).toBeInstanceOf(Date);
  });

  it("should throw UserNotFoundException when user does not exist", async () => {
    await expect(
      useCase.execute({ userId: "non_existing_user" }),
    ).rejects.toThrow(UserNotFoundException);
  });
});
