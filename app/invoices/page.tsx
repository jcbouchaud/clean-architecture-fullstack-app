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
  return await controller();
}

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <InvoiceActions />
      </div>

      <InvoicesDataTable invoices={invoices} />
    </div>
  );
}
