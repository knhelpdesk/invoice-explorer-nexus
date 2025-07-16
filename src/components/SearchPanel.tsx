import { useState } from "react";
import { Search, Calendar, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchFilters } from "@/pages/Index";

interface SearchPanelProps {
  onSearch: (filters: SearchFilters) => void;
  loading: boolean;
}

export const SearchPanel = ({ onSearch, loading }: SearchPanelProps) => {
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasFilters = Object.values(filters).some(value => value && typeof value === 'string' && value.trim() !== '');

  return (
    <Card className="shadow-sm border-2 border-search-highlight/20">
      <CardHeader className="bg-search-highlight/5">
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-primary" />
          <span>Search Invoice Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Invoice Number */}
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber" className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Invoice Number</span>
              </Label>
              <Input
                id="invoiceNumber"
                placeholder="e.g., INV-2024-001"
                value={filters.invoiceNumber || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Invoice Amount */}
            <div className="space-y-2">
              <Label htmlFor="invoiceAmount" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Amount</span>
              </Label>
              <Input
                id="invoiceAmount"
                type="number"
                step="0.01"
                placeholder="e.g., 1500.00"
                value={filters.invoiceAmount || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, invoiceAmount: e.target.value }))}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label htmlFor="dateFrom" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>From Date</span>
              </Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label htmlFor="dateTo" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>To Date</span>
              </Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                className="transition-all focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {hasFilters ? "Search filters applied" : "Enter search criteria above"}
            </div>
            <div className="flex space-x-3">
              {hasFilters && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  disabled={loading}
                >
                  Clear Filters
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading || !hasFilters}
                className="bg-primary hover:bg-primary-hover"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Invoices
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};