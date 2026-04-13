import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts";
import {
  Target, CheckCircle2, TrendingUp, Calendar, User, Users, Filter,
  Mail, Download, ChevronDown, ChevronUp, BarChart2, Table, Eye, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── MARCH 2026 MOCK DATA ──────────────────────────────────────────────────────

const MARCH_DATA = {
  "Sarah Johnson":    { role: "RN", daily: [2,1,3,2,1,0,0,2,1,3,2,2,0,0,3,2,1,2,3,0,0,2,1,3,2,2,0,0,3,2,1], total: 47 },
  "Michael Chen":    { role: "RN", daily: [1,2,1,3,2,1,0,1,2,3,1,2,0,0,2,1,3,2,1,0,0,3,2,1,2,1,0,0,2,1,2], total: 41 },
  "Emily Rodriguez": { role: "RN", daily: [3,2,2,1,3,0,0,2,3,2,2,1,0,0,3,2,2,1,2,0,0,2,3,2,1,2,0,0,1,2,3], total: 50 },
  "Laura Patel":     { role: "RN", daily: [1,1,2,3,1,0,0,2,1,2,3,1,0,0,1,2,3,2,1,0,0,2,1,3,2,1,0,0,2,1,2], total: 38 },
  "James Wilson":    { role: "RN", daily: [2,3,1,2,2,0,0,3,2,1,2,3,0,0,2,1,2,3,2,0,0,1,2,2,3,1,0,0,2,3,1], total: 48 },
  "Kevin Brooks":    { role: "RN", daily: [1,1,1,2,1,0,0,1,2,1,1,2,0,0,2,1,1,2,1,0,0,1,2,1,2,1,0,0,1,2,1], total: 32 },
  "David Kim":       { role: "SW", daily: [2,1,3,1,2,0,0,1,2,3,2,1,0,0,3,1,2,1,3,0,0,2,1,2,3,1,0,0,2,1,2], total: 42 },
  "Rachel Thompson": { role: "SW", daily: [1,2,2,1,3,0,0,2,1,2,1,3,0,0,1,2,2,3,1,0,0,2,1,1,2,3,0,0,1,2,1], total: 39 },
  "Amanda Foster":   { role: "SW", daily: [3,1,2,2,1,0,0,2,3,1,2,2,0,0,1,3,2,1,2,0,0,3,2,1,1,2,0,0,2,1,3], total: 45 },
  "Marcus Lee":      { role: "SW", daily: [1,1,2,1,2,0,0,1,1,2,1,1,0,0,2,1,1,2,1,0,0,1,2,1,1,2,0,0,1,2,1], total: 31 },
  "Nina Okafor":     { role: "SW", daily: [2,2,1,3,1,0,0,3,2,1,2,2,0,0,2,1,3,1,2,0,0,2,3,1,2,1,0,0,3,1,2], total: 44 },
  "Tanya Rivera":    { role: "SW", daily: [1,2,1,2,2,0,0,2,1,2,1,2,0,0,2,1,2,1,2,0,0,1,2,2,1,2,0,0,2,1,1], total: 36 },
};

// Week groupings (March 2026 starts on Sunday Mar 1)
const WEEKS_MARCH = [
  { label: "Week 1 (Mar 1–7)",   days: [0,1,2,3,4,5,6] },
  { label: "Week 2 (Mar 8–14)",  days: [7,8,9,10,11,12,13] },
  { label: "Week 3 (Mar 15–21)", days: [14,15,16,17,18,19,20] },
  { label: "Week 4 (Mar 22–28)", days: [21,22,23,24,25,26,27] },
  { label: "Week 5 (Mar 29–31)", days: [28,29,30] },
];

const DAY_LABELS = Array.from({ length: 31 }, (_, i) => {
  const d = new Date(2026, 2, i + 1);
  return { label: `${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]} Mar ${i+1}`, short: `${i+1}` };
});

function getWeeklyTotals(manager) {
  return WEEKS_MARCH.map((w) => ({
    label: w.label,
    count: w.days.reduce((s, d) => s + (MARCH_DATA[manager]?.daily[d] || 0), 0),
  }));
}

const COLOR_RN = "hsl(215, 70%, 55%)";
const COLOR_SW = "hsl(170, 50%, 45%)";
const COLOR_TODAY = "hsl(145, 50%, 45%)";
const COLOR_DIM = "hsl(145, 30%, 75%)";

// ─── SECTION 1: KPI Cards Overview ────────────────────────────────────────────

function KpiOverview({ manager }) {
  const data = MARCH_DATA[manager];
  const weeklyTotals = getWeeklyTotals(manager);
  const bestWeek = weeklyTotals.reduce((a, b) => (a.count > b.count ? a : b));
  const dailyNonZero = data.daily.filter((d) => d > 0);
  const avgDay = dailyNonZero.length ? (data.total / dailyNonZero.length).toFixed(1) : 0;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Monthly Total", value: data.total, icon: Target, color: "bg-status-completed", text: "text-status-completed-text" },
          { label: "Best Week", value: bestWeek.count, icon: TrendingUp, color: "bg-primary/10", text: "text-primary", sub: bestWeek.label.split("(")[1]?.replace(")", "") },
          { label: "Avg / Active Day", value: avgDay, icon: Calendar, color: "bg-primary/10", text: "text-primary" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${c.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${c.text}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${c.text}`}>{c.value}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                {c.sub && <p className="text-xs text-muted-foreground">{c.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SECTION 2: Team Bar Chart with Role Filter ────────────────────────────────

function TeamBarChart() {
  const [roleFilter, setRoleFilter] = useState("all");

  const managers = Object.entries(MARCH_DATA).filter(([, v]) =>
    roleFilter === "all" ? true : (roleFilter === "RN" ? v.role === "RN" : v.role === "SW")
  );

  const chartData = managers.map(([name, v]) => ({
    name: name.split(" ")[0],
    fullName: name,
    total: v.total,
    role: v.role,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-primary" /> March 2026 — Team Completions
        </h3>
        <div className="flex gap-1.5">
          {[["all", "All"], ["RN", "RN Case Mgrs"], ["SW", "Social Workers"]].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setRoleFilter(v)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border ${roleFilter === v ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {roleFilter !== "all" && (
        <div className="bg-muted/40 rounded-lg px-3 py-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5 flex-shrink-0" />
          Showing {roleFilter === "RN" ? "RN Case Managers" : "Social Workers"} only — {managers.length} staff members
        </div>
      )}

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} barSize={22} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
                <p className="font-semibold text-foreground">{d.fullName}</p>
                <p className="text-muted-foreground">{d.role === "RN" ? "RN Case Manager" : "Social Worker"}</p>
                <p className="text-status-completed-text font-medium">{d.total} completed (March)</p>
              </div>
            );
          }} />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.role === "RN" ? COLOR_RN : COLOR_SW} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: COLOR_RN }} />RN Case Manager</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: COLOR_SW }} />Social Worker</div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 text-xs text-foreground">
        <strong>Tip:</strong> Use the filters above to compare RN vs SW productivity. Managers can toggle between roles to spot workload imbalances.
      </div>
    </div>
  );
}

// ─── SECTION 3: Admin / Manager Comparison View ───────────────────────────────

const TABLE_DATA = Object.entries(MARCH_DATA).map(([name, v]) => {
  const w = WEEKS_MARCH.map((wk) => wk.days.reduce((s, d) => s + v.daily[d], 0));
  return { name, role: v.role, total: v.total, w1: w[0], w2: w[1], w3: w[2], w4: w[3] };
}).sort((a, b) => b.total - a.total);

function AdminComparisonView() {
  const [viewMode, setViewMode] = useState("chart");
  const [roleFilter, setRoleFilter] = useState("all");
  const [emailSent, setEmailSent] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const filtered = TABLE_DATA.filter((r) =>
    roleFilter === "all" ? true : r.role === roleFilter
  );

  const handleEmail = () => { setEmailSent(true); setTimeout(() => setEmailSent(false), 3000); };
  const handleExport = () => { setExportDone(true); setTimeout(() => setExportDone(false), 3000); };

  return (
    <div className="space-y-4">
      {/* Admin badge */}
      <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
          <Users className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">Manager / Admin View</p>
          <p className="text-xs text-muted-foreground">You can see all staff productivity. Regular users see only their own.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap justify-between">
        <div className="flex gap-1.5">
          {[["all","All Staff"],["RN","RN Only"],["SW","SW Only"]].map(([v,l]) => (
            <button key={v} onClick={() => setRoleFilter(v)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${roleFilter===v?"bg-primary text-primary-foreground border-primary":"bg-card border-border text-muted-foreground hover:text-foreground"}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setViewMode("chart")}
            className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${viewMode==="chart"?"bg-primary text-primary-foreground border-primary":"bg-card border-border text-muted-foreground"}`}>
            <BarChart2 className="w-3 h-3" /> Chart
          </button>
          <button onClick={() => setViewMode("table")}
            className={`px-3 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${viewMode==="table"?"bg-primary text-primary-foreground border-primary":"bg-card border-border text-muted-foreground"}`}>
            <Table className="w-3 h-3" /> Table
          </button>
        </div>
      </div>

      {/* Chart view */}
      {viewMode === "chart" && (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={filtered} barSize={20} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tickFormatter={(v) => v.split(" ")[0]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-muted-foreground">{d.role === "RN" ? "RN Case Manager" : "Social Worker"}</p>
                  <p className="text-status-completed-text font-medium">{d.total} cases completed</p>
                </div>
              );
            }} />
            <Bar dataKey="total" radius={[4,4,0,0]}>
              {filtered.map((e,i) => <Cell key={i} fill={e.role === "RN" ? COLOR_RN : COLOR_SW} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Table view */}
      {viewMode === "table" && (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Care Manager</th>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground">Role</th>
                <th className="text-center px-2 py-2 font-medium text-muted-foreground">Wk 1</th>
                <th className="text-center px-2 py-2 font-medium text-muted-foreground">Wk 2</th>
                <th className="text-center px-2 py-2 font-medium text-muted-foreground">Wk 3</th>
                <th className="text-center px-2 py-2 font-medium text-muted-foreground">Wk 4</th>
                <th className="text-center px-3 py-2 font-semibold text-foreground">Mar Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.name} className={`border-b border-border last:border-0 ${i === 0 ? "bg-status-completed/10" : "hover:bg-muted/20"}`}>
                  <td className="px-3 py-2 font-medium text-foreground">{r.name.split(" ")[0]} {r.name.split(" ")[1]?.[0]}.</td>
                  <td className="px-3 py-2"><Badge variant="secondary" className="text-xs">{r.role}</Badge></td>
                  <td className="px-2 py-2 text-center text-muted-foreground">{r.w1}</td>
                  <td className="px-2 py-2 text-center text-muted-foreground">{r.w2}</td>
                  <td className="px-2 py-2 text-center text-muted-foreground">{r.w3}</td>
                  <td className="px-2 py-2 text-center text-muted-foreground">{r.w4}</td>
                  <td className="px-3 py-2 text-center font-bold text-status-completed-text">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-muted/30 border border-border rounded-lg px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
        <Eye className="w-3.5 h-3.5 flex-shrink-0" />
        No need to leave the platform — this replaces manual BI tool exports for routine productivity reviews.
      </div>

      {/* Export / Email */}
      <div className="flex gap-2 flex-wrap pt-1">
        <Button size="sm" variant="outline" onClick={handleEmail} className="gap-2 text-xs h-8">
          <Mail className="w-3.5 h-3.5" /> Email to Self
        </Button>
        <Button size="sm" variant="outline" onClick={handleExport} className="gap-2 text-xs h-8">
          <Download className="w-3.5 h-3.5" /> Export to BI Tool
        </Button>
      </div>

      {(emailSent || exportDone) && (
        <div className="bg-status-completed border border-status-completed-text/20 text-status-completed-text rounded-lg px-3 py-2 flex items-center gap-2 text-xs font-medium animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {emailSent ? "Report submitted to your email." : "Export initiated — BI tool will receive data shortly."}
        </div>
      )}
    </div>
  );
}

// ─── SECTION 4: Individual User View ──────────────────────────────────────────

function IndividualUserView() {
  const [viewAll, setViewAll] = useState(false);
  const [selectedCM, setSelectedCM] = useState("Sarah Johnson");

  const data = MARCH_DATA[selectedCM];
  const weekTotals = getWeeklyTotals(selectedCM);

  // Last 7 days of March (Mar 25–31)
  const last7 = [24,25,26,27,28,29,30].map((i) => ({
    name: DAY_LABELS[i].label.split(" ")[0],
    date: `Mar ${i+1}`,
    count: data.daily[i],
    isToday: i === 30,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-lg px-3 py-2">
        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-foreground">Individual User View</p>
          <p className="text-xs text-muted-foreground">By default, users see only their own data.</p>
        </div>
        <button
          onClick={() => setViewAll(!viewAll)}
          className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${viewAll ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground"}`}
        >
          <Eye className="w-3 h-3" /> {viewAll ? "Viewing All" : "View All (Admin)"}
        </button>
      </div>

      {viewAll ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Admin toggle enabled — select any care manager:</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(MARCH_DATA).map(([name, v]) => (
              <button key={name} onClick={() => { setSelectedCM(name); setViewAll(false); }}
                className="text-left px-3 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all">
                <p className="text-xs font-medium text-foreground">{name}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-xs text-muted-foreground">{v.role}</span>
                  <span className="text-xs font-bold text-status-completed-text">{v.total} cases</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <User className="w-4 h-4 text-primary" /> {selectedCM}
            <Badge variant="secondary" className="text-xs">{data.role === "RN" ? "RN Case Manager" : "Social Worker"}</Badge>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "March Total", value: data.total },
              { label: "Best Week", value: Math.max(...weekTotals.map(w => w.count)) },
              { label: "Avg / Active Day", value: +(data.total / data.daily.filter(d=>d>0).length).toFixed(1) },
            ].map((c) => (
              <div key={c.label} className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-xl font-bold text-status-completed-text">{c.value}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Last 7 days mini chart */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-primary" /> Last 7 Days of March
            </p>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={last7} barSize={18} margin={{ top: 2, right: 2, left: -24, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return <div className="bg-card border border-border rounded px-2 py-1 text-xs shadow"><p>{d.date}: <b className="text-status-completed-text">{d.count}</b></p></div>;
                }} />
                <Bar dataKey="count" radius={[3,3,0,0]}>
                  {last7.map((e,i) => <Cell key={i} fill={e.isToday ? COLOR_TODAY : COLOR_DIM} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly breakdown */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">Weekly Breakdown — March 2026</p>
            <div className="space-y-1.5">
              {weekTotals.map((w) => (
                <div key={w.label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-32 flex-shrink-0">{w.label.split("(")[1]?.replace(")", "")}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-status-completed-text h-2 rounded-full transition-all" style={{ width: `${(w.count / data.total) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-status-completed-text w-6 text-right">{w.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

const SECTIONS = [
  { key: "overview", label: "Reading the Tally", icon: Target },
  { key: "team", label: "Team Chart & Filters", icon: BarChart2 },
  { key: "admin", label: "Admin / Manager View", icon: Users },
  { key: "individual", label: "Individual User View", icon: User },
];

export default function ProductivityTutorial() {
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedCM, setSelectedCM] = useState("Emily Rodriguez");

  return (
    <div className="space-y-5">
      {/* Intro */}
      <div className="bg-status-completed/20 border border-status-completed-text/20 rounded-xl p-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-status-completed-text" /> How to Read Case Completion Tally
        </h2>
        <p className="text-sm text-muted-foreground">
          Interactive walkthrough using <strong>March 2026</strong> data — fully populated with realistic completions for all 12 care managers.
        </p>
        <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-status-completed-text" /> 12 Care Managers</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-status-completed-text" /> Daily · Weekly · Monthly</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-status-completed-text" /> Live Filters</span>
        </div>
      </div>

      {/* Section tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button key={s.key} onClick={() => setActiveSection(s.key)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left text-xs font-medium transition-all ${activeSection === s.key ? "bg-primary text-primary-foreground border-primary shadow" : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
              <Icon className="w-3.5 h-3.5 flex-shrink-0" /> {s.label}
            </button>
          );
        })}
      </div>

      {/* Section: Reading the Tally */}
      {activeSection === "overview" && (
        <div className="space-y-5">
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Example: Emily Rodriguez — March 2026</h3>
            <div className="flex gap-2">
              <select
                value={selectedCM}
                onChange={(e) => setSelectedCM(e.target.value)}
                className="text-xs border border-border rounded-lg px-2 py-1.5 bg-card text-foreground"
              >
                {Object.keys(MARCH_DATA).map((cm) => <option key={cm}>{cm}</option>)}
              </select>
              <Badge variant="secondary" className="text-xs">{MARCH_DATA[selectedCM].role === "RN" ? "RN Case Manager" : "Social Worker"}</Badge>
            </div>
            <KpiOverview manager={selectedCM} />

            {/* Daily bar for full month */}
            <div>
              <p className="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Daily Completions — March 2026 (all 31 days)
              </p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={MARCH_DATA[selectedCM].daily.map((v,i) => ({ day: `${i+1}`, count: v }))}
                  barSize={7} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 8 }} axisLine={false} tickLine={false}
                    ticks={["1","7","14","21","28","31"]} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return <div className="bg-card border border-border rounded px-2 py-1 text-xs shadow"><p>Mar {d.day}: <b className="text-status-completed-text">{d.count}</b></p></div>;
                  }} />
                  <Bar dataKey="count" fill={COLOR_TODAY} radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly */}
            <div>
              <p className="text-xs font-medium text-foreground mb-2">Weekly Totals (Sun–Sat)</p>
              <div className="space-y-1.5">
                {getWeeklyTotals(selectedCM).map((w) => (
                  <div key={w.label} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-28 flex-shrink-0 truncate">{w.label.split(" ")[0]} {w.label.split(" ")[1]}</span>
                    <div className="flex-1 bg-muted rounded-full h-2.5">
                      <div className="bg-status-completed-text h-2.5 rounded-full transition-all"
                        style={{ width: `${Math.min((w.count / 20) * 100, 100)}%` }} />
                    </div>
                    <span className="text-xs font-bold text-status-completed-text w-5 text-right">{w.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 text-xs text-foreground">
              <strong>What to look for:</strong> The KPI cards give you instant totals. The bar chart reveals patterns — did productivity dip mid-week? Were weekends zero (expected)? Use this to set realistic daily goals.
            </div>
          </div>
        </div>
      )}

      {/* Section: Team Chart */}
      {activeSection === "team" && (
        <div className="bg-card rounded-xl border border-border p-5">
          <TeamBarChart />
        </div>
      )}

      {/* Section: Admin View */}
      {activeSection === "admin" && (
        <div className="bg-card rounded-xl border border-border p-5">
          <AdminComparisonView />
        </div>
      )}

      {/* Section: Individual View */}
      {activeSection === "individual" && (
        <div className="bg-card rounded-xl border border-border p-5">
          <IndividualUserView />
        </div>
      )}

      {/* Bottom callout */}
      <div className="bg-muted/30 border border-border rounded-xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground">No BI tool needed for routine reviews.</strong> The Productivity tab provides daily, weekly, and monthly tallies in real time. Managers can compare across all staff; individuals see their own clean view. Use Export or Email for deeper offline analysis.
        </p>
      </div>
    </div>
  );
}