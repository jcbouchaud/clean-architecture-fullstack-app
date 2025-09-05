import { z } from "zod";
import { deleteInvoiceUseCase } from "@/src/application/use-cases/invoice/delete-invoice.use-case";
import { IInvoiceRepository } from "@/src/application/repositories/invoice.repository.interface";

const deleteInvoiceSchema = z.object({
  id: z.string().min(1, "Invoice ID cannot be empty"),
});

export const createDeleteInvoiceController = (
  invoiceRepository: IInvoiceRepository
) => {
  const deleteInvoiceUseCaseInstance = deleteInvoiceUseCase(invoiceRepository);

  return async (id: string) => {
    try {
      const validatedData = deleteInvoiceSchema.parse({ id });
      return await deleteInvoiceUseCaseInstance(validatedData.id);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.issues[0].message}`);
      }
      throw error;
    }
  };
};
