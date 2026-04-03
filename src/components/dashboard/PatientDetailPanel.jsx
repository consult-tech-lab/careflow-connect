import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "./StatusBadge";
import RiskBadge from "./RiskBadge";
import { Save, ArrowRightLeft, User, MapPin, CreditCard, Calendar, Stethoscope } from "lucide-react";
import { CARE_MANAGERS, STATUSES } from "../../lib/statusUtils";

export default function PatientDetailPanel({ patient, open, onClose, onUpdate, onTransferSingle }) {
  const [editStatus, setEditStatus] = useState(patient?.status || "");
  const [editNotes, setEditNotes] = useState(patient?.notes || "");
  const [saving, setSaving] = useState(false);

  if (!patient) return null;

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(patient.id, { status: editStatus, notes: editNotes });
    setSaving(false);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-lg">{patient.patient_name}</SheetTitle>
          <p className="text-sm text-muted-foreground">MRN: {patient.mrn}</p>
        </SheetHeader>

        <div className="space-y-5">
          <div className="flex gap-2 flex-wrap">
            <StatusBadge status={patient.status} />
            <RiskBadge risk={patient.risk_score} />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon={User} label="Care Manager" value={patient.assigned_care_manager} />
            <InfoItem icon={Stethoscope} label="Role" value={patient.role === "RN Case Manager" ? "RN" : "SW"} />
            <InfoItem icon={MapPin} label="Floor / Room" value={`${patient.floor} · ${patient.room}`} />
            <InfoItem icon={CreditCard} label="Payer" value={patient.payer} />
            <InfoItem icon={Calendar} label="Admission" value={patient.admission_date || "N/A"} />
            <InfoItem icon={Stethoscope} label="Diagnosis" value={patient.diagnosis || "N/A"} />
          </div>

          {patient.age && (
            <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
          )}

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">Update Status</Label>
            <Select value={editStatus} onValueChange={setEditStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Notes</Label>
            <Textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={3}
              placeholder="Add clinical notes..."
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onTransferSingle(patient)}
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Reassign
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}