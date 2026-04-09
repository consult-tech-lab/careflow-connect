import { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LayoutGrid, List, Users, ArrowRightLeft, Loader2 } from "lucide-react";
import FilterPanel from "../components/dashboard/FilterPanel";
import InlineTransferHistory from "../components/dashboard/InlineTransferHistory";
import KPICards from "../components/dashboard/KPICards";
import PatientCard from "../components/dashboard/PatientCard";
import PatientTable from "../components/dashboard/PatientTable";
import AssignmentView from "../components/dashboard/AssignmentView";
import TransferModal from "../components/dashboard/TransferModal";
import PatientDetailPanel from "../components/dashboard/PatientDetailPanel";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ careManager: "", role: "", floor: "", payer: "" });
  const [viewMode, setViewMode] = useState("cards"); // cards, table, assignment
  const [selectedIds, setSelectedIds] = useState([]);
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [detailPatient, setDetailPatient] = useState(null);

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: () => base44.entities.Patient.list(),
  });

  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      if (filters.careManager && p.assigned_care_manager !== filters.careManager) return false;
      if (filters.role && p.role !== filters.role) return false;
      if (filters.floor && p.floor !== filters.floor) return false;
      if (filters.payer && p.payer !== filters.payer) return false;
      return true;
    });
  }, [patients, filters]);

  const selectedPatients = useMemo(
    () => filteredPatients.filter((p) => selectedIds.includes(p.id)),
    [filteredPatients, selectedIds]
  );

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    const allIds = filteredPatients.map((p) => p.id);
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : allIds);
  }, [filteredPatients, selectedIds]);

  const handleTransfer = async ({ newCareManager, reason, reasonNotes }) => {
    setTransferLoading(true);
    for (const patient of selectedPatients) {
      await base44.entities.Patient.update(patient.id, {
        assigned_care_manager: newCareManager,
      });
      await base44.entities.TransferHistory.create({
        patient_id: patient.id,
        patient_name: patient.patient_name,
        previous_care_manager: patient.assigned_care_manager,
        new_care_manager: newCareManager,
        reason,
        reason_notes: reasonNotes,
        transfer_date: new Date().toISOString(),
      });
    }
    setTransferLoading(false);
    setTransferOpen(false);
    setSelectedIds([]);
    queryClient.invalidateQueries({ queryKey: ["patients"] });
    toast.success(`${selectedPatients.length} patient${selectedPatients.length > 1 ? "s" : ""} successfully reassigned`);
  };

  const handleSingleTransfer = (patient) => {
    setDetailPatient(null);
    setSelectedIds([patient.id]);
    setTransferOpen(true);
  };

  const handleUpdatePatient = async (id, data) => {
    await base44.entities.Patient.update(id, data);
    queryClient.invalidateQueries({ queryKey: ["patients"] });
    toast.success("Patient updated successfully");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">Patient Worklist</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""} · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button onClick={() => setTransferOpen(true)} className="gap-2">
              <ArrowRightLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Transfer</span> ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      <KPICards patients={filteredPatients} />
      <FilterPanel filters={filters} setFilters={setFilters} />

      {/* View toggle */}
      <div className="flex items-center gap-1 bg-muted rounded-lg p-1 w-fit">
        <Button
          variant={viewMode === "cards" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("cards")}
          className="h-8 gap-1.5 text-xs"
        >
          <LayoutGrid className="w-3.5 h-3.5" /> Cards
        </Button>
        <Button
          variant={viewMode === "table" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("table")}
          className="h-8 gap-1.5 text-xs"
        >
          <List className="w-3.5 h-3.5" /> Table
        </Button>
        <Button
          variant={viewMode === "assignment" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setViewMode("assignment")}
          className="h-8 gap-1.5 text-xs"
        >
          <Users className="w-3.5 h-3.5" /> By Manager
        </Button>
      </div>

      {/* Content */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              isSelected={selectedIds.includes(patient.id)}
              onSelect={toggleSelect}
              onClick={setDetailPatient}
            />
          ))}
          {filteredPatients.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground text-sm">
              No patients match your filters.
            </div>
          )}
        </div>
      )}

      {viewMode === "table" && (
        <PatientTable
          patients={filteredPatients}
          selectedIds={selectedIds}
          onSelect={toggleSelect}
          onSelectAll={toggleSelectAll}
          onClick={setDetailPatient}
        />
      )}

      {viewMode === "assignment" && (
        <AssignmentView patients={filteredPatients} onClickPatient={setDetailPatient} />
      )}

      <InlineTransferHistory />

      {/* Transfer Modal */}
      <TransferModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        selectedPatients={selectedPatients}
        onConfirm={handleTransfer}
        isLoading={transferLoading}
      />

      {/* Patient Detail Panel */}
      <PatientDetailPanel
        patient={detailPatient}
        open={!!detailPatient}
        onClose={() => setDetailPatient(null)}
        onUpdate={handleUpdatePatient}
        onTransferSingle={handleSingleTransfer}
      />
    </div>
  );
}