import {
  Invoice,
  CreateInvoiceInput,
  UpdateInvoiceInput,
} from "@/src/entities/invoice";

// Supabase client abstraction

export interface IInvoiceRepository {
  create(input: CreateInvoiceInput): Promise<Invoice>;
  findById(id: string): Promise<Invoice | null>;
  findAll(): Promise<Invoice[]>;
  update(input: UpdateInvoiceInput): Promise<Invoice>;
  delete(id: string): Promise<void>;
}

// Repository factory function type - no parameters needed
export type CreateInvoiceRepository = () => IInvoiceRepository;
