import { useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { SearchPanel } from "@/components/SearchPanel";
import { InvoiceTable } from "@/components/InvoiceTable";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

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
  invoiceAmount?: string;
  dateFrom?: string;
  dateTo?: string;
}

const Index = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (filters: SearchFilters) => {
    setLoading(true);
    setSearchPerformed(true);

    try {
      const queryParams = new URLSearchParams();
      if (filters.invoiceNumber) queryParams.append('invoiceNumber', filters.invoiceNumber);
      if (filters.invoiceAmount) queryParams.append('amount', filters.invoiceAmount);
      if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);

      const response = await fetch(`/api/invoices/search?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setInvoices(data.invoices || []);

      toast({
        title: "Search Complete",
        description: `Found ${data.invoices?.length || 0} invoices across ${data.tenantsSearched || 0} tenants`,
      });
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search Failed",
        description: "Unable to fetch invoices. Please check your connection and try again.",
        variant: "destructive",
      });
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (invoice: Invoice) => {
    if (!invoice.downloadUrl) {
      toast({
        title: "Download Unavailable",
        description: "No download URL available for this invoice.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/invoices/download/${invoice.id}`);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: `Invoice ${invoice.id} is downloading...`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Search Panel */}
          <SearchPanel onSearch={handleSearch} loading={loading} />

          {/* Results Section */}
          <div className="space-y-6">
            {loading && <LoadingSpinner />}
            
            {!loading && searchPerformed && (
              <div className="bg-card rounded-lg border shadow-sm">
                <div className="p-6 border-b bg-table-header">
                  <h2 className="text-xl font-semibold text-foreground">
                    Search Results
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {invoices.length === 0 
                      ? "No invoices found matching your criteria" 
                      : `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''} found`
                    }
                  </p>
                </div>
                
                {invoices.length > 0 && (
                  <InvoiceTable 
                    invoices={invoices} 
                    onDownload={handleDownload}
                  />
                )}
              </div>
            )}

            {!loading && !searchPerformed && (
              <div className="text-center py-12">
                <div className="bg-card rounded-lg border shadow-sm p-8">
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Office 365 Invoice Search
                  </h3>
                  <p className="text-muted-foreground">
                    Use the search filters above to find invoices across your Microsoft 365 tenants
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
