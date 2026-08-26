import { IUserRepository } from "@domain/repositories/user.repository.interface";
import { User } from "@domain/entities/user.entity";

export class InMemoryUserRepository implements IUserRepository {
  public users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user ? user : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalized = email.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase().trim() === normalized) {
        return user;
      }
    }
    return null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}
