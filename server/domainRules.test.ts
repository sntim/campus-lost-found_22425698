import { describe, expect, it } from "vitest";
import { ITEM_STATUSES, canRevealContact, isClaimableFoundItem } from "./domainRules";

describe("FindBack domain rules", () => {
  it("uses only the four required item statuses", () => {
    expect(ITEM_STATUSES).toEqual(["lost", "found", "resolved", "archived"]);
  });

  it("reveals reporter contact only to administrators or an approved claimant", () => {
    expect(canRevealContact({ viewerRole: "student", viewerClaimStatus: "pending" })).toBe(false);
    expect(canRevealContact({ viewerRole: "student", viewerClaimStatus: "approved" })).toBe(true);
    expect(canRevealContact({ viewerRole: "admin" })).toBe(true);
  });

  it("accepts ownership claims only for active found-item reports", () => {
    expect(isClaimableFoundItem({ reportType: "found", status: "found" })).toBe(true);
    expect(isClaimableFoundItem({ reportType: "lost", status: "lost" })).toBe(false);
    expect(isClaimableFoundItem({ reportType: "found", status: "resolved" })).toBe(false);
  });
});
