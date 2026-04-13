import { useState } from "react";
import {
  BookOpen, CheckCircle2, ChevronRight, ChevronLeft, Play,
  Users, MousePointer, ArrowRightLeft, ListChecks, SquareCheck,
  Target, TrendingUp, ClipboardCheck, BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductivityTutorial from "../components/tutorial/ProductivityTutorial";
import { Badge } from "@/components/ui/badge";

// ─── TRANSFER TUTORIAL STEPS ──────────────────────────────────────────────────

const TRANSFER_STEPS = [
  {
    id: 1,
    title: "Switch to Table View",
    description: "From the Dashboard, locate the view toggle at the top of the patient list. Click the 'Table' button to switch to Table View — this makes it easy to select multiple patients at once.",
    tip: "Table View displays all patients in rows, making multi-select much faster.",
    MockUI: StepTableView,
  },
  {
    id: 2,
    title: "Select Patients Using Checkboxes",
    description: "Click the checkboxes on the left side of each patient row you want to reassign. You can also click the top-left checkbox to select all visible patients at once.",
    tip: "Selected rows are highlighted in blue. The count of selected patients appears on the Reassign button.",
    MockUI: StepCheckboxes,
  },
  {
    id: 3,
    title: "Click the 'Reassign' Button",
    description: "Once you've selected one or more patients, a blue 'Reassign (N)' button appears in the top-right corner of the page. Click it to open the Transfer / Reassign modal.",
    tip: "The number in parentheses shows exactly how many patients will be reassigned.",
    MockUI: StepReassignButton,
  },
  {
    id: 4,
    title: "Choose a New Care Manager",
    description: "In the modal, scroll to the 'New Care Manager' dropdown and select the care manager you want to assign these patients to.",
    tip: "You can reassign to any available care manager regardless of role.",
    MockUI: StepCareManagerDropdown,
  },
  {
    id: 5,
    title: "Select a Reason for Transfer",
    description: "Click the 'Reason for Transfer' dropdown and pick the most appropriate reason: Workload Balancing, Coverage / Assistance, Reassignment to New Team, or Other.",
    tip: "Selecting a reason is required — it creates a permanent audit trail in Transfer History.",
    MockUI: StepReasonDropdown,
  },
  {
    id: 6,
    title: "Complete the Transfer",
    description: "Click the blue 'Complete Transfer' button at the bottom of the modal. The system will update all selected patients and log the transfer in the audit history.",
    tip: "A success toast message will confirm the reassignment. The patient list refreshes automatically.",
    MockUI: StepTransferComplete,
  },
];

// ─── TALLY TUTORIAL STEPS ─────────────────────────────────────────────────────

const TALLY_STEPS = [
  {
    id: 1,
    title: "Open a Patient's Detail Panel",
    description: "From Card View or Table View, click on any patient's name or row to open the Patient Detail Panel on the right side of the screen.",
    tip: "You can open the detail panel from any view — Cards, Table, or By Manager.",
    MockUI: TallyStep1,
  },
  {
    id: 2,
    title: "Change Status to 'Completed'",
    description: "In the detail panel, find the 'Update Status' dropdown. Click it and select 'Completed' from the list to mark the case as done.",
    tip: "The Completed status is highlighted in green in the dropdown for easy identification.",
    MockUI: TallyStep2,
  },
  {
    id: 3,
    title: "Save the Status Change",
    description: "Click the blue 'Save Changes' button at the bottom of the panel. The patient card will immediately update to show the green 'Completed' badge.",
    tip: "Changes are saved instantly and reflected in the KPI cards at the top of the dashboard.",
    MockUI: TallyStep3,
  },
  {
    id: 4,
    title: "Track Your Tally on the Dashboard",
    description: "Return to the Dashboard. The green 'Completed' KPI card in the top row updates in real time, showing your running total of completed cases for the day/period.",
    tip: "Use the Care Manager filter to view completions per staff member and compare against productivity goals.",
    MockUI: TallyStep4,
  },
  {
    id: 5,
    title: "Completed Cases in Card & Table View",
    description: "Completed patients display a green 'Completed' badge on their card or row, making it visually easy to see which cases are done and which still need attention.",
    tip: "Green = done. At a glance, your team can see progress across the full worklist.",
    MockUI: TallyStep5,
  },
  {
    id: 6,
    title: "Filter to See Your Productivity",
    description: "Use the Care Manager filter to narrow the view to a specific clinician. The KPI cards will update to show that person's Completed count — perfect for tracking individual productivity against department goals.",
    tip: "Set a daily goal (e.g. 5 completions) and use the Completed KPI card to track progress throughout the shift.",
    MockUI: TallyStep6,
  },
];

// ─── TRANSFER MOCK UIs ────────────────────────────────────────────────────────

function MockTableRow({ name, mrn, manager, status, checked, highlighted }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 text-xs border-b border-border last:border-0 ${highlighted ? "bg-primary/10" : "hover:bg-muted/30"}`}>
      <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${checked ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
        {checked && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
      </div>
      <span className="font-medium text-foreground w-28 truncate">{name}</span>
      <span className="text-muted-foreground w-16">{mrn}</span>
      <span className="text-muted-foreground w-28 truncate hidden sm:block">{manager}</span>
      <span className={`px-2 py-0.5 rounded text-xs font-medium ml-auto ${status === "High Priority" ? "bg-status-high-priority text-status-high-priority-text" : "bg-status-awaiting text-status-awaiting-text"}`}>
        {status}
      </span>
    </div>
  );
}

function MockViewToggle({ active }) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1 w-fit mb-3">
      {["Cards", "Table", "By Manager"].map((v) => (
        <div key={v} className={`px-3 py-1 rounded text-xs font-medium ${active === v ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}>{v}</div>
      ))}
    </div>
  );
}

function StepTableView() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <MockViewToggle active="Table" />
      <div className="relative">
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 text-xs font-medium text-muted-foreground border-b border-border">
            <div className="w-3.5 h-3.5 rounded border-2 border-muted-foreground/40 flex-shrink-0" />
            <span className="w-28">Patient</span><span className="w-16">MRN</span>
            <span className="w-28 hidden sm:block">Care Manager</span><span className="ml-auto">Status</span>
          </div>
          <MockTableRow name="Alice Monroe" mrn="MRN-001" manager="Sarah Johnson" status="Awaiting Review" />
          <MockTableRow name="Bob Patel" mrn="MRN-002" manager="Michael Chen" status="High Priority" />
          <MockTableRow name="Carol Davis" mrn="MRN-003" manager="Emily Rodriguez" status="Awaiting Review" />
        </div>
        <div className="absolute -top-2 left-20 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded shadow font-medium flex items-center gap-1">
          <MousePointer className="w-3 h-3" /> Click "Table"
        </div>
      </div>
    </div>
  );
}

function StepCheckboxes() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <MockViewToggle active="Table" />
      <div className="relative">
        <div className="rounded-lg border border-border overflow-hidden ring-2 ring-primary/30">
          <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 text-xs font-medium text-muted-foreground border-b border-border">
            <div className="w-3.5 h-3.5 rounded border-2 border-primary bg-primary flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 bg-white rounded-sm" />
            </div>
            <span className="w-28">Patient</span><span className="w-16">MRN</span>
            <span className="w-28 hidden sm:block">Care Manager</span><span className="ml-auto">Status</span>
          </div>
          <MockTableRow name="Alice Monroe" mrn="MRN-001" manager="Sarah Johnson" status="Awaiting Review" checked highlighted />
          <MockTableRow name="Bob Patel" mrn="MRN-002" manager="Michael Chen" status="High Priority" checked highlighted />
          <MockTableRow name="Carol Davis" mrn="MRN-003" manager="Emily Rodriguez" status="Awaiting Review" />
        </div>
        <div className="absolute -left-2 top-10 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded shadow font-medium flex items-center gap-1">
          <SquareCheck className="w-3 h-3" /> Check rows
        </div>
      </div>
    </div>
  );
}

function StepReassignButton() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-bold text-base text-foreground">Patient Worklist</div>
          <div className="text-xs text-muted-foreground">22 patients · Monday, April 13</div>
        </div>
        <div className="relative">
          <div className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg ring-4 ring-primary/30 animate-pulse">
            <ArrowRightLeft className="w-4 h-4" /> Reassign (2)
          </div>
          <div className="absolute -bottom-7 right-0 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded shadow font-medium whitespace-nowrap">↑ Click here</div>
        </div>
      </div>
      <div className="rounded-lg border border-border overflow-hidden opacity-60">
        <MockTableRow name="Alice Monroe" mrn="MRN-001" manager="Sarah Johnson" status="Awaiting Review" checked highlighted />
        <MockTableRow name="Bob Patel" mrn="MRN-002" manager="Michael Chen" status="High Priority" checked highlighted />
      </div>
    </div>
  );
}

function StepCareManagerDropdown() {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <div className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <ArrowRightLeft className="w-4 h-4 text-primary" /> Transfer / Reassign Patients
      </div>
      <div className="bg-muted/50 rounded-lg p-3 mb-4 text-xs">
        <p className="font-medium text-muted-foreground mb-1">Selected Patients:</p>
        <p className="text-foreground">Alice Monroe <span className="text-muted-foreground">— Sarah Johnson</span></p>
        <p className="text-foreground">Bob Patel <span className="text-muted-foreground">— Michael Chen</span></p>
      </div>
      <div className="space-y-2 relative">
        <div className="text-xs font-medium text-foreground">New Care Manager *</div>
        <div className="border-2 border-primary rounded-lg bg-card shadow-lg overflow-hidden ring-4 ring-primary/20">
          <div className="flex items-center justify-between px-3 py-2 text-sm border-b border-border bg-muted/30">
            <span className="text-muted-foreground">Select care manager...</span>
            <ChevronRight className="w-4 h-4 rotate-90 text-muted-foreground" />
          </div>
          {["Emily Rodriguez", "Laura Patel", "David Kim", "Rachel Thompson"].map((cm, i) => (
            <div key={cm} className={`px-3 py-1.5 text-sm flex items-center gap-2 ${i === 1 ? "bg-primary/10 text-primary font-medium" : "text-foreground"}`}>
              {i === 1 && <CheckCircle2 className="w-3 h-3 text-primary" />}{cm}
            </div>
          ))}
        </div>
        <div className="absolute -right-2 top-6 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded shadow font-medium whitespace-nowrap">← Select manager</div>
      </div>
    </div>
  );
}

function StepReasonDropdown() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
        <ArrowRightLeft className="w-4 h-4 text-primary" /> Transfer / Reassign Patients
      </div>
      <div className="opacity-50 text-xs border border-border rounded-lg px-3 py-2 text-foreground flex items-center justify-between">
        Laura Patel <CheckCircle2 className="w-3 h-3 text-primary" />
      </div>
      <div className="space-y-2 relative">
        <div className="text-xs font-medium text-foreground">Reason for Transfer</div>
        <div className="border-2 border-primary rounded-lg bg-card shadow-lg overflow-hidden ring-4 ring-primary/20">
          <div className="flex items-center justify-between px-3 py-2 text-sm border-b border-border bg-muted/30">
            <span className="text-muted-foreground">Select reason...</span>
          </div>
          {["Workload Balancing", "Coverage / Assistance", "Reassignment to New Team", "Other"].map((r, i) => (
            <div key={r} className={`px-3 py-1.5 text-sm flex items-center gap-2 ${i === 0 ? "bg-primary/10 text-primary font-medium" : "text-foreground"}`}>
              {i === 0 && <CheckCircle2 className="w-3 h-3 text-primary" />}{r}
            </div>
          ))}
        </div>
        <div className="absolute -right-2 top-6 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded shadow font-medium whitespace-nowrap">← Select reason</div>
      </div>
    </div>
  );
}

function StepTransferComplete() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4">
      <div className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
        <ArrowRightLeft className="w-4 h-4 text-primary" /> Transfer / Reassign Patients
      </div>
      <div className="opacity-50 space-y-1 text-xs">
        <div className="border border-border rounded px-2 py-1.5 flex justify-between"><span>Laura Patel</span><CheckCircle2 className="w-3 h-3 text-primary" /></div>
        <div className="border border-border rounded px-2 py-1.5 flex justify-between"><span>Workload Balancing</span><CheckCircle2 className="w-3 h-3 text-primary" /></div>
      </div>
      <div className="relative">
        <div className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow ring-4 ring-primary/30">Complete Transfer</div>
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded shadow font-medium whitespace-nowrap">↓ Click to confirm</div>
      </div>
      <div className="bg-status-completed border border-status-completed-text/20 text-status-completed-text rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-medium shadow-lg">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> 2 patients successfully reassigned
      </div>
    </div>
  );
}

// ─── TALLY MOCK UIs ───────────────────────────────────────────────────────────

function TallyStep1() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="text-xs font-medium text-muted-foreground mb-2">Card View — Click any patient card</div>
      <div className="relative">
        <div className="border-2 border-primary ring-4 ring-primary/20 rounded-xl p-3 cursor-pointer shadow-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-sm text-foreground">Linda Martinez</p>
              <p className="text-xs text-muted-foreground">MRN: MRN-10156 · Room ICU-8</p>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-risk-high text-risk-high-text">⚠ High</span>
          </div>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-status-high-priority text-status-high-priority-text">High Priority</span>
          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
            <span>Sarah Johnson · RN</span>
          </div>
        </div>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded shadow font-medium whitespace-nowrap">
          <MousePointer className="w-3 h-3 inline mr-1" />Click to open panel
        </div>
      </div>
    </div>
  );
}

function TallyStep2() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="text-sm font-semibold text-foreground">Linda Martinez</div>
      <p className="text-xs text-muted-foreground">MRN: MRN-10156</p>
      <div className="text-xs font-medium text-foreground mt-2 mb-1">Update Status</div>
      <div className="border-2 border-primary rounded-lg overflow-hidden ring-4 ring-primary/20 shadow-lg relative">
        <div className="px-3 py-1.5 text-sm text-muted-foreground bg-muted/30 border-b border-border">Awaiting Review</div>
        {["Awaiting Review", "Completed", "High Priority", "MD Referral", "Discharged", "Discharge Planned"].map((s, i) => (
          <div key={s} className={`px-3 py-1.5 text-sm flex items-center justify-between ${i === 1 ? "bg-status-completed text-status-completed-text font-semibold" : "text-foreground hover:bg-muted/30"}`}>
            {s}
            {i === 1 && <CheckCircle2 className="w-3.5 h-3.5" />}
          </div>
        ))}
      </div>
      <div className="text-xs text-primary font-medium flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" /> Select "Completed" — shown in green
      </div>
    </div>
  );
}

function TallyStep3() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="text-sm font-semibold text-foreground">Linda Martinez</div>
      <div className="flex gap-2">
        <span className="px-2.5 py-1 rounded text-xs font-semibold bg-status-completed text-status-completed-text">Completed</span>
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-risk-high text-risk-high-text">⚠ High</span>
      </div>
      <div className="text-xs border border-border rounded px-3 py-1.5 text-foreground">Status: Completed</div>
      <div className="relative mt-2">
        <div className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow ring-4 ring-primary/30">
          Save Changes
        </div>
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded shadow font-medium whitespace-nowrap">↓ Click to save</div>
      </div>
      <div className="bg-status-completed border border-status-completed-text/20 text-status-completed-text rounded-lg px-3 py-2 flex items-center gap-2 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" /> Patient updated successfully
      </div>
    </div>
  );
}

function TallyStep4() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="text-xs font-medium text-muted-foreground mb-1">Dashboard — KPI Cards</div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Total Patients", value: 36, color: "bg-primary/10", icon: "📋", text: "text-primary" },
          { label: "Completed", value: 7, color: "bg-status-completed", icon: "✅", text: "text-status-completed-text", highlight: true },
          { label: "High Priority", value: 5, color: "bg-status-high-priority", icon: "⚠", text: "text-status-high-priority-text" },
          { label: "High Risk (AI)", value: 9, color: "bg-risk-high", icon: "👥", text: "text-risk-high-text" },
        ].map((card) => (
          <div key={card.label} className={`rounded-xl border p-3 flex items-center gap-3 ${card.highlight ? "border-status-completed-text/30 ring-2 ring-status-completed-text/20" : "border-border"}`}>
            <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center text-sm flex-shrink-0`}>{card.icon}</div>
            <div>
              <p className={`text-xl font-bold ${card.text}`}>{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-status-completed/30 border border-status-completed-text/20 rounded-lg px-3 py-1.5 text-xs text-status-completed-text font-medium flex items-center gap-2">
        <TrendingUp className="w-3 h-3" /> Completed count updates in real time as you save cases
      </div>
    </div>
  );
}

function TallyStep5() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <MockViewToggle active="Cards" />
      <div className="grid grid-cols-2 gap-2">
        {[
          { name: "Linda Martinez", status: "Completed", risk: "High", done: true },
          { name: "Richard White", status: "Discharged", risk: "Low", done: false },
          { name: "Susan Jackson", status: "High Priority", risk: "High", done: false },
          { name: "Maria Lopez", status: "Completed", risk: "Medium", done: true },
        ].map((p) => (
          <div key={p.name} className={`rounded-lg border p-2.5 ${p.done ? "border-status-completed-text/30 bg-status-completed/10" : "border-border"}`}>
            <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
            <span className={`mt-1 inline-block px-1.5 py-0.5 rounded text-xs font-medium ${
              p.status === "Completed" ? "bg-status-completed text-status-completed-text" :
              p.status === "High Priority" ? "bg-status-high-priority text-status-high-priority-text" :
              "bg-status-discharged text-status-discharged-text"
            }`}>{p.status}</span>
            {p.done && <div className="text-xs text-status-completed-text mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done</div>}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Green badges = completed cases. Easy to spot at a glance.</p>
    </div>
  );
}

function TallyStep6() {
  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-3">
      <div className="text-xs font-medium text-muted-foreground">Filter by Care Manager</div>
      <div className="border-2 border-primary rounded-lg px-3 py-2 text-sm font-medium text-primary flex items-center justify-between ring-2 ring-primary/20">
        Sarah Johnson <ChevronRight className="w-4 h-4 rotate-90" />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="rounded-xl border border-border p-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs">📋</div>
          <div><p className="text-lg font-bold text-foreground">10</p><p className="text-xs text-muted-foreground">Total</p></div>
        </div>
        <div className="rounded-xl border border-status-completed-text/30 bg-status-completed/10 p-3 flex items-center gap-2 ring-2 ring-status-completed-text/20">
          <div className="w-7 h-7 rounded-lg bg-status-completed flex items-center justify-center text-xs">✅</div>
          <div><p className="text-lg font-bold text-status-completed-text">4</p><p className="text-xs text-muted-foreground">Completed</p></div>
        </div>
      </div>
      <div className="bg-muted/40 rounded-lg px-3 py-2 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Daily Goal Progress</span>
          <span className="text-status-completed-text font-semibold">4 / 5</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-status-completed-text h-2 rounded-full" style={{ width: "80%" }} />
        </div>
        <p className="text-xs text-muted-foreground">1 more case to meet today's goal</p>
      </div>
    </div>
  );
}

// ─── Animated Demo ─────────────────────────────────────────────────────────────

function TransferDemo() {
  const [demoStep, setDemoStep] = useState(0);
  const frames = [
    { label: "Table View", sub: "User switches to Table View", color: "bg-primary/10 border-primary/30" },
    { label: "Selecting Patients", sub: "Checking 2 patient rows", color: "bg-primary/10 border-primary/30" },
    { label: "Reassign Clicked", sub: "Blue button with count appears", color: "bg-primary/10 border-primary/30" },
    { label: "Modal Opens", sub: "Choosing Laura Patel as new CM", color: "bg-primary/10 border-primary/30" },
    { label: "Reason Selected", sub: "Workload Balancing chosen", color: "bg-primary/10 border-primary/30" },
    { label: "Transfer Complete ✓", sub: "Success confirmation shown", color: "bg-status-completed border-status-completed-text/20" },
  ];
  return <DemoPlayer frames={frames} demoStep={demoStep} setDemoStep={setDemoStep} renderFrame={(i) => (
    <>
      {i === 0 && <div className="flex gap-1">{["Cards","Table","By Manager"].map((v,j) => <div key={v} className={`px-3 py-1 rounded text-xs font-medium ${j===1?"bg-primary text-primary-foreground":"bg-muted text-muted-foreground"}`}>{v}</div>)}</div>}
      {i === 1 && <div className="space-y-1 w-full max-w-xs">{["Alice Monroe","Bob Patel"].map(n => <div key={n} className="flex items-center gap-2 bg-primary/10 rounded px-2 py-1 text-xs"><div className="w-3 h-3 rounded bg-primary flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-sm"/></div><span className="font-medium">{n}</span></div>)}</div>}
      {i === 2 && <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg ring-4 ring-primary/30"><ArrowRightLeft className="w-4 h-4"/>Reassign (2)</div>}
      {i === 3 && <div className="bg-card border-2 border-primary rounded-lg px-4 py-2 text-sm font-medium text-primary flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>Laura Patel selected</div>}
      {i === 4 && <div className="bg-card border-2 border-primary rounded-lg px-4 py-2 text-sm font-medium text-primary flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>Workload Balancing</div>}
      {i === 5 && <div className="bg-status-completed text-status-completed-text border border-status-completed-text/20 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 shadow"><CheckCircle2 className="w-4 h-4"/>2 patients reassigned!</div>}
    </>
  )} />;
}

function TallyDemo() {
  const [demoStep, setDemoStep] = useState(0);
  const frames = [
    { label: "Open Patient Card", sub: "Click a patient to open detail panel", color: "bg-primary/10 border-primary/30" },
    { label: "Select 'Completed'", sub: "Choose Completed from status dropdown", color: "bg-status-completed border-status-completed-text/20" },
    { label: "Save Changes", sub: "Click Save — badge turns green", color: "bg-status-completed border-status-completed-text/20" },
    { label: "KPI Card Updates", sub: "Completed counter increments live", color: "bg-status-completed border-status-completed-text/20" },
    { label: "Green Badge Visible", sub: "Card shows green Completed badge", color: "bg-status-completed border-status-completed-text/20" },
    { label: "Filter & Track Goal", sub: "Filter by CM — see individual tally", color: "bg-primary/10 border-primary/30" },
  ];
  return <DemoPlayer frames={frames} demoStep={demoStep} setDemoStep={setDemoStep} renderFrame={(i) => (
    <>
      {i === 0 && <div className="border-2 border-primary rounded-lg px-4 py-2 text-sm font-medium text-foreground flex items-center gap-2 bg-card shadow"><MousePointer className="w-4 h-4 text-primary"/>Linda Martinez</div>}
      {i === 1 && <div className="bg-status-completed text-status-completed-text border border-status-completed-text/20 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>Completed selected</div>}
      {i === 2 && <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 shadow ring-4 ring-primary/30"><ClipboardCheck className="w-4 h-4"/>Saved! Badge → green</div>}
      {i === 3 && <div className="flex items-center gap-3 bg-status-completed/20 border border-status-completed-text/30 rounded-lg px-4 py-2"><span className="text-2xl font-bold text-status-completed-text">7</span><span className="text-sm text-status-completed-text font-medium">Completed ↑</span></div>}
      {i === 4 && <div className="flex gap-2">{["Linda M.","Maria L."].map(n=><div key={n} className="bg-status-completed text-status-completed-text text-xs px-2 py-1 rounded font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>{n}</div>)}</div>}
      {i === 5 && <div className="space-y-1 w-full max-w-xs"><div className="flex justify-between text-xs font-medium"><span className="text-foreground">Sarah Johnson</span><span className="text-status-completed-text">4/5 goal</span></div><div className="w-full bg-muted rounded-full h-2"><div className="bg-status-completed-text h-2 rounded-full" style={{width:"80%"}}/></div></div>}
    </>
  )} />;
}

function DemoPlayer({ frames, demoStep, setDemoStep, renderFrame }) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border bg-muted/30 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Play className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">Interactive Demo Walkthrough</h3>
          <p className="text-xs text-muted-foreground">Step through the full flow</p>
        </div>
      </div>
      <div className="p-5">
        <div className={`rounded-xl border-2 p-6 mb-4 transition-all duration-500 ${frames[demoStep].color}`}>
          <div className="text-center space-y-2 mb-4">
            <div className="text-3xl font-bold text-foreground">{demoStep + 1}</div>
            <div className="text-lg font-semibold text-foreground">{frames[demoStep].label}</div>
            <div className="text-sm text-muted-foreground">{frames[demoStep].sub}</div>
          </div>
          <div className="flex justify-center">{renderFrame(demoStep)}</div>
        </div>
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setDemoStep(Math.max(0, demoStep - 1))} disabled={demoStep === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <div className="flex gap-1.5">
            {frames.map((_, i) => (
              <button key={i} onClick={() => setDemoStep(i)} className={`h-2 rounded-full transition-all ${i === demoStep ? "bg-primary w-4" : "bg-muted-foreground/30 w-2"}`} />
            ))}
          </div>
          <Button size="sm" onClick={() => setDemoStep(Math.min(frames.length - 1, demoStep + 1))} disabled={demoStep === frames.length - 1}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Step Viewer ───────────────────────────────────────────────────────

function StepViewer({ steps, accentColor = "primary" }) {
  const [activeStep, setActiveStep] = useState(0);
  const step = steps[activeStep];
  const MockUI = step.MockUI;

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <button key={s.id} onClick={() => setActiveStep(i)} className="flex-1 group">
            <div className={`h-1.5 rounded-full transition-all ${i <= activeStep ? "bg-primary" : "bg-muted"}`} />
            <div className={`text-xs mt-1 text-center hidden lg:block ${i === activeStep ? "text-primary font-medium" : "text-muted-foreground"}`}>
              Step {s.id}
            </div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">{step.id}</div>
            <div>
              <Badge variant="secondary" className="text-xs mb-1">Step {step.id} of {steps.length}</Badge>
              <h2 className="text-lg font-bold text-foreground">{step.title}</h2>
            </div>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{step.description}</p>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ListChecks className="w-3 h-3 text-primary" />
            </div>
            <p className="text-sm text-foreground">{step.tip}</p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button size="sm" onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))} disabled={activeStep === steps.length - 1}>
              Next Step <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="ml-2">UI Preview</span>
          </div>
          <div className="border border-border rounded-xl overflow-hidden shadow-sm">
            <MockUI />
          </div>
        </div>
      </div>

      {/* All steps overview */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" /> All Steps at a Glance
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {steps.map((s, i) => (
            <button key={s.id} onClick={() => setActiveStep(i)}
              className={`text-left p-3 rounded-xl border transition-all hover:shadow-md ${i === activeStep ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/30"}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= activeStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i < activeStep ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                </div>
                <span className={`text-xs font-semibold ${i === activeStep ? "text-primary" : "text-foreground"}`}>Step {s.id}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">{s.title}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const TABS = [
  { key: "transfer", label: "Transfer & Reassign", icon: ArrowRightLeft },
  { key: "tally", label: "Productivity Tally", icon: Target },
  { key: "productivity", label: "Productivity Tab Guide", icon: BarChart2 },
];

export default function Tutorial() {
  const [activeTab, setActiveTab] = useState("transfer");

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          How-To Tutorials
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Step-by-step guides to help onboard new care team members.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 bg-muted rounded-xl p-1 w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-card shadow text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "transfer" && (
        <div className="space-y-6">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2 mb-1">
              <ArrowRightLeft className="w-4 h-4 text-primary" /> Transfer / Reassign Patients
            </h2>
            <p className="text-sm text-muted-foreground">Learn how to select multiple patients and reassign them to a new care manager in seconds.</p>
          </div>
          <StepViewer steps={TRANSFER_STEPS} />
          <TransferDemo />
        </div>
      )}

      {activeTab === "tally" && (
        <div className="space-y-6">
          <div className="bg-status-completed/30 border border-status-completed-text/20 rounded-xl p-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-status-completed-text" /> Tracking Case Completions & Productivity Goals
            </h2>
            <p className="text-sm text-muted-foreground">Learn how to mark cases as Completed, track your daily tally, and monitor productivity against department goals.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: ClipboardCheck, label: "Mark cases complete", desc: "One click in the detail panel" },
              { icon: BarChart2, label: "Live KPI tally", desc: "Dashboard updates instantly" },
              { icon: Target, label: "Track against goals", desc: "Filter by CM for individual view" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-status-completed flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-status-completed-text" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <StepViewer steps={TALLY_STEPS} />
          <TallyDemo />
        </div>
      )}

      {activeTab === "productivity" && (
        <ProductivityTutorial />
      )}
    </div>
  );
}