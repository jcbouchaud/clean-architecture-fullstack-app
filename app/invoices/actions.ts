"use server";

import { revalidatePath } from "next/cache";
import { createCreateInvoiceController } from "@/src/controllers/invoice/create-invoice.controller";
import { createUpdateInvoiceController } from "@/src/controllers/invoice/update-invoice.controller";
import { createDeleteInvoiceController } from "@/src/controllers/invoice/delete-invoice.controller";
import { CreateInvoiceInput, UpdateInvoiceInput } from "@/src/entities/invoice";
import { createInvoiceRepository } from "@/src/infrastructure/repositories/invoice.repository";
import { createClient } from "../../lib/client";

type ActionState =
  | {
      error: string;
      code: string;
      success?: boolean;
    }
  | undefined;

export async function createInvoice(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data: CreateInvoiceInput = {
      clientName: formData.get("clientName") as string,
      dateIssued: new Date(formData.get("dateIssued") as string),
      vatRate: parseFloat(formData.get("vatRate") as string),
      attachment: (formData.get("attachment") as string) || undefined,
    };

    const client = await createClient();
    const repository = createInvoiceRepository(client);
    const controller = createCreateInvoiceController(repository);
    await controller(data);
    revalidatePath("/invoices");
    return {
      error: "",
      code: "",
      success: true,
    };
  } catch (error) {
    return {
      error: `Failed to create invoice: ${error}`,
      code: "UNKNOWN",
    };
  }
}

export async function updateInvoice(
  prevState: ActionState,
  formData: FormData
) {
  try {
    const data: UpdateInvoiceInput = {
      id: formData.get("id") as string,
      clientName: formData.get("clientName") as string,
      dateIssued: new Date(formData.get("dateIssued") as string),
      vatRate: parseFloat(formData.get("vatRate") as string),
      attachment: (formData.get("attachment") as string) || undefined,
      dateOfPayment: new Date(formData.get("dateOfPayment") as string),
    };

    const client = await createClient();
    const repository = createInvoiceRepository(client);
    const controller = createUpdateInvoiceController(repository);
    await controller(data);
    revalidatePath("/invoices");
    return {
      error: "",
      code: "",
      success: true,
    };
  } catch (error) {
    return {
      error: `Failed to update invoice: ${error}`,
      code: "UNKNOWN",
    };
  }
}

export async function deleteInvoice(
  prevState: ActionState,
  formData: FormData
) {
  try {
    const id = formData.get("id") as string;
    const client = await createClient();
    const repository = createInvoiceRepository(client);
    const controller = createDeleteInvoiceController(repository);
    await controller(id);
    revalidatePath("/invoices");
    return {
      error: "",
      code: "",
      success: true,
    };
  } catch (error) {
    return {
      error: `Failed to delete invoice: ${error}`,
      code: "UNKNOWN",
    };
  }
}
