import { IInvoiceRepository } from "@/src/application/repositories/invoice.repository.interface";
import {
  Invoice,
  CreateInvoiceInput,
  UpdateInvoiceInput,
} from "@/src/entities/invoice";

// Repository factory function
export const createInvoiceMockRepository = (): IInvoiceRepository => {
  // In-memory storage (in a real app, this would use a database)
  let invoices: Invoice[] = [];
  let nextId = 1;

  // Pure functions for invoice operations
  const generateId = (): string => `INV-${nextId++}`;

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
      invoices = [...invoices, invoice];
      return invoice;
    },

    async findById(id: string): Promise<Invoice | null> {
      return findInvoiceById(id, invoices);
    },

    async findAll(): Promise<Invoice[]> {
      return [...invoices];
    },

    async update(input: UpdateInvoiceInput): Promise<Invoice> {
      const index = findInvoiceIndexById(input.id, invoices);
      if (index === -1) {
        throw new Error("Invoice not found");
      }

      const updatedInvoice = { ...invoices[index], ...input };
      invoices = [
        ...invoices.slice(0, index),
        updatedInvoice,
        ...invoices.slice(index + 1),
      ];
      return updatedInvoice;
    },

    async delete(id: string): Promise<void> {
      const index = findInvoiceIndexById(id, invoices);
      if (index === -1) {
        throw new Error("Invoice not found");
      }
      invoices = invoices.filter((_, i) => i !== index);
    },
  };
};
