export class SubscriptionNotFoundException extends Error {
  constructor(identifier?: string) {
    super(
      identifier
        ? `Assinatura com identificador '${identifier}' não foi encontrada.`
        : "Assinatura não encontrada.",
    );
    this.name = "SubscriptionNotFoundException";
  }
}
