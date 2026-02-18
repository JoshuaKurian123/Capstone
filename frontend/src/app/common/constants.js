export const BadgeColorMap = {
  INACTIVE: "secondary",
  ACTIVE: "success",
  DRAFT: "secondary",
  APPROVED: "success",
  REJECTED: "danger",
  EXPIRED: "secondary",
  SUBMITTED: "secondary",
  IN_REVIEW: "primary",
  SETTLED: "secondary",
};

export const USER_ROLE_OPTIONS = [
  "ADMIN",
  "UNDERWRITER",
  "CLAIMS_ADJUSTER",
  "REINSURANCE_ANALYST",
];

export const USER_TABLE_COLUMNS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

export const USER_PERMISSION_OPTIONS = {
  ADMIN: ["CREATE", "UPDATE", "DELETE"],
  UNDERWRITER: ["CREATE", "UPDATE", "APPROVE"],
  CLAIMS_ADJUSTER: ["CREATE", "UPDATE", "APPROVE"],
  REINSURANCE_ANALYST: ["CREATE", "UPDATE", "APPROVE", "DELETE"],
};

export const POLICY_TABLE_COLUMNS = [
  { key: "policyNumber", label: "Policy Number" },
  { key: "insuredName", label: "Insured Name" },
  { key: "insuredType", label: "Insured Type" },
  { key: "lineOfBusiness", label: "Line of Business" },
  { key: "sumInsured", label: "Sum Insured" },
  { key: "premium", label: "Premium" },
  { key: "retentionLimit", label: "Retention Limit" },
  { key: "status", label: "Status" },
  { key: "effectiveFrom", label: "Effective from" },
  { key: "effectiveTo", label: "Effective to" },
  { key: "createdBy", label: "Created By" },
  { key: "approvedBy", label: "Approved By" },
  { key: "actions", label: "Actions" },
];

export const POLICY_INSURED_TYPE_OPTIONS = ["INDIVIDUAL", "CORPORATE"];

export const LOB_OPTIONS = ["HEALTH", "MOTOR", "LIFE", "PROPERTY"];

export const CLAIM_TABLE_COLUMNS = [
  { key: "claimNumber", label: "Claim Number" },
  { key: "policyId", label: "Policy ID" },
  { key: "claimAmount", label: "Claim Amount" },
  { key: "approvedAmount", label: "Approved Amount" },
  { key: "status", label: "Status" },
  { key: "incidentDate", label: "Incident Date" },
  { key: "reportedDate", label: "Reported Date" },
  { key: "handledBy", label: "Handled By" },
  { key: "actions", label: "Actions" },
];

export const REINSURER_TABLE_COLUMNS = [
  { key: "code", label: "ID" },
  { key: "name", label: "Name" },
  { key: "contactEmail", label: "Email ID" },
  { key: "country", label: "Country" },
  { key: "rating", label: "Rating" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

export const REINSURER_RATING_OPTIONS = ["AAA", "AA", "A", "BBB"];

export const TREATY_TYPE_OPTIONS = ["QUOTA_SHARE", "SURPLUS"];

export const TREATY_TABLE_COLUMNS = [
  { key: "treatyName", label: "Treaty Name" },
  { key: "treatyType", label: "Type" },
  { key: "reinsurerId", label: "Reinsurer ID" },
  { key: "sharePercentage", label: "Share %" },
  { key: "retentionLimit", label: "Retention Limit" },
  { key: "treatyLimit", label: "Treaty Limit" },
  { key: "effectiveFrom", label: "Effective From" },
  { key: "effectiveTo", label: "Effective To" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

export const RISK_ALLOCATION_VIEW_COLUMNS = [
  { key: "reinsurer", label: "Reinsurer" },
  { key: "treaty", label: "Treaty" },
  { key: "retentionLimit", label: "Retention Limit" },
  { key: "treatyLimit", label: "Treaty Limit" },
  { key: "allocatedAmount", label: "Allocated Amount" },
  { key: "allocatedPercentage", label: "Allocated %" },
];

export const ADMIN_LINKS = [
  { label: "Home", url: "/dashboard" },
  { label: "User", url: "/user" },
];

export const UNDERWRITER_LINKS = [
  { label: "Home", url: "/dashboard" },
  { label: "Policy", url: "/policy" },
];

export const CLAIMS_ADJUSTER_LINKS = [
  { label: "Home", url: "/dashboard" },
  { label: "Claim", url: "/claim" },
];

export const REINSURER_ANALYST_LINKS = [
  { label: "Home", url: "/dashboard" },
  { label: "Reinsurer", url: "/reinsurer" },
  { label: "Treaty", url: "/treaty" },
  { label: "View Risk", url: "/risk-view" },
];

export const SOMETHING_WENT_WRONG = "Something went wrong.";
