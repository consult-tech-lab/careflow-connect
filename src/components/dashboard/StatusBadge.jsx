import { getStatusConfig } from "../../lib/statusUtils";

export default function StatusBadge({ status }) {
  const config = getStatusConfig(status);
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}