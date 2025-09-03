import { z } from "zod";
import { getInvoiceUseCase } from "@/src/application/use-cases/invoice/get-invoice.use-case";
import { IInvoiceRepository } from "@/src/application/repositories/invoice.repository.interface";

const getInvoiceSchema = z.object({
  id: z.string().min(1, "Invoice ID cannot be empty"),
});

export const createGetInvoiceController = (
  invoiceRepository: IInvoiceRepository
) => {
  const getInvoiceUseCaseInstance = getInvoiceUseCase(invoiceRepository);

  return async (id: string) => {
    try {
      const validatedData = getInvoiceSchema.parse({ id });
      return await getInvoiceUseCaseInstance(validatedData.id);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw error;
    }
  };
};
