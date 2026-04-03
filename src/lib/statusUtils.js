export const STATUS_CONFIG = {
  "Awaiting Review": {
    bg: "bg-status-awaiting",
    text: "text-status-awaiting-text",
    label: "Awaiting Review",
  },
  "Completed": {
    bg: "bg-status-completed",
    text: "text-status-completed-text",
    label: "Completed",
  },
  "High Priority": {
    bg: "bg-status-high-priority",
    text: "text-status-high-priority-text",
    label: "High Priority",
  },
  "MD Referral": {
    bg: "bg-status-md-referral",
    text: "text-status-md-referral-text",
    label: "MD Referral",
  },
  "Discharged": {
    bg: "bg-status-discharged",
    text: "text-status-discharged-text",
    label: "Discharged",
  },
  "Discharge Planned": {
    bg: "bg-status-discharge-planned",
    text: "text-status-discharge-planned-text",
    label: "Discharge Planned",
  },
};

export const RISK_CONFIG = {
  "Low": {
    bg: "bg-risk-low",
    text: "text-risk-low-text",
  },
  "Medium": {
    bg: "bg-risk-medium",
    text: "text-risk-medium-text",
  },
  "High": {
    bg: "bg-risk-high",
    text: "text-risk-high-text",
  },
};

export const CARE_MANAGERS = [
  "Sarah Johnson",
  "Michael Chen",
  "Emily Rodriguez",
  "David Kim",
  "Rachel Thompson",
  "James Wilson",
];

export const ROLES = ["RN Case Manager", "Social Worker"];
export const FLOORS = ["3 North", "3 South", "4 East", "4 West", "5 North", "ICU", "NICU", "ER"];
export const PAYERS = ["Medicare", "Medicaid", "Blue Cross", "Aetna", "UnitedHealth", "Cigna", "Self-Pay"];
export const STATUSES = ["Awaiting Review", "Completed", "High Priority", "MD Referral", "Discharged", "Discharge Planned"];
export const RISK_LEVELS = ["Low", "Medium", "High"];

export function getStatusConfig(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG["Awaiting Review"];
}

export function getRiskConfig(risk) {
  return RISK_CONFIG[risk] || RISK_CONFIG["Low"];
}