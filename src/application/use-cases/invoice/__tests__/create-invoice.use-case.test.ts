import { describe, it, expect, beforeEach, vi } from "vitest";
import { createInvoiceUseCase } from "../create-invoice.use-case";
import { createInvoiceMockRepository } from "../../../../infrastructure/repositories/invoice.mock.repository";
import { CreateInvoiceInput } from "@/src/entities/invoice";

describe("Create Invoice Use Case", () => {
  let mockRepository: ReturnType<typeof createInvoiceMockRepository>;

  beforeEach(() => {
    mockRepository = createInvoiceMockRepository();
  });

  it("should create an invoice with valid input", async () => {
    const createInvoice = createInvoiceUseCase(mockRepository);
    const input: CreateInvoiceInput = {
      clientName: "Test Client",
      dateIssued: new Date("2024-01-01"),
      vatRate: 20,
      attachment: "test.pdf",
    };

    const result = await createInvoice(input);

    expect(result).toMatchObject({
      clientName: "Test Client",
      dateIssued: new Date("2024-01-01"),
      vatRate: 20,
      attachment: "test.pdf",
    });
    expect(result.id).toBeDefined();
    expect(result.id).toMatch(/^INV-\d+$/);
  });

  it("should create an invoice without optional fields", async () => {
    const createInvoice = createInvoiceUseCase(mockRepository);
    const input: CreateInvoiceInput = {
      clientName: "Test Client",
      dateIssued: new Date("2024-01-01"),
      vatRate: 0,
    };

    const result = await createInvoice(input);

    expect(result).toMatchObject({
      clientName: "Test Client",
      dateIssued: new Date("2024-01-01"),
      vatRate: 0,
    });
    expect(result.dateOfPayment).toBeUndefined();
    expect(result.attachment).toBeUndefined();
  });

  it("should throw error for invalid VAT rate (negative)", async () => {
    const createInvoice = createInvoiceUseCase(mockRepository);
    const input: CreateInvoiceInput = {
      clientName: "Test Client",
      dateIssued: new Date("2024-01-01"),
      vatRate: -5,
    };

    await expect(createInvoice(input)).rejects.toThrow(
      "VAT rate must be between 0 and 100"
    );
  });

  it("should throw error for invalid VAT rate (over 100)", async () => {
    const createInvoice = createInvoiceUseCase(mockRepository);
    const input: CreateInvoiceInput = {
      clientName: "Test Client",
      dateIssued: new Date("2024-01-01"),
      vatRate: 150,
    };

    await expect(createInvoice(input)).rejects.toThrow(
      "VAT rate must be between 0 and 100"
    );
  });

  it("should throw error for empty client name", async () => {
    const createInvoice = createInvoiceUseCase(mockRepository);
    const input: CreateInvoiceInput = {
      clientName: "",
      dateIssued: new Date("2024-01-01"),
      vatRate: 20,
    };

    await expect(createInvoice(input)).rejects.toThrow(
      "Client name cannot be empty"
    );
  });

  it("should throw error for whitespace-only client name", async () => {
    const createInvoice = createInvoiceUseCase(mockRepository);
    const input: CreateInvoiceInput = {
      clientName: "   ",
      dateIssued: new Date("2024-01-01"),
      vatRate: 20,
    };

    await expect(createInvoice(input)).rejects.toThrow(
      "Client name cannot be empty"
    );
  });

  it("should throw error for future date issued", async () => {
    const createInvoice = createInvoiceUseCase(mockRepository);
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    const input: CreateInvoiceInput = {
      clientName: "Test Client",
      dateIssued: futureDate,
      vatRate: 20,
    };

    await expect(createInvoice(input)).rejects.toThrow(
      "Date issued cannot be in the future"
    );
  });

  it("should throw error when date of payment is before date issued", async () => {
    const createInvoice = createInvoiceUseCase(mockRepository);
    const input: CreateInvoiceInput = {
      clientName: "Test Client",
      dateIssued: new Date("2024-01-01"),
      dateOfPayment: new Date("2023-12-31"),
      vatRate: 20,
    };

    await expect(createInvoice(input)).rejects.toThrow(
      "Date of payment cannot be before date issued"
    );
  });

  it("should allow date of payment equal to date issued", async () => {
    const createInvoice = createInvoiceUseCase(mockRepository);
    const sameDate = new Date("2024-01-01");
    const input: CreateInvoiceInput = {
      clientName: "Test Client",
      dateIssued: sameDate,
      dateOfPayment: sameDate,
      vatRate: 20,
    };

    const result = await createInvoice(input);

    expect(result.dateOfPayment).toEqual(sameDate);
  });
});

