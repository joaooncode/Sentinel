import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";
import {
  SUPPORTED_CURRENCIES,
  SupportedCurrency,
} from "@domain/entities/user.entity";

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ example: "João Vitor" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: "https://example.com/avatar.png" })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiPropertyOptional({ example: "BRL", enum: SUPPORTED_CURRENCIES })
  @IsOptional()
  @IsIn(SUPPORTED_CURRENCIES, {
    message: `Moeda deve ser uma das suportadas: ${SUPPORTED_CURRENCIES.join(", ")}`,
  })
  currency?: SupportedCurrency;
}
