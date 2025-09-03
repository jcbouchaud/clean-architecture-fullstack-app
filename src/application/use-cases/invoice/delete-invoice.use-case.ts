import { IInvoiceRepository } from "@/src/application/repositories/invoice.repository.interface";

export const deleteInvoiceUseCase = (invoiceRepository: IInvoiceRepository) => {
  return async (id: string): Promise<void> => {
    try {
      if (!id.trim()) {
        throw new Error("Invoice ID cannot be empty");
      }

      await invoiceRepository.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        "An unexpected error occurred while deleting the invoice"
      );
    }
  };
};
