import { IsEnum, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { SubscriptionStatusType } from "@domain/value-objects/subscription-status.vo";
import { SubscriptionStatusAction } from "@application/use-cases/subscriptions/change-subscription-status.use-case";

export class ChangeSubscriptionStatusDto {
  @ApiPropertyOptional({
    description: "Ação a ser executada no ciclo de vida da assinatura",
    enum: ["pause", "resume", "cancel"],
    example: "pause",
  })
  @IsEnum(["pause", "resume", "cancel"], {
    message: "Ação deve ser 'pause', 'resume' ou 'cancel'.",
  })
  @IsOptional()
  action?: SubscriptionStatusAction;

  @ApiPropertyOptional({
    description: "Novo status desejado da assinatura",
    enum: ["ATIVO", "PAUSADO", "CANCELADO"],
    example: "PAUSADO",
  })
  @IsEnum(["ATIVO", "PAUSADO", "CANCELADO"], {
    message: "Status deve ser 'ATIVO', 'PAUSADO' ou 'CANCELADO'.",
  })
  @IsOptional()
  status?: SubscriptionStatusType;
}
