import { useState } from "react";
import { BookOpen, CheckCircle2, ChevronRight, ChevronLeft, Play, Users, MousePointer, ArrowRightLeft, ListChecks, SquareCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STEPS = [
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
    description: "In the modal, scroll to the 'New Care Manager' dropdown and select the care manager you want to assign these patients to. The current managers are shown but marked as '(current)'.",
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
    MockUI: StepComplete,
  },
];

// ─── Mock UI Components ────────────────────────────────────────────────────────

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
            <span className="w-28">Patient</span>
            <span className="w-16">MRN</span>
            <span className="w-28 hidden sm:block">Care Manager</span>
            <span className="ml-auto">Status</span>
          </div>
          <MockTableRow name="Alice Monroe" mrn="MRN-001" manager="Sarah Johnson" status="Awaiting Review" />
          <MockTableRow name="Bob Patel" mrn="MRN-002" manager="Michael Chen" status="High Priority" />
          <MockTableRow name="Carol Davis" mrn="MRN-003" manager="Emily Rodriguez" status="Awaiting Review" />
        </div>
        {/* Highlight callout */}
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
            <span className="w-28">Patient</span>
            <span className="w-16">MRN</span>
            <span className="w-28 hidden sm:block">Care Manager</span>
            <span className="ml-auto">Status</span>
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
            <ArrowRightLeft className="w-4 h-4" />
            Reassign (2)
          </div>
          <div className="absolute -bottom-7 right-0 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded shadow font-medium whitespace-nowrap">
            ↑ Click here
          </div>
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
            <div key={cm} className={`px-3 py-1.5 text-sm flex items-center gap-2 ${i === 1 ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"}`}>
              {i === 1 && <CheckCircle2 className="w-3 h-3 text-primary" />}
              {cm}
            </div>
          ))}
        </div>
        <div className="absolute -right-2 top-6 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded shadow font-medium whitespace-nowrap">
          ← Select manager
        </div>
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
              {i === 0 && <CheckCircle2 className="w-3 h-3 text-primary" />}
              {r}
            </div>
          ))}
        </div>
        <div className="absolute -right-2 top-6 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded shadow font-medium whitespace-nowrap">
          ← Select reason
        </div>
      </div>
    </div>
  );
}

function StepComplete() {
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
        <div className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow ring-4 ring-primary/30">
          Complete Transfer
        </div>
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded shadow font-medium whitespace-nowrap">
          ↓ Click to confirm
        </div>
      </div>
      {/* Success toast */}
      <div className="bg-status-completed border border-status-completed-text/20 text-status-completed-text rounded-lg px-4 py-3 flex items-center gap-3 text-sm font-medium shadow-lg">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        2 patients successfully reassigned
      </div>
    </div>
  );
}

// ─── Animated Demo ─────────────────────────────────────────────────────────────

function AnimatedDemo() {
  const [demoStep, setDemoStep] = useState(0);
  const frames = [
    { label: "Table View", sub: "User switches to Table View", color: "bg-primary/10 border-primary/30" },
    { label: "Selecting Patients", sub: "Checking 2 patient rows", color: "bg-primary/10 border-primary/30" },
    { label: "Reassign Clicked", sub: "Blue button with count appears", color: "bg-primary/10 border-primary/30" },
    { label: "Modal Opens", sub: "Choosing Laura Patel as new CM", color: "bg-primary/10 border-primary/30" },
    { label: "Reason Selected", sub: "Workload Balancing chosen", color: "bg-primary/10 border-primary/30" },
    { label: "Transfer Complete ✓", sub: "Success confirmation shown", color: "bg-status-completed border-status-completed-text/20" },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border bg-muted/30 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Play className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">Interactive Demo Walkthrough</h3>
          <p className="text-xs text-muted-foreground">Step through the full transfer flow</p>
        </div>
      </div>
      <div className="p-5">
        {/* Frame display */}
        <div className={`rounded-xl border-2 p-6 mb-4 transition-all duration-500 ${frames[demoStep].color}`}>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-foreground">{demoStep + 1}</div>
            <div className="text-lg font-semibold text-foreground">{frames[demoStep].label}</div>
            <div className="text-sm text-muted-foreground">{frames[demoStep].sub}</div>
          </div>
          {/* Mini visual for each demo frame */}
          <div className="mt-4 flex justify-center">
            {demoStep === 0 && <div className="flex gap-1">{["Cards","Table","By Manager"].map((v,i) => <div key={v} className={`px-3 py-1 rounded text-xs font-medium ${i===1?"bg-primary text-primary-foreground":"bg-muted text-muted-foreground"}`}>{v}</div>)}</div>}
            {demoStep === 1 && <div className="space-y-1 w-full max-w-xs">{["Alice Monroe","Bob Patel"].map(n => <div key={n} className="flex items-center gap-2 bg-primary/10 rounded px-2 py-1 text-xs"><div className="w-3 h-3 rounded bg-primary flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-sm"/></div><span className="font-medium">{n}</span></div>)}</div>}
            {demoStep === 2 && <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg ring-4 ring-primary/30"><ArrowRightLeft className="w-4 h-4"/>Reassign (2)</div>}
            {demoStep === 3 && <div className="bg-card border-2 border-primary rounded-lg px-4 py-2 text-sm font-medium text-primary flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>Laura Patel selected</div>}
            {demoStep === 4 && <div className="bg-card border-2 border-primary rounded-lg px-4 py-2 text-sm font-medium text-primary flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>Workload Balancing</div>}
            {demoStep === 5 && <div className="bg-status-completed text-status-completed-text border border-status-completed-text/20 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 shadow"><CheckCircle2 className="w-4 h-4"/>2 patients reassigned!</div>}
          </div>
        </div>
        {/* Controls */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setDemoStep(Math.max(0, demoStep - 1))} disabled={demoStep === 0}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>
          <div className="flex gap-1.5">
            {frames.map((_, i) => (
              <button key={i} onClick={() => setDemoStep(i)} className={`w-2 h-2 rounded-full transition-all ${i === demoStep ? "bg-primary w-4" : "bg-muted-foreground/30"}`} />
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

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function Tutorial() {
  const [activeStep, setActiveStep] = useState(0);

  const step = STEPS[activeStep];
  const MockUI = step.MockUI;

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          How to Transfer / Reassign Patients
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          A step-by-step guide for onboarding new care team members.
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <button key={s.id} onClick={() => setActiveStep(i)} className="flex-1 group">
            <div className={`h-1.5 rounded-full transition-all ${i <= activeStep ? "bg-primary" : "bg-muted"}`} />
            <div className={`text-xs mt-1 text-center hidden lg:block ${i === activeStep ? "text-primary font-medium" : "text-muted-foreground"}`}>
              Step {s.id}
            </div>
          </button>
        ))}
      </div>

      {/* Active step */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Instructions */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0">
              {step.id}
            </div>
            <div>
              <Badge variant="secondary" className="text-xs mb-1">Step {step.id} of {STEPS.length}</Badge>
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

          {/* Step navigation */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button size="sm" onClick={() => setActiveStep(Math.min(STEPS.length - 1, activeStep + 1))} disabled={activeStep === STEPS.length - 1}>
              Next Step <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* UI Screenshot Mockup */}
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
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(i)}
              className={`text-left p-3 rounded-xl border transition-all hover:shadow-md ${
                i === activeStep ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < activeStep ? "bg-primary text-primary-foreground" :
                  i === activeStep ? "bg-primary text-primary-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i < activeStep ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                </div>
                <span className={`text-xs font-semibold ${i === activeStep ? "text-primary" : "text-foreground"}`}>
                  Step {s.id}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">{s.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Animated Demo */}
      <AnimatedDemo />
    </div>
  );
}