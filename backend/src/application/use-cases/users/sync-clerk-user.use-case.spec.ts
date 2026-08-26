import { SyncClerkUserUseCase } from "./sync-clerk-user.use-case";
import { InMemoryUserRepository } from "@infrastructure/repositories/in-memory-user.repository";
import { User } from "@domain/entities/user.entity";

describe("SyncClerkUserUseCase", () => {
  let inMemoryRepo: InMemoryUserRepository;
  let useCase: SyncClerkUserUseCase;

  beforeEach(() => {
    inMemoryRepo = new InMemoryUserRepository();
    useCase = new SyncClerkUserUseCase(inMemoryRepo);
  });

  it("should create a new user when user.created event is received", async () => {
    const result = await useCase.execute({
      eventType: "user.created",
      data: {
        id: "user_clerk_999",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Silva",
        imageUrl: "https://example.com/maria.png",
      },
    });

    expect(result.action).toBe("created");
    expect(result.user).toBeDefined();
    expect(result.user?.id).toBe("user_clerk_999");
    expect(result.user?.email).toBe("maria@example.com");
    expect(result.user?.name).toBe("Maria Silva");
    expect(result.user?.avatarUrl).toBe("https://example.com/maria.png");

    const saved = await inMemoryRepo.findById("user_clerk_999");
    expect(saved).not.toBeNull();
  });

  it("should update existing user when user.updated event is received", async () => {
    const existing = User.create({
      id: "user_clerk_999",
      email: "maria@example.com",
      name: "Maria",
      avatarUrl: "https://example.com/old.png",
    });
    await inMemoryRepo.save(existing);

    const result = await useCase.execute({
      eventType: "user.updated",
      data: {
        id: "user_clerk_999",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Santos",
        imageUrl: "https://example.com/new.png",
      },
    });

    expect(result.action).toBe("updated");
    expect(result.user?.name).toBe("Maria Santos");
    expect(result.user?.avatarUrl).toBe("https://example.com/new.png");
  });

  it("should delete user when user.deleted event is received", async () => {
    const existing = User.create({
      id: "user_clerk_999",
      email: "maria@example.com",
    });
    await inMemoryRepo.save(existing);

    const result = await useCase.execute({
      eventType: "user.deleted",
      data: {
        id: "user_clerk_999",
      },
    });

    expect(result.action).toBe("deleted");
    const saved = await inMemoryRepo.findById("user_clerk_999");
    expect(saved).toBeNull();
  });
});
