import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Logger,
  RawBodyRequest,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Webhook } from "svix";
import {
  SyncClerkUserUseCase,
  SyncClerkUserData,
} from "@application/use-cases/users/sync-clerk-user.use-case";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string; id: string }>;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
  };
}

@ApiTags("Webhooks")
@Controller("webhooks")
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly syncClerkUserUseCase: SyncClerkUserUseCase) {}

  @Post("clerk")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Receber e sincronizar eventos de webhook do Clerk",
  })
  @ApiResponse({ status: 200, description: "Evento processado com sucesso." })
  @ApiResponse({
    status: 400,
    description: "Assinatura inválida ou payload malformado.",
  })
  async handleClerkWebhook(
    @Headers("svix-id") svixId: string,
    @Headers("svix-timestamp") svixTimestamp: string,
    @Headers("svix-signature") svixSignature: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<{ received: boolean; action?: string }> {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      this.logger.error("CLERK_WEBHOOK_SECRET não configurado.");
      throw new BadRequestException("Configuração de webhook ausente.");
    }

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new BadRequestException("Headers de assinatura Svix ausentes.");
    }

    const payload = JSON.stringify(req.body);
    const wh = new Webhook(webhookSecret);
    let evt: ClerkWebhookEvent;

    try {
      evt = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as ClerkWebhookEvent;
    } catch (err) {
      this.logger.warn(
        `Falha na verificação do webhook Clerk: ${err instanceof Error ? err.message : String(err)}`,
      );
      throw new BadRequestException("Assinatura do webhook inválida.");
    }

    const eventType = evt.type;
    this.logger.log(`Processando evento de webhook: ${eventType}`);

    if (
      eventType === "user.created" ||
      eventType === "user.updated" ||
      eventType === "user.deleted"
    ) {
      const email =
        evt.data.email_addresses && evt.data.email_addresses.length > 0
          ? evt.data.email_addresses[0].email_address
          : undefined;

      const userData: SyncClerkUserData = {
        id: evt.data.id,
        email,
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        imageUrl: evt.data.image_url,
      };

      const result = await this.syncClerkUserUseCase.execute({
        eventType,
        data: userData,
      });

      return { received: true, action: result.action };
    }

    return { received: true, action: "ignored" };
  }
}
