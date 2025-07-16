export interface Invoice {
  id: string;
  invoiceDate: string;
  totalAmount: number;
  status: 'Paid' | 'Unpaid';
  downloadUrl?: string;
  billingAccountId: string;
  billingProfileId: string;
  tenantName?: string;
}

export interface SearchFilters {
  invoiceNumber?: string;
  amount?: number;
  dateFrom?: Date;
  dateTo?: Date;
}