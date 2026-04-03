import { useMemo } from "react";
import StatusBadge from "./StatusBadge";
import RiskBadge from "./RiskBadge";
import { User, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AssignmentView({ patients, onClickPatient }) {
  const grouped = useMemo(() => {
    const map = {};
    patients.forEach((p) => {
      if (!map[p.assigned_care_manager]) {
        map[p.assigned_care_manager] = { role: p.role, patients: [] };
      }
      map[p.assigned_care_manager].patients.push(p);
    });
    return Object.entries(map).sort((a, b) => b[1].patients.length - a[1].patients.length);
  }, [patients]);

  return (
    <div className="space-y-4">
      {grouped.map(([manager, data]) => {
        const completed = data.patients.filter((p) => p.status === "Completed").length;
        const highPriority = data.patients.filter((p) => p.status === "High Priority").length;

        return (
          <div key={manager} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{manager}</h3>
                    <p className="text-xs text-muted-foreground">
                      {data.role === "RN Case Manager" ? "RN Case Manager" : "Social Worker"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">{data.patients.length} patients</Badge>
                  {completed > 0 && (
                    <Badge className="text-xs bg-status-completed text-status-completed-text border-0">
                      {completed} done
                    </Badge>
                  )}
                  {highPriority > 0 && (
                    <Badge className="text-xs bg-status-high-priority text-status-high-priority-text border-0">
                      {highPriority} urgent
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="divide-y divide-border">
              {data.patients.map((patient) => (
                <div
                  key={patient.id}
                  className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => onClickPatient(patient)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{patient.patient_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.floor} · Room {patient.room}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={patient.status} />
                    <RiskBadge risk={patient.risk_score} />
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {grouped.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No patients match your filters.
        </div>
      )}
    </div>
  );
}