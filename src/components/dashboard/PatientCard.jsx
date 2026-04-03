import { Checkbox } from "@/components/ui/checkbox";
import StatusBadge from "./StatusBadge";
import RiskBadge from "./RiskBadge";
import { User, MapPin, CreditCard } from "lucide-react";

export default function PatientCard({ patient, isSelected, onSelect, onClick }) {
  return (
    <div
      className={`bg-card rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
        isSelected
          ? "border-primary ring-2 ring-primary/20 shadow-md"
          : "border-border hover:border-primary/30"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(patient.id)}
            />
          </div>
          <div className="flex-1 min-w-0" onClick={() => onClick(patient)}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {patient.patient_name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  MRN: {patient.mrn} · Room {patient.room}
                </p>
              </div>
              <RiskBadge risk={patient.risk_score} />
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              <StatusBadge status={patient.status} />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                <span className="truncate">{patient.assigned_care_manager}</span>
                <span className="text-muted-foreground/50">·</span>
                <span>{patient.role === "RN Case Manager" ? "RN" : "SW"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{patient.floor}</span>
                <span className="text-muted-foreground/50">·</span>
                <CreditCard className="w-3 h-3" />
                <span>{patient.payer}</span>
              </div>
            </div>

            {patient.notes && (
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2 border-t border-border pt-2">
                {patient.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}