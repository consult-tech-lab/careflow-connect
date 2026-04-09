import { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowRightLeft, Loader2, Users, ArrowRight } from "lucide-react";
import PatientCard from "../components/dashboard/PatientCard";
import PatientTable from "../components/dashboard/PatientTable";
import TransferModal from "../components/dashboard/TransferModal";
import PatientDetailPanel from "../components/dashboard/PatientDetailPanel";
import FilterPanel from "../components/dashboard/FilterPanel";
import { LayoutGrid, List } from "lucide-react";

const TABS = [
  { key: "all", label: "All Patients" },
  { key: "original", label: "Original (Not Transferred)" },
  { key: "transferred", label: "Reassigned / Transferred" },
];

export default function TransferAdjust() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("cards");
  const [filters, setFilters] = useState({ careManager: "", role: "", floor: "", payer: "" });
  const [selectedIds, setSelectedIds] = useState([]);
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [detailPatient, setDetailPatient] = useState(null);

  const { data: patients = [], isLoading: pLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: () => base44.entities.Patient.list(),
  });

  const { data: transfers = [] } = useQuery({
    queryKey: ["transfers"],
    queryFn: () => base44.entities.TransferHistory.list(),
  });

  const transferredPatientIds = useMemo(() => new Set(transfers.map((t) => t.patient_id)), [transfers]);

  const filteredByTab = useMemo(() => {
    let list = patients;
    if (activeTab === "original") list = patients.filter((p) => !transferredPatientIds.has(p.id));
    if (activeTab === "transferred") list = patients.filter((p) => transferredPatientIds.has(p.id));
    return list.filter((p) => {
      if (filters.careManager && p.assigned_care_manager !== filters.careManager) return false;
      if (filters.role && p.role !== filters.role) return false;
      if (filters.floor && p.floor !== filters.floor) return false;
      if (filters.payer && p.payer !== filters.payer) return false;
      return true;
    });
  }, [patients, transfers, activeTab, filters, transferredPatientIds]);

  const selectedPatients = useMemo(
    () => filteredByTab.filter((p) => selectedIds.includes(p.id)),
    [filteredByTab, selectedIds]
  );

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, []);

  const toggleSelectAll = useCallback(() => {
    const allIds = filteredByTab.map((p) => p.id);
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : allIds);
  }, [filteredByTab, selectedIds]);

  const handleTransfer = async ({ newCareManager, reason, reasonNotes }) => {
    setTransferLoading(true);
    for (const patient of selectedPatients) {
      await base44.entities.Patient.update(patient.id, { assigned_care_manager: newCareManager });
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
    queryClient.invalidateQueries({ queryKey: ["transfers"] });
    toast.success(`${selectedPatients.length} patient${selectedPatients.length > 1 ? "s" : ""} successfully reassigned`);
  };

  const handleUpdatePatient = async (id, data) => {
    await base44.entities.Patient.update(id, data);
    queryClient.invalidateQueries({ queryKey: ["patients"] });
    toast.success("Patient updated");
  };

  const handleSingleTransfer = (patient) => {
    setDetailPatient(null);
    setSelectedIds([patient.id]);
    setTransferOpen(true);
  };

  const transferredCount = patients.filter((p) => transferredPatientIds.has(p.id)).length;

  if (pLoading) {
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
          <h1 className="text-xl lg:text-2xl font-bold text-foreground flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-primary" />
            Transfer / Reassign / Adjust
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {patients.length} total patients · {transferredCount} reassigned
          </p>
        </div>
        {selectedIds.length > 0 && (
          <Button onClick={() => setTransferOpen(true)} className="gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Reassign</span> ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {TABS.map((tab) => {
          let count = patients.length;
          if (tab.key === "original") count = patients.filter((p) => !transferredPatientIds.has(p.id)).length;
          if (tab.key === "transferred") count = transferredCount;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelectedIds([]); }}
              className={`bg-card rounded-xl border p-4 text-left transition-all hover:shadow-md ${
                activeTab === tab.key ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
            >
              <p className="text-2xl font-bold text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{tab.label}</p>
            </button>
          );
        })}
      </div>

      <FilterPanel filters={filters} setFilters={setFilters} />

      {/* Transfer history for transferred patients */}
      {activeTab === "transferred" && transferredPatientIds.size > 0 && (
        <div className="bg-muted/30 rounded-xl border border-border p-4 space-y-2">
          <p className="text-sm font-medium text-foreground flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" /> Most Recent Transfers
          </p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {transfers.slice(0, 8).map((t) => (
              <div key={t.id} className="flex items-center gap-2 text-xs text-muted-foreground py-1 border-b border-border last:border-0">
                <span className="font-medium text-foreground">{t.patient_name}</span>
                <span>{t.previous_care_manager}</span>
                <ArrowRight className="w-3 h-3 text-primary flex-shrink-0" />
                <span className="text-foreground">{t.new_care_manager}</span>
                <Badge variant="secondary" className="text-xs ml-auto">{t.reason}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

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
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredByTab.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              isSelected={selectedIds.includes(patient.id)}
              onSelect={toggleSelect}
              onClick={setDetailPatient}
            />
          ))}
          {filteredByTab.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground text-sm">No patients found.</div>
          )}
        </div>
      ) : (
        <PatientTable
          patients={filteredByTab}
          selectedIds={selectedIds}
          onSelect={toggleSelect}
          onSelectAll={toggleSelectAll}
          onClick={setDetailPatient}
        />
      )}

      <TransferModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        selectedPatients={selectedPatients}
        onConfirm={handleTransfer}
        isLoading={transferLoading}
      />

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