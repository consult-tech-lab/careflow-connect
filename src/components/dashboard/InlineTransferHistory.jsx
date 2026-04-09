import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, History, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { CARE_MANAGERS } from "../../lib/statusUtils";

const REASONS = ["Workload Balancing", "Coverage / Assistance", "Reassignment to New Team", "Other"];

export default function InlineTransferHistory() {
  const [expanded, setExpanded] = useState(false);
  const [filterManager, setFilterManager] = useState("");
  const [filterReason, setFilterReason] = useState("");

  const { data: transfers = [], isLoading } = useQuery({
    queryKey: ["transfers"],
    queryFn: () => base44.entities.TransferHistory.list("-created_date"),
    enabled: expanded,
  });

  const filtered = useMemo(() => {
    return transfers.filter((t) => {
      if (filterManager && t.new_care_manager !== filterManager && t.previous_care_manager !== filterManager) return false;
      if (filterReason && t.reason !== filterReason) return false;
      return true;
    });
  }, [transfers, filterManager, filterReason]);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <History className="w-4 h-4 text-primary" />
          Transfer History
          {transfers.length > 0 && (
            <Badge variant="secondary" className="text-xs">{transfers.length}</Badge>
          )}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="border-t border-border">
          {/* Filters */}
          <div className="p-4 bg-muted/20 flex gap-3 flex-wrap">
            <Select value={filterManager || "all"} onValueChange={(v) => setFilterManager(v === "all" ? "" : v)}>
              <SelectTrigger className="h-8 text-xs w-48">
                <SelectValue placeholder="Filter by Manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Managers</SelectItem>
                {CARE_MANAGERS.map((cm) => (
                  <SelectItem key={cm} value={cm}>{cm}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterReason || "all"} onValueChange={(v) => setFilterReason(v === "all" ? "" : v)}>
              <SelectTrigger className="h-8 text-xs w-48">
                <SelectValue placeholder="Filter by Reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                {REASONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(filterManager || filterReason) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => { setFilterManager(""); setFilterReason(""); }}
              >
                Clear
              </Button>
            )}
          </div>

          {/* Records */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No transfers found.</p>
          ) : (
            <div className="max-h-72 overflow-y-auto divide-y divide-border">
              {filtered.map((t) => (
                <div key={t.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap text-sm">
                    <span className="font-medium text-foreground">{t.patient_name}</span>
                    <span className="text-muted-foreground text-xs">{t.previous_care_manager}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-xs font-medium text-foreground">{t.new_care_manager}</span>
                    {t.reason_notes && (
                      <span className="text-xs text-muted-foreground truncate max-w-[180px]">— {t.reason_notes}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="secondary" className="text-xs">{t.reason}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(t.transfer_date || t.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}