import { User } from "./user.entity";

describe("User Entity (Domain)", () => {
  it("should create a new user entity with valid properties", () => {
    const user = User.create({
      id: "user_clerk_123",
      email: "joao@example.com",
      name: "João Vitor",
      avatarUrl: "https://example.com/avatar.png",
    });

    expect(user.id).toBe("user_clerk_123");
    expect(user.email).toBe("joao@example.com");
    expect(user.name).toBe("João Vitor");
    expect(user.avatarUrl).toBe("https://example.com/avatar.png");
    expect(user.currency).toBe("BRL");
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it("should throw an error if id is empty", () => {
    expect(() =>
      User.create({
        id: "",
        email: "joao@example.com",
      }),
    ).toThrow("User ID não pode ser vazio.");
  });

  it("should throw an error if email is invalid", () => {
    expect(() =>
      User.create({
        id: "user_123",
        email: "invalid-email",
      }),
    ).toThrow("Email inválido.");
  });

  it("should update profile name and avatar correctly", () => {
    const user = User.create({
      id: "user_123",
      email: "joao@example.com",
      name: "João",
    });

    user.updateProfile({
      name: "João Silva",
      avatarUrl: "https://new-avatar.png",
    });

    expect(user.name).toBe("João Silva");
    expect(user.avatarUrl).toBe("https://new-avatar.png");
  });

  it("should update currency to a valid currency code", () => {
    const user = User.create({
      id: "user_123",
      email: "joao@example.com",
    });

    user.updateCurrency("USD");
    expect(user.currency).toBe("USD");
  });

  it("should throw error when updating to an invalid currency code", () => {
    const user = User.create({
      id: "user_123",
      email: "joao@example.com",
    });

    expect(() => user.updateCurrency("INVALID")).toThrow(
      "Moeda não suportada: INVALID",
    );
  });
});
