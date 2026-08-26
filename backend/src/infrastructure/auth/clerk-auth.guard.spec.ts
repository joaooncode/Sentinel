import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ClerkAuthGuard } from "./clerk-auth.guard";
import * as clerkBackend from "@clerk/backend";

jest.mock("@clerk/backend", () => ({
  verifyToken: jest.fn(),
  createClerkClient: jest.fn(),
}));

describe("ClerkAuthGuard", () => {
  let guard: ClerkAuthGuard;

  beforeEach(() => {
    guard = new ClerkAuthGuard();
    process.env.CLERK_SECRET_KEY = "sk_test_mock";
    jest.clearAllMocks();
  });

  const createMockContext = (authHeader?: string): ExecutionContext => {
    const request: { headers: { authorization?: string }; user?: unknown } = {
      headers: { authorization: authHeader },
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  };

  it("should throw UnauthorizedException if authorization header is missing", async () => {
    const context = createMockContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should throw UnauthorizedException if authorization header does not start with Bearer", async () => {
    const context = createMockContext("Basic 12345");

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should validate token and attach user to request when token is valid", async () => {
    const context = createMockContext("Bearer valid_jwt_token");
    (clerkBackend.verifyToken as jest.Mock).mockResolvedValueOnce({
      sub: "user_clerk_123",
      sid: "sess_123",
    });

    const canActivate = await guard.canActivate(context);

    expect(canActivate).toBe(true);
    const req = context.switchToHttp().getRequest() as {
      user: { userId: string };
    };
    expect(req.user.userId).toBe("user_clerk_123");
  });

  it("should throw UnauthorizedException when verifyToken fails", async () => {
    const context = createMockContext("Bearer invalid_token");
    (clerkBackend.verifyToken as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid token"),
    );

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
