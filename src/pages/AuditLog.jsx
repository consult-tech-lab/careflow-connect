import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ArrowRight, Loader2, History, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AuditLog() {
  const { data: transfers = [], isLoading } = useQuery({
    queryKey: ["transfers"],
    queryFn: () => base44.entities.TransferHistory.list("-created_date"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground flex items-center gap-2">
          <History className="w-6 h-6 text-primary" />
          Transfer History
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Audit log of all patient reassignments
        </p>
      </div>

      {transfers.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <History className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No transfers recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transfers.map((t) => (
            <div key={t.id} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{t.patient_name}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-sm text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      <span>{t.previous_care_manager}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    <span className="font-medium text-foreground">{t.new_care_manager}</span>
                  </div>
                  {t.reason_notes && (
                    <p className="text-xs text-muted-foreground mt-2 bg-muted/50 rounded-md px-3 py-1.5">
                      {t.reason_notes}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <Badge variant="secondary" className="text-xs">
                    {t.reason}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {t.transfer_date
                      ? new Date(t.transfer_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : new Date(t.created_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}