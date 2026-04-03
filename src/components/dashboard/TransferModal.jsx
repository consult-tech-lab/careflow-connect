import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { CARE_MANAGERS } from "../../lib/statusUtils";

const REASONS = [
  "Workload Balancing",
  "Coverage / Assistance",
  "Reassignment to New Team",
  "Other",
];

export default function TransferModal({ open, onClose, selectedPatients, onConfirm, isLoading }) {
  const [newCareManager, setNewCareManager] = useState("");
  const [reason, setReason] = useState("");
  const [reasonNotes, setReasonNotes] = useState("");

  const currentManagers = [...new Set(selectedPatients.map((p) => p.assigned_care_manager))];
  const availableManagers = CARE_MANAGERS.filter((cm) => !currentManagers.includes(cm));

  const handleConfirm = () => {
    onConfirm({ newCareManager, reason, reasonNotes });
    setNewCareManager("");
    setReason("");
    setReasonNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
            Transfer / Reassign Patients
          </DialogTitle>
          <DialogDescription>
            Reassigning {selectedPatients.length} patient{selectedPatients.length > 1 ? "s" : ""} to a new care manager.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-muted/50 rounded-lg p-3 max-h-32 overflow-y-auto">
            <p className="text-xs font-medium text-muted-foreground mb-2">Selected Patients:</p>
            <div className="space-y-1">
              {selectedPatients.map((p) => (
                <p key={p.id} className="text-sm text-foreground">
                  {p.patient_name} <span className="text-muted-foreground">— {p.assigned_care_manager}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">New Care Manager *</Label>
            <Select value={newCareManager} onValueChange={setNewCareManager}>
              <SelectTrigger>
                <SelectValue placeholder="Select care manager..." />
              </SelectTrigger>
              <SelectContent>
                {availableManagers.map((cm) => (
                  <SelectItem key={cm} value={cm}>{cm}</SelectItem>
                ))}
                {currentManagers.map((cm) => (
                  <SelectItem key={cm} value={cm} className="text-muted-foreground">{cm} (current)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Reason for Transfer</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason..." />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Additional Notes</Label>
            <Textarea
              placeholder="Optional notes about this transfer..."
              value={reasonNotes}
              onChange={(e) => setReasonNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!newCareManager || !reason || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Transferring...
              </>
            ) : (
              "Complete Transfer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}