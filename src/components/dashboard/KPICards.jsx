import { Users, CheckCircle, AlertTriangle, ClipboardList } from "lucide-react";

export default function KPICards({ patients }) {
  const total = patients.length;
  const completed = patients.filter((p) => p.status === "Completed").length;
  const highPriority = patients.filter((p) => p.status === "High Priority").length;
  const highRisk = patients.filter((p) => p.risk_score === "High").length;

  const cards = [
    {
      label: "Total Patients",
      value: total,
      icon: ClipboardList,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle,
      color: "text-status-completed-text",
      bgColor: "bg-status-completed",
    },
    {
      label: "High Priority",
      value: highPriority,
      icon: AlertTriangle,
      color: "text-status-high-priority-text",
      bgColor: "bg-status-high-priority",
    },
    {
      label: "High Risk (AI)",
      value: highRisk,
      icon: Users,
      color: "text-risk-high-text",
      bgColor: "bg-risk-high",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-card rounded-xl border border-border p-4 flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}