import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ListSubscriptionsQueryDto {
  @ApiPropertyOptional({
    description: "Filtrar por status (ATIVO, PAUSADO, CANCELADO)",
    example: "ATIVO",
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: "Filtrar por categoria",
    example: "Streaming",
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: "Termo de busca por nome ou plano",
    example: "Netflix",
  })
  @IsString()
  @IsOptional()
  search?: string;
}
