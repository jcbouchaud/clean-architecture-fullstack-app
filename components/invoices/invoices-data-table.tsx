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
        <InvoiceForms key={`forms-${invoice.id}`} invoice={invoice} />
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
          className="border-0 p-0 h-auto focus-visible:ring-0"
        />
      </TableCell>
      <TableCell>
        <Input
          name="dateIssued"
          type="date"
          defaultValue={formatDate(invoice.dateIssued)}
          form={`update-form-${invoice.id}`}
          className="border-0 p-0 h-auto focus-visible:ring-0"
        />
      </TableCell>
      <TableCell>
        <Input
          name="vatRate"
          type="number"
          step="0.01"
          defaultValue={invoice.vatRate}
          form={`update-form-${invoice.id}`}
          className="border-0 p-0 h-auto focus-visible:ring-0"
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
          className="border-0 p-0 h-auto focus-visible:ring-0"
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
            variant="outline"
            size="sm"
            form={`update-form-${invoice.id}`}
          >
            Save
          </Button>
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            form={`delete-form-${invoice.id}`}
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function InvoiceForms({ invoice }: { invoice: Invoice }) {
  const [updateState, formUpdateAction] = useActionState(
    updateInvoice,
    initialState
  );
  const [deleteState, formDeleteAction] = useActionState(
    deleteInvoice,
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

  useEffect(() => {
    if (deleteState?.error) {
      toast.error(deleteState.error);
    } else if (deleteState?.success) {
      toast.success("Invoice deleted successfully!");
    }
  }, [deleteState, toast]);

  return (
    <>
      <form
        id={`update-form-${invoice.id}`}
        action={formUpdateAction}
        className="hidden"
      >
        <input type="hidden" name="id" value={invoice.id} />
      </form>
      <form
        id={`delete-form-${invoice.id}`}
        action={formDeleteAction}
        className="hidden"
      >
        <input type="hidden" name="id" value={invoice.id} />
      </form>
    </>
  );
}
