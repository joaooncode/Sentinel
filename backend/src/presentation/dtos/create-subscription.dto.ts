import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsDateString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BillingCycle } from "@domain/value-objects/billing-period.vo";
import { SupportedCurrency } from "@domain/entities/user.entity";
import { SubscriptionStatusType } from "@domain/value-objects/subscription-status.vo";

export class CreateSubscriptionDto {
  @ApiProperty({
    description: "Nome do serviço ou assinatura",
    example: "Netflix",
  })
  @IsString()
  @IsNotEmpty({ message: "O nome da assinatura é obrigatório." })
  name!: string;

  @ApiPropertyOptional({
    description: "Nome do plano contratado",
    example: "Premium 4K",
  })
  @IsString()
  @IsOptional()
  plan?: string;

  @ApiPropertyOptional({
    description: "Categoria da assinatura",
    example: "Streaming",
    default: "Outros",
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: "Método de pagamento",
    example: "Cartão Nubank",
  })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({
    description: "Preço cobrado no ciclo",
    example: 55.9,
  })
  @IsNumber({}, { message: "O preço deve ser um número." })
  @IsPositive({ message: "O preço deve ser maior que zero." })
  price!: number;

  @ApiPropertyOptional({
    description: "Moeda do valor",
    enum: ["BRL", "USD", "EUR"],
    default: "BRL",
  })
  @IsEnum(["BRL", "USD", "EUR"], {
    message: "Moeda deve ser BRL, USD ou EUR.",
  })
  @IsOptional()
  currency?: SupportedCurrency;

  @ApiPropertyOptional({
    description: "Ciclo de cobrança",
    enum: ["SEMANAL", "MENSAL", "ANUAL"],
    default: "MENSAL",
  })
  @IsEnum(["SEMANAL", "MENSAL", "ANUAL"], {
    message: "Ciclo de cobrança deve ser SEMANAL, MENSAL ou ANUAL.",
  })
  @IsOptional()
  billing?: BillingCycle;

  @ApiPropertyOptional({
    description: "Status inicial da assinatura",
    enum: ["ATIVO", "PAUSADO", "CANCELADO"],
    default: "ATIVO",
  })
  @IsEnum(["ATIVO", "PAUSADO", "CANCELADO"])
  @IsOptional()
  status?: SubscriptionStatusType;

  @ApiPropertyOptional({
    description: "Data de início da assinatura (ISO 8601)",
    example: "2026-01-01T00:00:00.000Z",
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: "Data da próxima renovação/cobrança (ISO 8601)",
    example: "2026-09-01T00:00:00.000Z",
  })
  @IsDateString({}, { message: "A data de renovação deve ser válida." })
  @IsNotEmpty({ message: "A data de renovação é obrigatória." })
  renewalDate!: string;

  @ApiPropertyOptional({
    description: "Cor primária customizada",
    example: "#E50914",
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({
    description: "Nome do ícone da biblioteca Lucide",
    example: "Tv",
  })
  @IsString()
  @IsOptional()
  lucideIcon?: string;

  @ApiPropertyOptional({
    description: "URI da logo da marca",
    example: "https://logo.clearbit.com/netflix.com",
  })
  @IsString()
  @IsOptional()
  brandLogoUri?: string;

  @ApiPropertyOptional({
    description: "Código Hex da cor da marca",
    example: "#E50914",
  })
  @IsString()
  @IsOptional()
  brandHex?: string;
}
