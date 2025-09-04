import { IInvoiceRepository } from "@/src/application/repositories/invoice.repository.interface";
import {
  Invoice,
  CreateInvoiceInput,
  UpdateInvoiceInput,
} from "@/src/entities/invoice";
import { Cookies, createClient } from "../supabase/utils";

export const createInvoiceRepository = (
  cookies: Cookies
): IInvoiceRepository => {
  const supabaseClient = createClient(cookies);

  return {
    async create(input: CreateInvoiceInput): Promise<Invoice> {
      const { clientName, dateIssued, vatRate, attachment } = input;
      const { data, error } = await supabaseClient
        .from("invoices")
        .insert([
          {
            client_name: clientName,
            date_issued: dateIssued.toISOString(),
            vat_rate: vatRate,
            attachment: attachment,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        clientName: data.client_name,
        dateIssued: new Date(data.date_issued),
        vatRate: data.vat_rate,
        attachment: data.attachment || undefined,
      };
    },

    async findById(id: string): Promise<Invoice | null> {
      const { data, error } = await supabaseClient
        .from("invoices")
        .select()
        .eq("id", id)
        .single();

      if (error) throw error;
      return {
        id: data.id,
        clientName: data.client_name,
        dateIssued: new Date(data.date_issued),
        vatRate: data.vat_rate,
        attachment: data.attachment || undefined,
      };
    },

    async findAll(): Promise<Invoice[]> {
      const { data, error } = await supabaseClient
        .from("invoices")
        .select()
        .order("date_issued", { ascending: false });

      if (error) throw error;
      return data.map((invoice) => ({
        id: invoice.id,
        clientName: invoice.client_name,
        dateIssued: new Date(invoice.date_issued),
        vatRate: invoice.vat_rate,
        attachment: invoice.attachment || undefined,
      }));
    },

    async update(input: UpdateInvoiceInput): Promise<Invoice> {
      const { id, ...updateData } = input;
      const { data, error } = await supabaseClient
        .from("invoices")
        .update({
          client_name: updateData.clientName,
          date_issued: updateData.dateIssued?.toISOString(),
          vat_rate: updateData.vatRate,
          attachment: updateData.attachment,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        clientName: data.client_name,
        dateIssued: new Date(data.date_issued),
        vatRate: data.vat_rate,
        attachment: data.attachment || undefined,
      };
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
