import { Checkbox } from "@/components/ui/checkbox";
import StatusBadge from "./StatusBadge";
import RiskBadge from "./RiskBadge";

export default function PatientTable({ patients, selectedIds, onSelect, onSelectAll, onClick }) {
  const allSelected = patients.length > 0 && patients.every((p) => selectedIds.includes(p.id));

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="py-3 px-4 text-left w-10">
                <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
              </th>
              <th className="py-3 px-4 text-left font-medium text-muted-foreground">Patient</th>
              <th className="py-3 px-4 text-left font-medium text-muted-foreground hidden md:table-cell">Care Manager</th>
              <th className="py-3 px-4 text-left font-medium text-muted-foreground hidden lg:table-cell">Floor</th>
              <th className="py-3 px-4 text-left font-medium text-muted-foreground hidden lg:table-cell">Payer</th>
              <th className="py-3 px-4 text-left font-medium text-muted-foreground">Status</th>
              <th className="py-3 px-4 text-left font-medium text-muted-foreground hidden sm:table-cell">Risk</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className={`border-b border-border last:border-0 transition-colors cursor-pointer hover:bg-muted/30 ${
                  selectedIds.includes(patient.id) ? "bg-primary/5" : ""
                }`}
              >
                <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(patient.id)}
                    onCheckedChange={() => onSelect(patient.id)}
                  />
                </td>
                <td className="py-3 px-4" onClick={() => onClick(patient)}>
                  <div>
                    <p className="font-medium text-foreground">{patient.patient_name}</p>
                    <p className="text-xs text-muted-foreground">MRN: {patient.mrn} · Room {patient.room}</p>
                  </div>
                </td>
                <td className="py-3 px-4 hidden md:table-cell" onClick={() => onClick(patient)}>
                  <div>
                    <p className="text-foreground">{patient.assigned_care_manager}</p>
                    <p className="text-xs text-muted-foreground">
                      {patient.role === "RN Case Manager" ? "RN" : "SW"}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell" onClick={() => onClick(patient)}>
                  {patient.floor}
                </td>
                <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell" onClick={() => onClick(patient)}>
                  {patient.payer}
                </td>
                <td className="py-3 px-4" onClick={() => onClick(patient)}>
                  <StatusBadge status={patient.status} />
                </td>
                <td className="py-3 px-4 hidden sm:table-cell" onClick={() => onClick(patient)}>
                  <RiskBadge risk={patient.risk_score} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {patients.length === 0 && (
        <div className="py-12 text-center text-muted-foreground text-sm">
          No patients match your filters.
        </div>
      )}
    </div>
  );
}