export class SubscriptionNotFoundException extends Error {
  constructor(identifier?: string) {
    const message = identifier
      ? `Assinatura com identificador '${identifier}' não foi encontrada.`
      : "Assinatura não encontrada.";
    super(message);
    this.name = "SubscriptionNotFoundException";
  }
}
