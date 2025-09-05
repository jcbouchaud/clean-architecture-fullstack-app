import { Invoice } from "@/src/entities/invoice";
import { createGetAllInvoicesController } from "@/src/controllers/invoice/get-all-invoices.controller";
import InvoiceActions from "../../components/invoices/invoice-actions";
import InvoicesDataTable from "../../components/invoices/invoices-data-table";
import { createInvoiceRepository } from "@/src/infrastructure/repositories/invoice.repository";
import { createClient } from "../../lib/client";

async function getInvoices(): Promise<Invoice[]> {
  const client = await createClient();
  const repository = createInvoiceRepository(client);
  const controller = createGetAllInvoicesController(repository);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await controller();
}

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <>
      <InvoiceActions />
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 gradient-elevated">
        <InvoicesDataTable invoices={invoices} />
      </div>
    </>
  );
}
