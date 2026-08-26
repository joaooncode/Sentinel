import { IsInt, IsOptional, IsPositive, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpcomingRenewalsQueryDto {
  @ApiPropertyOptional({
    description: "Horizonte em dias para filtrar próximas renovações",
    example: 30,
    default: 30,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  daysAhead?: number;

  @ApiPropertyOptional({
    description: "Limite de resultados retornados",
    example: 10,
  })
  @IsInt()
  @IsPositive()
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
