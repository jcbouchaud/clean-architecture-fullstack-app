import { IInvoiceRepository } from "@/src/application/repositories/invoice.repository.interface";
import {
  Invoice,
  CreateInvoiceInput,
  UpdateInvoiceInput,
} from "@/src/entities/invoice";

// Global state - shared across all instances
let globalInvoices: Invoice[] = [
  {
    id: "1",
    clientName: "Client 1",
    dateIssued: new Date("2024-01-01"),
    vatRate: 20,
  },
];
let globalNextId = 1;

// Repository factory function
export const createInvoiceMockRepository = (): IInvoiceRepository => {
  // Pure functions for invoice operations
  const generateId = (): string => `INV-${globalNextId++}`;

  const findInvoiceById = (
    id: string,
    invoiceList: Invoice[]
  ): Invoice | null => invoiceList.find((invoice) => invoice.id === id) || null;

  const findInvoiceIndexById = (id: string, invoiceList: Invoice[]): number =>
    invoiceList.findIndex((invoice) => invoice.id === id);

  // Return repository object
  return {
    async create(input: CreateInvoiceInput): Promise<Invoice> {
      const invoice: Invoice = {
        id: generateId(),
        ...input,
      };
      globalInvoices = [...globalInvoices, invoice];
      return invoice;
    },

    async findById(id: string): Promise<Invoice | null> {
      return findInvoiceById(id, globalInvoices);
    },

    async findAll(): Promise<Invoice[]> {
      return [...globalInvoices];
    },

    async update(input: UpdateInvoiceInput): Promise<Invoice> {
      const index = findInvoiceIndexById(input.id, globalInvoices);
      if (index === -1) {
        throw new Error("Invoice not found");
      }

      const updatedInvoice = { ...globalInvoices[index], ...input };
      globalInvoices = [
        ...globalInvoices.slice(0, index),
        updatedInvoice,
        ...globalInvoices.slice(index + 1),
      ];
      return updatedInvoice;
    },

    async delete(id: string): Promise<void> {
      const index = findInvoiceIndexById(id, globalInvoices);
      if (index === -1) {
        throw new Error("Invoice not found");
      }
      globalInvoices = globalInvoices.filter((_, i) => i !== index);
    },
  };
};

// Utility functions for testing and development
export const resetMockRepository = (): void => {
  globalInvoices = [];
  globalNextId = 1;
};

export const seedMockRepository = (invoices: Invoice[]): void => {
  globalInvoices = [...invoices];
  globalNextId = invoices.length + 1;
};

export const getMockRepositoryState = (): {
  invoices: Invoice[];
  nextId: number;
} => {
  return { invoices: [...globalInvoices], nextId: globalNextId };
};
