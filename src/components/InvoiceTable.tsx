import { Download, ExternalLink, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Invoice } from "@/pages/Index";

interface InvoiceTableProps {
  invoices: Invoice[];
  onDownload: (invoice: Invoice) => void;
}

export const InvoiceTable = ({ invoices, onDownload }: InvoiceTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: 'Paid' | 'Unpaid') => {
    return (
      <Badge 
        variant={status === 'Paid' ? 'default' : 'destructive'}
        className={status === 'Paid' ? 'bg-status-paid hover:bg-status-paid/80' : 'bg-status-unpaid hover:bg-status-unpaid/80'}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-table-header">
            <TableHead className="font-semibold">Invoice ID</TableHead>
            <TableHead className="font-semibold">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </div>
            </TableHead>
            <TableHead className="font-semibold">
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4" />
                <span>Total Amount</span>
              </div>
            </TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Billing Account</TableHead>
            <TableHead className="font-semibold">Billing Profile</TableHead>
            <TableHead className="font-semibold">Tenant</TableHead>
            <TableHead className="font-semibold text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium text-primary">
                {invoice.id}
              </TableCell>
              <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
              <TableCell className="font-semibold">
                {formatCurrency(invoice.totalAmount)}
              </TableCell>
              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {invoice.billingAccountId}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {invoice.billingProfileId}
              </TableCell>
              <TableCell className="text-sm font-medium">
                {invoice.tenantName || 'N/A'}
              </TableCell>
              <TableCell>
                <div className="flex justify-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDownload(invoice)}
                    disabled={!invoice.downloadUrl}
                    className="h-8 px-2"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                  {invoice.downloadUrl && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(invoice.downloadUrl, '_blank')}
                      className="h-8 px-2"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};