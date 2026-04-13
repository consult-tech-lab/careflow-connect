import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import {
  Target, CheckCircle2, Calendar, TrendingUp, ChevronDown, ChevronUp, User, Loader2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CARE_MANAGERS } from "../lib/statusUtils";
import {
  startOfDay, startOfWeek, startOfMonth, endOfMonth, endOfWeek,
  isWithinInterval, format, parseISO, subDays, eachDayOfInterval,
  isSameDay
} from "date-fns";

function useCurrentUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);
  return user;
}

const CHART_COLOR = "hsl(145, 50%, 45%)";
const CHART_COLOR_DIM = "hsl(145, 30%, 75%)";

export default function Productivity() {
  const currentUser = useCurrentUser();
  const isAdmin = currentUser?.role === "admin";

  // Admin can pick any CM; regular user sees only their own name
  const [selectedManager, setSelectedManager] = useState("");

  // Once we know the user, default to their name
  useEffect(() => {
    if (currentUser && !selectedManager) {
      setSelectedManager(currentUser.full_name || "");
    }
  }, [currentUser]);

  const { data: allPatients = [], isLoading } = useQuery({
    queryKey: ["patients-completed"],
    queryFn: () => base44.entities.Patient.filter({ status: "Completed" }),
  });

  // Filter by care manager
  const patients = useMemo(() => {
    if (!selectedManager) return allPatients;
    return allPatients.filter((p) => p.assigned_care_manager === selectedManager);
  }, [allPatients, selectedManager]);

  // Date helpers
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
  const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const parseDate = (p) => {
    try { return parseISO(p.updated_date || p.created_date); } catch { return null; }
  };

  const todayPatients = useMemo(() =>
    patients.filter((p) => { const d = parseDate(p); return d && isSameDay(d, now); }),
    [patients]
  );

  const weekPatients = useMemo(() =>
    patients.filter((p) => { const d = parseDate(p); return d && isWithinInterval(d, { start: weekStart, end: weekEnd }); }),
    [patients]
  );

  const monthPatients = useMemo(() =>
    patients.filter((p) => { const d = parseDate(p); return d && isWithinInterval(d, { start: monthStart, end: monthEnd }); }),
    [patients]
  );

  // Weekly bar chart — last 7 days
  const last7Days = eachDayOfInterval({ start: subDays(now, 6), end: now });
  const chartData = last7Days.map((day) => ({
    name: format(day, "EEE"),
    date: format(day, "MMM d"),
    count: patients.filter((p) => { const d = parseDate(p); return d && isSameDay(d, day); }).length,
    isToday: isSameDay(day, now),
  }));

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Productivity
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Case completion tally — {format(now, "MMMM yyyy")}
          </p>
        </div>
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedManager || "all"} onValueChange={(v) => setSelectedManager(v === "all" ? "" : v)}>
              <SelectTrigger className="h-9 w-48 text-sm">
                <SelectValue placeholder="All Care Managers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Care Managers</SelectItem>
                {CARE_MANAGERS.map((cm) => (
                  <SelectItem key={cm} value={cm}>{cm}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5 text-sm text-muted-foreground">
            <User className="w-3.5 h-3.5" />
            {currentUser.full_name}
          </div>
        )}
      </div>

      {/* Summary KPI cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Today", value: todayPatients.length, sub: format(now, "EEEE, MMM d"), icon: Calendar, color: "bg-primary/10", text: "text-primary" },
          { label: "This Week", value: weekPatients.length, sub: `${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d")}`, icon: TrendingUp, color: "bg-status-completed", text: "text-status-completed-text" },
          { label: "This Month", value: monthPatients.length, sub: format(now, "MMMM yyyy"), icon: Target, color: "bg-primary/10", text: "text-primary" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${card.text}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
                <p className="text-xs font-medium text-foreground">{card.label}</p>
                <p className="text-xs text-muted-foreground truncate">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar chart — last 7 days */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Last 7 Days
        </h2>
        {chartData.every((d) => d.count === 0) ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            No completed cases in the last 7 days.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs shadow-lg">
                      <p className="font-semibold text-foreground">{d.date}</p>
                      <p className="text-status-completed-text">{d.count} completed</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.isToday ? CHART_COLOR : CHART_COLOR_DIM} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        <p className="text-xs text-muted-foreground mt-2 text-center">Today's bar is highlighted in darker green</p>
      </div>

      {/* Daily section */}
      <CollapsibleSection
        title="Daily"
        subtitle={format(now, "EEEE, MMMM d")}
        count={todayPatients.length}
        defaultOpen
      >
        <PatientList patients={todayPatients} emptyText="No cases completed today yet." />
      </CollapsibleSection>

      {/* Weekly section */}
      <CollapsibleSection
        title="This Week"
        subtitle={`${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d, yyyy")} (Sun–Sat)`}
        count={weekPatients.length}
        defaultOpen
      >
        <WeeklyList patients={weekPatients} weekStart={weekStart} weekEnd={weekEnd} />
      </CollapsibleSection>

      {/* Monthly section */}
      <CollapsibleSection
        title="This Month"
        subtitle={format(now, "MMMM yyyy")}
        count={monthPatients.length}
      >
        <MonthlyList patients={monthPatients} />
      </CollapsibleSection>
    </div>
  );
}

function CollapsibleSection({ title, subtitle, count, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-status-completed flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-status-completed-text" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-status-completed text-status-completed-text border-0 text-xs">{count} completed</Badge>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
      {open && <div className="border-t border-border">{children}</div>}
    </div>
  );
}

function PatientRow({ patient }) {
  const d = (() => {
    try { return parseISO(patient.updated_date || patient.created_date); } catch { return null; }
  })();
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-7 h-7 rounded-full bg-status-completed flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-status-completed-text" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{patient.patient_name}</p>
          <p className="text-xs text-muted-foreground">{patient.mrn} · {patient.floor}</p>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        {d && (
          <>
            <p className="text-xs font-medium text-foreground">{format(d, "MMM d")}</p>
            <p className="text-xs text-muted-foreground">{format(d, "EEEE")}</p>
          </>
        )}
      </div>
    </div>
  );
}

function PatientList({ patients, emptyText }) {
  if (!patients.length) {
    return <p className="text-sm text-muted-foreground text-center py-8">{emptyText}</p>;
  }
  return (
    <div className="divide-y divide-border">
      {patients.map((p) => <PatientRow key={p.id} patient={p} />)}
    </div>
  );
}

function WeeklyList({ patients, weekStart, weekEnd }) {
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  if (!patients.length) {
    return <p className="text-sm text-muted-foreground text-center py-8">No cases completed this week yet.</p>;
  }

  return (
    <div>
      {days.map((day) => {
        const dayPatients = patients.filter((p) => {
          try { return isSameDay(parseISO(p.updated_date || p.created_date), day); } catch { return false; }
        });
        if (!dayPatients.length) return null;
        return (
          <div key={day.toISOString()}>
            <div className="px-4 py-2 bg-muted/30 flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">{format(day, "EEEE, MMMM d")}</span>
              <Badge variant="secondary" className="text-xs">{dayPatients.length}</Badge>
            </div>
            {dayPatients.map((p) => <PatientRow key={p.id} patient={p} />)}
          </div>
        );
      })}
    </div>
  );
}

function MonthlyList({ patients }) {
  // Group by week of month
  const grouped = useMemo(() => {
    const map = {};
    patients.forEach((p) => {
      try {
        const d = parseISO(p.updated_date || p.created_date);
        const weekKey = format(startOfWeek(d, { weekStartsOn: 0 }), "MMM d");
        if (!map[weekKey]) map[weekKey] = { label: `Week of ${weekKey}`, patients: [] };
        map[weekKey].patients.push(p);
      } catch {}
    });
    return Object.values(map);
  }, [patients]);

  if (!patients.length) {
    return <p className="text-sm text-muted-foreground text-center py-8">No cases completed this month yet.</p>;
  }

  return (
    <div>
      {grouped.map((group) => (
        <div key={group.label}>
          <div className="px-4 py-2 bg-muted/30 flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">{group.label}</span>
            <Badge variant="secondary" className="text-xs">{group.patients.length}</Badge>
          </div>
          {group.patients.map((p) => <PatientRow key={p.id} patient={p} />)}
        </div>
      ))}
    </div>
  );
}