export class InvalidSubscriptionOperationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidSubscriptionOperationException";
  }
}
