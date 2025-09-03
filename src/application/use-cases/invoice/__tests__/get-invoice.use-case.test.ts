import { describe, it, expect, beforeEach, vi } from "vitest";
import { getInvoiceUseCase } from "../get-invoice.use-case";
import { createInvoiceUseCase } from "../create-invoice.use-case";
import { createInvoiceMockRepository } from "../../../../infrastructure/repositories/invoice.mock.repository";

describe("Get Invoice Use Case", () => {
  let mockRepository: ReturnType<typeof createInvoiceMockRepository>;

  beforeEach(() => {
    mockRepository = createInvoiceMockRepository();
  });

  it("should return invoice when valid ID is provided", async () => {
    const createInvoice = createInvoiceUseCase(mockRepository);
    const getInvoice = getInvoiceUseCase(mockRepository);

    const createdInvoice = await createInvoice({
      clientName: "Test Client",
      dateIssued: new Date("2024-01-01"),
      vatRate: 20,
    });

    const result = await getInvoice(createdInvoice.id);

    expect(result).toEqual(createdInvoice);
  });

  it("should return null when invoice is not found", async () => {
    const getInvoice = getInvoiceUseCase(mockRepository);
    const result = await getInvoice("non-existent-id");

    expect(result).toBeNull();
  });

  it("should throw error for empty ID", async () => {
    const getInvoice = getInvoiceUseCase(mockRepository);

    await expect(getInvoice("")).rejects.toThrow("Invoice ID cannot be empty");
  });

  it("should throw error for whitespace-only ID", async () => {
    const getInvoice = getInvoiceUseCase(mockRepository);

    await expect(getInvoice("   ")).rejects.toThrow(
      "Invoice ID cannot be empty"
    );
  });

  it("should handle repository errors gracefully", async () => {
    mockRepository.findById = vi
      .fn()
      .mockRejectedValue(new Error("Database error"));

    const getInvoice = getInvoiceUseCase(mockRepository);

    await expect(getInvoice("test-id")).rejects.toThrow("Database error");
  });
});

