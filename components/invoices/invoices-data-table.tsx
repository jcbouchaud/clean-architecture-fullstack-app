"use client";

import { useActionState, useEffect } from "react";
import { Invoice } from "@/src/entities/invoice";
import { updateInvoice, deleteInvoice } from "../../app/invoices/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/hooks/use-toast";
import { Save, Trash2 } from "lucide-react";

interface InvoicesDataTableProps {
  invoices: Invoice[];
}

const initialState = {
  error: "",
  code: "",
  success: false,
};

export default function InvoicesDataTable({
  invoices,
}: InvoicesDataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Date Issued</TableHead>
            <TableHead>VAT Rate</TableHead>
            <TableHead>Payment Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <InvoiceTableRow key={invoice.id} invoice={invoice} />
          ))}
        </TableBody>
      </Table>
      {/* Forms outside the table */}
      {invoices.map((invoice) => (
        <InvoiceForms key={`forms-${invoice.id}`} invoiceId={invoice.id} />
      ))}
    </div>
  );
}

function InvoiceTableRow({ invoice }: { invoice: Invoice }) {
  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const isPaid = !!invoice.dateOfPayment;

  return (
    <TableRow>
      <TableCell className="font-medium">
        <Input
          name="clientName"
          defaultValue={invoice.clientName}
          form={`update-form-${invoice.id}`}
        />
      </TableCell>
      <TableCell>
        <Input
          name="dateIssued"
          type="date"
          defaultValue={formatDate(invoice.dateIssued)}
          form={`update-form-${invoice.id}`}
        />
      </TableCell>
      <TableCell>
        <Input
          name="vatRate"
          type="number"
          step="0.01"
          defaultValue={invoice.vatRate}
          form={`update-form-${invoice.id}`}
        />
      </TableCell>
      <TableCell>
        <Input
          name="dateOfPayment"
          type="date"
          defaultValue={
            invoice.dateOfPayment ? formatDate(invoice.dateOfPayment) : ""
          }
          form={`update-form-${invoice.id}`}
        />
      </TableCell>
      <TableCell>
        <Badge variant={isPaid ? "default" : "secondary"}>
          {isPaid ? "Paid" : "Pending"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            form={`update-form-${invoice.id}`}
            title="Save changes"
          >
            <Save className="h-4 w-4 text-primary" />
          </Button>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            form={`delete-form-${invoice.id}`}
            title="Delete invoice"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function InvoiceUpdateForm({ invoiceId }: { invoiceId: string }) {
  const [updateState, formUpdateAction] = useActionState(
    updateInvoice,
    initialState
  );
  const { toast } = useToast();

  useEffect(() => {
    if (updateState?.error) {
      toast.error(updateState.error);
    } else if (updateState?.success) {
      toast.success("Invoice updated successfully!");
    }
  }, [updateState, toast]);

  return (
    <form
      id={`update-form-${invoiceId}`}
      action={formUpdateAction}
      className="hidden"
    >
      <input type="hidden" name="id" value={invoiceId} />
    </form>
  );
}

function InvoiceDeleteForm({ invoiceId }: { invoiceId: string }) {
  const [deleteState, formDeleteAction] = useActionState(
    deleteInvoice,
    initialState
  );
  const { toast } = useToast();

  useEffect(() => {
    if (deleteState?.error) {
      toast.error(deleteState.error);
    } else if (deleteState?.success) {
      toast.success("Invoice deleted successfully!");
    }
  }, [deleteState, toast]);

  return (
    <form
      id={`delete-form-${invoiceId}`}
      action={formDeleteAction}
      className="hidden"
    >
      <input type="hidden" name="id" value={invoiceId} />
    </form>
  );
}

function InvoiceForms({ invoiceId }: { invoiceId: string }) {
  return (
    <>
      <InvoiceUpdateForm invoiceId={invoiceId} />
      <InvoiceDeleteForm invoiceId={invoiceId} />
    </>
  );
}
