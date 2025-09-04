"use server";

import { revalidatePath } from "next/cache";
import { createCreateInvoiceController } from "@/src/controllers/invoice/create-invoice.controller";
import { createUpdateInvoiceController } from "@/src/controllers/invoice/update-invoice.controller";
import { createDeleteInvoiceController } from "@/src/controllers/invoice/delete-invoice.controller";
import { CreateInvoiceInput, UpdateInvoiceInput } from "@/src/entities/invoice";
import { createInvoiceRepository } from "@/src/infrastructure/repositories/invoice.repository";
import { cookies } from "../lib/cookies";

type ActionState =
  | {
      error: string;
      code: string;
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

    const repository = createInvoiceRepository(cookies);
    const controller = createCreateInvoiceController(repository);
    await controller(data);
  } catch (error) {
    return {
      error: `Failed to create invoice: ${error}`,
      code: "UNKNOWN",
    };
  }
  revalidatePath("/invoices");
}

export async function updateInvoice(formData: FormData) {
  try {
    const data: UpdateInvoiceInput = {
      id: formData.get("id") as string,
      clientName: formData.get("clientName") as string,
      dateIssued: new Date(formData.get("dateIssued") as string),
      vatRate: parseFloat(formData.get("vatRate") as string),
      attachment: (formData.get("attachment") as string) || undefined,
    };

    const repository = createInvoiceRepository(cookies);
    const controller = createUpdateInvoiceController(repository);
    await controller(data);
    revalidatePath("/invoices");
  } catch (error) {
    console.error("Failed to update invoice:", error);
    throw new Error("Failed to update invoice");
  }
}

export async function deleteInvoice(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const repository = createInvoiceRepository(cookies);
    const controller = createDeleteInvoiceController(repository);
    await controller(id);
    revalidatePath("/invoices");
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    throw new Error("Failed to delete invoice");
  }
}
