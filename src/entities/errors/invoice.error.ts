export class InvoiceError extends Error {
  constructor(message: string, public readonly code: InvoiceErrorCode) {
    super(message);
    this.name = "InvoiceError";
  }
}

export enum InvoiceErrorCode {
  INVOICE_NOT_FOUND = "INVOICE_NOT_FOUND",
  INVOICE_ALREADY_EXISTS = "INVOICE_ALREADY_EXISTS",
  INVOICE_INVALID = "INVOICE_INVALID",
  INVOICE_MISSING = "INVOICE_MISSING",
}
