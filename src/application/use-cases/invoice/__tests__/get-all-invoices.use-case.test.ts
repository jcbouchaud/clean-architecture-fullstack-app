import { describe, it, expect, beforeEach, vi } from "vitest";
import { getAllInvoicesUseCase } from "../get-all-invoices.use-case";
import { createInvoiceUseCase } from "../create-invoice.use-case";
import {
  createInvoiceMockRepository,
  resetMockRepository,
} from "../../../../infrastructure/repositories/invoice.mock.repository";

describe("Get All Invoices Use Case", () => {
  let mockRepository: ReturnType<typeof createInvoiceMockRepository>;

  beforeEach(() => {
    mockRepository = createInvoiceMockRepository();
    resetMockRepository();
  });

  it("should return empty array when no invoices exist", async () => {
    const getAllInvoices = getAllInvoicesUseCase(mockRepository);
    const result = await getAllInvoices();

    expect(result).toEqual([]);
  });

  it("should return all created invoices", async () => {
    const createInvoice = createInvoiceUseCase(mockRepository);
    const getAllInvoices = getAllInvoicesUseCase(mockRepository);

    // Create multiple invoices
    await createInvoice({
      clientName: "Client 1",
      dateIssued: new Date("2024-01-01"),
      vatRate: 20,
    });

    await createInvoice({
      clientName: "Client 2",
      dateIssued: new Date("2024-01-02"),
      vatRate: 10,
    });

    const result = await getAllInvoices();

    expect(result).toHaveLength(2);
    expect(result[0].clientName).toBe("Client 1");
    expect(result[1].clientName).toBe("Client 2");
  });

  it("should handle repository errors gracefully", async () => {
    mockRepository.findAll = vi
      .fn()
      .mockRejectedValue(new Error("Database error"));
    const getAllInvoices = getAllInvoicesUseCase(mockRepository);

    await expect(getAllInvoices()).rejects.toThrow("Database error");
  });
});
