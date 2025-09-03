import { describe, it, expect, beforeEach, vi } from "vitest";
import { updateInvoiceUseCase } from "../update-invoice.use-case";
import { createInvoiceUseCase } from "../create-invoice.use-case";
import { createInvoiceMockRepository } from "../../../../infrastructure/repositories/invoice.mock.repository";
import { Invoice, UpdateInvoiceInput } from "@/src/entities/invoice";

describe("Update Invoice Use Case", () => {
  let mockRepository: ReturnType<typeof createInvoiceMockRepository>;
  let existingInvoice: Invoice;

  beforeEach(async () => {
    mockRepository = createInvoiceMockRepository();
    const createInvoice = createInvoiceUseCase(mockRepository);
    existingInvoice = await createInvoice({
      clientName: "Original Client",
      dateIssued: new Date("2024-01-01"),
      vatRate: 20,
    });
  });

  it("should update invoice with valid input", async () => {
    const updateInvoice = updateInvoiceUseCase(mockRepository);
    const updateInput: UpdateInvoiceInput = {
      id: existingInvoice.id,
      clientName: "Updated Client",
      vatRate: 25,
    };

    const result = await updateInvoice(updateInput);

    expect(result.clientName).toBe("Updated Client");
    expect(result.vatRate).toBe(25);
    expect(result.dateIssued).toEqual(existingInvoice.dateIssued); // Unchanged
  });

  it("should update only provided fields", async () => {
    const updateInvoice = updateInvoiceUseCase(mockRepository);
    const updateInput: UpdateInvoiceInput = {
      id: existingInvoice.id,
      clientName: "Updated Client",
    };

    const result = await updateInvoice(updateInput);

    expect(result.clientName).toBe("Updated Client");
    expect(result.vatRate).toBe(20); // Unchanged
    expect(result.dateIssued).toEqual(existingInvoice.dateIssued); // Unchanged
  });

  it("should throw error for empty ID", async () => {
    const updateInvoice = updateInvoiceUseCase(mockRepository);
    const updateInput: UpdateInvoiceInput = {
      id: "",
      clientName: "Updated Client",
    };

    await expect(updateInvoice(updateInput)).rejects.toThrow(
      "Invoice ID cannot be empty"
    );
  });

  it("should throw error for invalid VAT rate (negative)", async () => {
    const updateInvoice = updateInvoiceUseCase(mockRepository);
    const updateInput: UpdateInvoiceInput = {
      id: existingInvoice.id,
      vatRate: -5,
    };

    await expect(updateInvoice(updateInput)).rejects.toThrow(
      "VAT rate must be between 0 and 100"
    );
  });

  it("should throw error for invalid VAT rate (over 100)", async () => {
    const updateInvoice = updateInvoiceUseCase(mockRepository);
    const updateInput: UpdateInvoiceInput = {
      id: existingInvoice.id,
      vatRate: 150,
    };

    await expect(updateInvoice(updateInput)).rejects.toThrow(
      "VAT rate must be between 0 and 100"
    );
  });

  it("should throw error for empty client name", async () => {
    const updateInvoice = updateInvoiceUseCase(mockRepository);
    const updateInput: UpdateInvoiceInput = {
      id: existingInvoice.id,
      clientName: "",
    };

    await expect(updateInvoice(updateInput)).rejects.toThrow(
      "Client name cannot be empty"
    );
  });

  it("should throw error for future date issued", async () => {
    const updateInvoice = updateInvoiceUseCase(mockRepository);
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    const updateInput: UpdateInvoiceInput = {
      id: existingInvoice.id,
      dateIssued: futureDate,
    };

    await expect(updateInvoice(updateInput)).rejects.toThrow(
      "Date issued cannot be in the future"
    );
  });

  it("should throw error when date of payment is before date issued", async () => {
    const updateInvoice = updateInvoiceUseCase(mockRepository);
    const updateInput: UpdateInvoiceInput = {
      id: existingInvoice.id,
      dateIssued: new Date("2024-01-15"),
      dateOfPayment: new Date("2024-01-10"),
    };

    await expect(updateInvoice(updateInput)).rejects.toThrow(
      "Date of payment cannot be before date issued"
    );
  });

  it("should allow date of payment equal to date issued", async () => {
    const updateInvoice = updateInvoiceUseCase(mockRepository);
    const sameDate = new Date("2024-01-15");
    const updateInput: UpdateInvoiceInput = {
      id: existingInvoice.id,
      dateIssued: sameDate,
      dateOfPayment: sameDate,
    };

    const result = await updateInvoice(updateInput);

    expect(result.dateOfPayment).toEqual(sameDate);
    expect(result.dateIssued).toEqual(sameDate);
  });

  it("should handle repository errors gracefully", async () => {
    mockRepository.update = vi
      .fn()
      .mockRejectedValue(new Error("Database error"));

    const updateInvoice = updateInvoiceUseCase(mockRepository);
    const updateInput: UpdateInvoiceInput = {
      id: existingInvoice.id,
      clientName: "Updated Client",
    };

    await expect(updateInvoice(updateInput)).rejects.toThrow("Database error");
  });
});

