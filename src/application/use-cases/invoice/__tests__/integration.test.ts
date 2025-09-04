import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createInvoiceUseCase } from "../create-invoice.use-case";
import { getAllInvoicesUseCase } from "../get-all-invoices.use-case";
import { getInvoiceUseCase } from "../get-invoice.use-case";
import { updateInvoiceUseCase } from "../update-invoice.use-case";
import { deleteInvoiceUseCase } from "../delete-invoice.use-case";
import {
  createInvoiceMockRepository,
  resetMockRepository,
} from "../../../../infrastructure/repositories/invoice.mock.repository";

describe("Invoice Use Cases Integration Tests", () => {
  let mockRepository: ReturnType<typeof createInvoiceMockRepository>;

  beforeEach(() => {
    resetMockRepository();
    mockRepository = createInvoiceMockRepository();
  });

  it("should perform full CRUD operations successfully", async () => {
    const createInvoice = createInvoiceUseCase(mockRepository);
    const getAllInvoices = getAllInvoicesUseCase(mockRepository);
    const getInvoice = getInvoiceUseCase(mockRepository);
    const updateInvoice = updateInvoiceUseCase(mockRepository);
    const deleteInvoice = deleteInvoiceUseCase(mockRepository);

    // Create
    const createdInvoice = await createInvoice({
      clientName: "Integration Test Client",
      dateIssued: new Date("2024-01-01"),
      vatRate: 20,
    });

    expect(createdInvoice.id).toBeDefined();
    expect(createdInvoice.clientName).toBe("Integration Test Client");

    // Read
    const retrievedInvoice = await getInvoice(createdInvoice.id);
    expect(retrievedInvoice).toEqual(createdInvoice);

    // Update
    const updatedInvoice = await updateInvoice({
      id: createdInvoice.id,
      clientName: "Updated Integration Client",
      vatRate: 25,
    });

    expect(updatedInvoice.clientName).toBe("Updated Integration Client");
    expect(updatedInvoice.vatRate).toBe(25);

    // Verify update
    const allInvoices = await getAllInvoices();
    expect(allInvoices).toHaveLength(1);
    expect(allInvoices[0].clientName).toBe("Updated Integration Client");

    // Delete
    await deleteInvoice(createdInvoice.id);

    // Verify deletion
    const finalInvoices = await getAllInvoices();
    expect(finalInvoices).toHaveLength(0);

    const deletedInvoice = await getInvoice(createdInvoice.id);
    expect(deletedInvoice).toBeNull();
  });

  it("should handle multiple invoices correctly", async () => {
    const createInvoice = createInvoiceUseCase(mockRepository);
    const getAllInvoices = getAllInvoicesUseCase(mockRepository);
    const deleteInvoice = deleteInvoiceUseCase(mockRepository);

    // Create multiple invoices
    const invoice1 = await createInvoice({
      clientName: "Client A",
      dateIssued: new Date("2024-01-01"),
      vatRate: 20,
    });

    const invoice2 = await createInvoice({
      clientName: "Client B",
      dateIssued: new Date("2024-01-02"),
      vatRate: 10,
    });

    const invoice3 = await createInvoice({
      clientName: "Client C",
      dateIssued: new Date("2024-01-03"),
      vatRate: 15,
    });

    // Verify all invoices exist
    let allInvoices = await getAllInvoices();
    expect(allInvoices).toHaveLength(3);

    // Delete middle invoice
    await deleteInvoice(invoice2.id);

    // Verify remaining invoices
    allInvoices = await getAllInvoices();
    expect(allInvoices).toHaveLength(2);
    expect(allInvoices.map((inv) => inv.clientName)).toEqual([
      "Client A",
      "Client C",
    ]);

    // Delete remaining invoices
    await deleteInvoice(invoice1.id);
    await deleteInvoice(invoice3.id);

    // Verify all deleted
    allInvoices = await getAllInvoices();
    expect(allInvoices).toHaveLength(0);
  });
});
