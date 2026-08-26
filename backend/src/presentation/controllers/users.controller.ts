import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Inject,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ClerkAuthGuard } from "@infrastructure/auth/clerk-auth.guard";
import {
  CurrentUser,
  AuthenticatedUser,
} from "@common/decorators/current-user.decorator";
import {
  GetUserProfileUseCase,
  UserProfileOutput,
} from "@application/use-cases/users/get-user-profile.use-case";
import { UpdateUserProfileDto } from "../dtos/update-user-profile.dto";
import {
  IUserRepository,
  USER_REPOSITORY,
} from "@domain/repositories/user.repository.interface";
import { UserNotFoundException } from "@domain/errors/user-not-found.exception";

@ApiTags("Users")
@ApiBearerAuth("clerk-jwt")
@UseGuards(ClerkAuthGuard)
@Controller("users")
export class UsersController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  @Get("me")
  @ApiOperation({ summary: "Obter perfil do usuário autenticado" })
  @ApiResponse({ status: 200, description: "Perfil retornado com sucesso." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async getMe(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserProfileOutput> {
    return this.getUserProfileUseCase.execute({ userId: user.userId });
  }

  @Patch("me")
  @ApiOperation({ summary: "Atualizar perfil e preferências do usuário" })
  @ApiResponse({ status: 200, description: "Perfil atualizado com sucesso." })
  async updateMe(
    @CurrentUser() authUser: AuthenticatedUser,
    @Body() dto: UpdateUserProfileDto,
  ): Promise<UserProfileOutput> {
    const user = await this.userRepository.findById(authUser.userId);
    if (!user) {
      throw new UserNotFoundException(authUser.userId);
    }

    if (dto.name !== undefined || dto.avatarUrl !== undefined) {
      user.updateProfile({
        name: dto.name,
        avatarUrl: dto.avatarUrl,
      });
    }

    if (dto.currency) {
      user.updateCurrency(dto.currency);
    }

    await this.userRepository.save(user);

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
