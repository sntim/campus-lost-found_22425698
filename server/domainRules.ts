export const ITEM_STATUSES = ["lost", "found", "resolved", "archived"] as const;
export const REPORT_TYPES = ["lost", "found"] as const;
export const CLAIM_STATUSES = ["pending", "approved", "rejected"] as const;

export type ItemStatus = (typeof ITEM_STATUSES)[number];
export type ReportType = (typeof REPORT_TYPES)[number];
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export function canRevealContact(input: {
  viewerRole?: string | null;
  viewerClaimStatus?: ClaimStatus | null;
}) {
  return input.viewerRole === "admin" || input.viewerClaimStatus === "approved";
}

export function isClaimableFoundItem(input: {
  reportType: ReportType;
  status: ItemStatus;
}) {
  return input.reportType === "found" && input.status === "found";
}
