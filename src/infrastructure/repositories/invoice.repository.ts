import { IInvoiceRepository } from "@/src/application/repositories/invoice.repository.interface";
import {
  Invoice,
  CreateInvoiceInput,
  UpdateInvoiceInput,
} from "@/src/entities/invoice";
import { createClient } from "@supabase/supabase-js";

// Repository factory function
export const createInvoiceRepository = (): IInvoiceRepository => {
  // Create Supabase client internally
  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return {
    async create(input: CreateInvoiceInput): Promise<Invoice> {
      const { data, error } = await supabaseClient
        .from("invoices")
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async findById(id: string): Promise<Invoice | null> {
      const { data, error } = await supabaseClient
        .from("invoices")
        .select()
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },

    async findAll(): Promise<Invoice[]> {
      const { data, error } = await supabaseClient
        .from("invoices")
        .select()
        .order("dateIssued", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    // TODO: Implement database query using dbSession

    async update(input: UpdateInvoiceInput): Promise<Invoice> {
      const { id, ...updateData } = input;
      const { data, error } = await supabaseClient
        .from("invoices")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    async delete(id: string): Promise<void> {
      const { error } = await supabaseClient
        .from("invoices")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
  };
};
