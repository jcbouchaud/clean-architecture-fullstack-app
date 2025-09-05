"use client";

import { useActionState, useEffect } from "react";
import { createInvoice } from "../../app/invoices/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";

const initialState = {
  error: "",
  code: "",
  success: false,
};

export default function InvoiceActions() {
  const [state, formAction] = useActionState(createInvoice, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.success) {
      toast.success("Invoice created successfully!");
    }
  }, [state, toast]);

  return (
    <div>
      <form action={formAction} className="space-y-4">
        <div className="flex space-x-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              type="text"
              name="clientName"
              required
              placeholder="Enter client name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateIssued">Date Issued</Label>
            <Input
              id="dateIssued"
              type="date"
              name="dateIssued"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vatRate">VAT Rate (%)</Label>
            <Input
              id="vatRate"
              type="number"
              name="vatRate"
              min="0"
              max="100"
              step="0.1"
              required
              defaultValue="20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment URL</Label>
            <Input
              id="attachment"
              type="url"
              name="attachment"
              placeholder="https://example.com/document.pdf"
            />
          </div>

          <Button type="submit">Create Invoice</Button>
        </div>
      </form>
    </div>
  );
}
