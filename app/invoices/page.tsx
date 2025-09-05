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
    <div className="min-h-screen bg-background gradient-surface">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Invoices
            </h1>
            <p className="text-muted-foreground">
              Manage and track your invoices
            </p>
          </div>

          <InvoiceActions />

          <div className="bg-card rounded-lg shadow-sm border border-border p-6 gradient-elevated">
            <InvoicesDataTable invoices={invoices} />
          </div>
        </div>
      </div>
    </div>
  );
}
