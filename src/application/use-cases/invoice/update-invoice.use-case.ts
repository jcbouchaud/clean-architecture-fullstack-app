import { IInvoiceRepository } from "@/src/application/repositories/invoice.repository.interface";
import { UpdateInvoiceInput, Invoice } from "@/src/entities/invoice";

export const updateInvoiceUseCase = (invoiceRepository: IInvoiceRepository) => {
  return async (input: UpdateInvoiceInput): Promise<Invoice> => {
    try {
      if (!input.id.trim()) {
        throw new Error("Invoice ID cannot be empty");
      }

      // Validate VAT rate if provided
      if (
        input.vatRate !== undefined &&
        (input.vatRate < 0 || input.vatRate > 100)
      ) {
        throw new Error("VAT rate must be between 0 and 100");
      }

      // Validate client name if provided
      if (input.clientName !== undefined && !input.clientName.trim()) {
        throw new Error("Client name cannot be empty");
      }

      // Validate date issued if provided
      if (input.dateIssued && input.dateIssued > new Date()) {
        throw new Error("Date issued cannot be in the future");
      }

      // Validate date of payment if provided
      if (
        input.dateOfPayment &&
        input.dateIssued &&
        input.dateOfPayment < input.dateIssued
      ) {
        throw new Error("Date of payment cannot be before date issued");
      }

      return await invoiceRepository.update(input);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "An unexpected error occurred while updating the invoice"
      );
    }
  };
};
