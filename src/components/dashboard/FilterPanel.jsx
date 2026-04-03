import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { CARE_MANAGERS, ROLES, FLOORS, PAYERS } from "../../lib/statusUtils";

export default function FilterPanel({ filters, setFilters }) {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value === "all" ? "" : value }));
  };

  const clearFilters = () => {
    setFilters({ careManager: "", role: "", floor: "", payer: "" });
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="w-4 h-4 text-muted-foreground" />
          Filters
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs text-muted-foreground">
            <X className="w-3 h-3 mr-1" /> Clear
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select value={filters.careManager || "all"} onValueChange={(v) => handleChange("careManager", v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Care Manager" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Care Managers</SelectItem>
            {CARE_MANAGERS.map((cm) => (
              <SelectItem key={cm} value={cm}>{cm}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.role || "all"} onValueChange={(v) => handleChange("role", v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.floor || "all"} onValueChange={(v) => handleChange("floor", v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Floor / Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Floors</SelectItem>
            {FLOORS.map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.payer || "all"} onValueChange={(v) => handleChange("payer", v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Payer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payers</SelectItem>
            {PAYERS.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}