import { describe, it, expect, beforeEach, vi } from "vitest";
import { deleteInvoiceUseCase } from "../delete-invoice.use-case";
import { createInvoiceUseCase } from "../create-invoice.use-case";
import { getAllInvoicesUseCase } from "../get-all-invoices.use-case";
import { createInvoiceMockRepository } from "../../../../infrastructure/repositories/invoice.mock.repository";
import { Invoice } from "@/src/entities/invoice";

describe("Delete Invoice Use Case", () => {
  let mockRepository: ReturnType<typeof createInvoiceMockRepository>;
  let existingInvoice: Invoice;

  beforeEach(async () => {
    mockRepository = createInvoiceMockRepository();
    const createInvoice = createInvoiceUseCase(mockRepository);
    existingInvoice = await createInvoice({
      clientName: "Test Client",
      dateIssued: new Date("2024-01-01"),
      vatRate: 20,
    });
  });

  it("should delete invoice when valid ID is provided", async () => {
    const deleteInvoice = deleteInvoiceUseCase(mockRepository);
    const getAllInvoices = getAllInvoicesUseCase(mockRepository);

    // Verify invoice exists
    let allInvoices = await getAllInvoices();
    expect(allInvoices).toHaveLength(1);

    // Delete invoice
    await deleteInvoice(existingInvoice.id);

    // Verify invoice is deleted
    allInvoices = await getAllInvoices();
    expect(allInvoices).toHaveLength(0);
  });

  it("should throw error for empty ID", async () => {
    const deleteInvoice = deleteInvoiceUseCase(mockRepository);

    await expect(deleteInvoice("")).rejects.toThrow(
      "Invoice ID cannot be empty"
    );
  });

  it("should throw error for whitespace-only ID", async () => {
    const deleteInvoice = deleteInvoiceUseCase(mockRepository);

    await expect(deleteInvoice("   ")).rejects.toThrow(
      "Invoice ID cannot be empty"
    );
  });

  it("should handle repository errors gracefully", async () => {
    mockRepository.delete = vi
      .fn()
      .mockRejectedValue(new Error("Database error"));

    const deleteInvoice = deleteInvoiceUseCase(mockRepository);

    await expect(deleteInvoice("test-id")).rejects.toThrow("Database error");
  });
});
