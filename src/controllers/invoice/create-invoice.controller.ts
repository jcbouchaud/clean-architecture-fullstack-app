import { z } from "zod";
import { createInvoiceUseCase } from "@/src/application/use-cases/invoice/create-invoice.use-case";
import { IInvoiceRepository } from "@/src/application/repositories/invoice.repository.interface";
import { CreateInvoiceInput } from "@/src/entities/invoice";

const createInvoiceSchema = z.object({
  dateIssued: z.coerce.date(),
  dateOfPayment: z.coerce.date().optional(),
  vatRate: z.number().min(0).max(100),
  clientName: z.string().min(1, "Client name cannot be empty"),
  attachment: z.string().optional(),
});

export const createCreateInvoiceController = (
  invoiceRepository: IInvoiceRepository
) => {
  const createInvoiceUseCaseInstance = createInvoiceUseCase(invoiceRepository);

  return async (input: CreateInvoiceInput) => {
    try {
      const validatedData = createInvoiceSchema.parse(input);
      return await createInvoiceUseCaseInstance(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw error;
    }
  };
};
