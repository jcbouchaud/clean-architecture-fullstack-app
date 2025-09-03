import { Invoice } from "@/src/entities/invoice";
import { updateInvoice, deleteInvoice } from "../actions";

interface InvoiceRowProps {
  invoice: Invoice;
}

export default function InvoiceRow({ invoice }: InvoiceRowProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {invoice.clientName}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {new Date(invoice.dateIssued).toLocaleDateString()}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {invoice.vatRate}%
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            invoice.dateOfPayment
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {invoice.dateOfPayment ? "Paid" : "Pending"}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <form action={updateInvoice} className="inline">
            <input type="hidden" name="id" value={invoice.id} />
            <input type="hidden" name="clientName" value={invoice.clientName} />
            <input
              type="hidden"
              name="dateIssued"
              value={formatDate(invoice.dateIssued)}
            />
            <input type="hidden" name="vatRate" value={invoice.vatRate} />
            <input
              type="hidden"
              name="attachment"
              value={invoice.attachment || ""}
            />
            <button
              type="submit"
              className="text-indigo-600 hover:text-indigo-900"
            >
              Edit
            </button>
          </form>

          <form action={deleteInvoice} className="inline">
            <input type="hidden" name="id" value={invoice.id} />
            <button type="submit" className="text-red-600 hover:text-red-900">
              Delete
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}
