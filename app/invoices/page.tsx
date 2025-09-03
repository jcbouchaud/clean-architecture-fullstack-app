import { Invoice } from "@/src/entities/invoice";
import { createGetAllInvoicesController } from "@/src/controllers/invoice/get-all-invoices.controller";
import { createInvoiceMockRepository } from "@/src/infrastructure/repositories/invoice.mock.repository";
import InvoiceActions from "./_components/invoice-actions";
import InvoiceRow from "./_components/invoice-row";

async function getInvoices(): Promise<Invoice[]> {
  const repository = createInvoiceMockRepository();
  const controller = createGetAllInvoicesController(repository);
  await new Promise((resolve) => setTimeout(resolve, 500));
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

      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date Issued
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                VAT Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <InvoiceRow key={invoice.id} invoice={invoice} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
