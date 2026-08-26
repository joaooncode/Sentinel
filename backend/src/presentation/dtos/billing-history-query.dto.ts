import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class BillingHistoryQueryDto {
  @ApiPropertyOptional({
    description: "Filtrar histórico por ID de uma assinatura específica",
    example: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  })
  @IsString()
  @IsOptional()
  subscriptionId?: string;
}
