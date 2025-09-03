import { getAllInvoicesUseCase } from "@/src/application/use-cases/invoice/get-all-invoices.use-case";
import { IInvoiceRepository } from "@/src/application/repositories/invoice.repository.interface";

export const createGetAllInvoicesController = (
  invoiceRepository: IInvoiceRepository
) => {
  const getAllInvoicesUseCaseInstance =
    getAllInvoicesUseCase(invoiceRepository);

  return async () => {
    try {
      return await getAllInvoicesUseCaseInstance();
    } catch (error) {
      throw error;
    }
  };
};
