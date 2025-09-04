import { z } from "zod";
import { updateInvoiceUseCase } from "@/src/application/use-cases/invoice/update-invoice.use-case";
import { IInvoiceRepository } from "@/src/application/repositories/invoice.repository.interface";
import { UpdateInvoiceInput } from "@/src/entities/invoice";

const updateInvoiceSchema = z.object({
  id: z.string().min(1, "Invoice ID cannot be empty"),
  dateIssued: z.coerce.date().optional(),
  dateOfPayment: z.coerce.date().optional(),
  vatRate: z.number().min(0).max(100).optional(),
  clientName: z.string().min(1, "Client name cannot be empty").optional(),
  attachment: z.string().optional(),
});

export const createUpdateInvoiceController = (
  invoiceRepository: IInvoiceRepository
) => {
  const updateInvoiceUseCaseInstance = updateInvoiceUseCase(invoiceRepository);

  return async (input: UpdateInvoiceInput) => {
    try {
      const validatedData = updateInvoiceSchema.parse(input);
      return await updateInvoiceUseCaseInstance(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors[0].message}`);
      }
      throw error;
    }
  };
};




