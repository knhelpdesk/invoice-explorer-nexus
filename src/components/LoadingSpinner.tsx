import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <div>
          <h3 className="font-medium text-foreground">Searching Invoices</h3>
          <p className="text-sm text-muted-foreground">
            Querying Microsoft Graph API across multiple tenants...
          </p>
        </div>
      </div>
    </div>
  );
};