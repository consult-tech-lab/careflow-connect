import { getRiskConfig } from "../../lib/statusUtils";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

const RISK_ICONS = {
  Low: CheckCircle,
  Medium: AlertCircle,
  High: AlertTriangle,
};

export default function RiskBadge({ risk }) {
  const config = getRiskConfig(risk);
  const Icon = RISK_ICONS[risk] || CheckCircle;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3" />
      {risk}
    </span>
  );
}