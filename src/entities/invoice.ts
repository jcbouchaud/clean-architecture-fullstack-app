export interface Invoice {
  id: string;
  dateIssued: Date;
  dateOfPayment?: Date; // Optional since payment might not have happened yet
  vatRate: number;
  clientName: string;
  attachment?: string; // URL or file path to the attachment
}

export interface CreateInvoiceInput {
  dateIssued: Date;
  dateOfPayment?: Date;
  vatRate: number;
  clientName: string;
  attachment?: string;
}

export interface UpdateInvoiceInput {
  id: string;
  dateIssued?: Date;
  dateOfPayment?: Date;
  vatRate?: number;
  clientName?: string;
  attachment?: string;
}


