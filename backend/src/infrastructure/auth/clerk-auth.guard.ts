import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { verifyToken } from "@clerk/backend";
import { Request } from "express";

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Token de autenticação não fornecido.");
    }

    const token = authHeader.split(" ")[1];
    const secretKey = process.env.CLERK_SECRET_KEY;

    if (!secretKey) {
      this.logger.error("CLERK_SECRET_KEY não configurada no ambiente.");
      throw new UnauthorizedException("Configuração de autenticação ausente.");
    }

    try {
      const decoded = await verifyToken(token, {
        secretKey,
      });

      if (!decoded || !decoded.sub) {
        throw new UnauthorizedException("Token de autenticação inválido.");
      }

      // Attach authenticated user information to request
      (
        request as unknown as { user: { userId: string; claims: unknown } }
      ).user = {
        userId: decoded.sub,
        claims: decoded,
      };

      return true;
    } catch (error) {
      this.logger.warn(
        `Falha na validação do token Clerk: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new UnauthorizedException("Sessão expirada ou token inválido.");
    }
  }
}
