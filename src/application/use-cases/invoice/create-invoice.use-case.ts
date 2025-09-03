import { IInvoiceRepository } from "@/src/application/repositories/invoice.repository.interface";
import { CreateInvoiceInput, Invoice } from "@/src/entities/invoice";

export const createInvoiceUseCase = (invoiceRepository: IInvoiceRepository) => {
  return async (input: CreateInvoiceInput): Promise<Invoice> => {
    try {
      // Validate VAT rate is reasonable (between 0 and 100)
      if (input.vatRate < 0 || input.vatRate > 100) {
        throw new Error("VAT rate must be between 0 and 100");
      }

      // Validate client name is not empty
      if (!input.clientName.trim()) {
        throw new Error("Client name cannot be empty");
      }

      // Validate date issued is not in the future
      if (input.dateIssued > new Date()) {
        throw new Error("Date issued cannot be in the future");
      }

      // Validate date of payment is not before date issued
      if (input.dateOfPayment && input.dateOfPayment < input.dateIssued) {
        throw new Error("Date of payment cannot be before date issued");
      }

      return await invoiceRepository.create(input);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "An unexpected error occurred while creating the invoice"
      );
    }
  };
};
