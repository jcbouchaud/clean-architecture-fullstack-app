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
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Create New Invoice
      </h3>
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label
              htmlFor="clientName"
              className="text-sm font-medium text-foreground"
            >
              Client Name
            </Label>
            <Input
              id="clientName"
              type="text"
              name="clientName"
              required
              placeholder="Enter client name"
              className="border-border focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="dateIssued"
              className="text-sm font-medium text-foreground"
            >
              Date Issued
            </Label>
            <Input
              id="dateIssued"
              type="date"
              name="dateIssued"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
              className="border-border focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="vatRate"
              className="text-sm font-medium text-foreground"
            >
              VAT Rate (%)
            </Label>
            <Input
              id="vatRate"
              type="number"
              name="vatRate"
              min="0"
              max="100"
              step="0.1"
              required
              defaultValue="20"
              className="border-border focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="attachment"
              className="text-sm font-medium text-foreground"
            >
              Attachment URL
            </Label>
            <Input
              id="attachment"
              type="url"
              name="attachment"
              placeholder="https://example.com/document.pdf"
              className="border-border focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="gradient-purple hover:opacity-90 transition-opacity"
          >
            Create Invoice
          </Button>
        </div>
      </form>
    </div>
  );
}
