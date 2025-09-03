import { IInvoiceRepository } from "@/src/application/repositories/invoice.repository.interface";
import { Invoice } from "@/src/entities/invoice";

export const getInvoiceUseCase = (invoiceRepository: IInvoiceRepository) => {
  return async (id: string): Promise<Invoice | null> => {
    try {
      if (!id.trim()) {
        throw new Error("Invoice ID cannot be empty");
      }

      return await invoiceRepository.findById(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "An unexpected error occurred while retrieving the invoice"
      );
    }
  };
};
