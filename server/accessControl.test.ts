import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function anonymousContext(): TrpcContext {
  return {
    user: null,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function studentContext(): TrpcContext {
  const now = new Date();
  return {
    user: {
      id: 7,
      openId: "student-user",
      name: "Student User",
      email: "student@example.edu",
      loginMethod: "manus",
      role: "student",
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now,
    },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("FindBack access control", () => {
  it("rejects an unauthenticated attempt to create a lost-item report", async () => {
    const caller = appRouter.createCaller(anonymousContext());
    await expect(
      caller.items.create({
        reportType: "lost",
        title: "Blue notebook",
        description: "A blue notebook with a handwritten name inside the cover.",
        category: "Books",
        eventDate: "2026-08-12",
        location: "Library",
      }),
    ).rejects.toMatchObject<Partial<TRPCError>>({ code: "UNAUTHORIZED" });
  });

  it("rejects a student attempt to change an item status", async () => {
    const caller = appRouter.createCaller(studentContext());
    await expect(
      caller.admin.updateItemStatus({ itemId: 1, status: "archived" }),
    ).rejects.toMatchObject<Partial<TRPCError>>({ code: "FORBIDDEN" });
  });
});
