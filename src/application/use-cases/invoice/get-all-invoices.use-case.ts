import { IInvoiceRepository } from "@/src/application/repositories/invoice.repository.interface";
import { Invoice } from "@/src/entities/invoice";

export const getAllInvoicesUseCase = (
  invoiceRepository: IInvoiceRepository
) => {
  return async (): Promise<Invoice[]> => {
    try {
      return await invoiceRepository.findAll();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred while retrieving invoices");
    }
  };
};
