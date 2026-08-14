import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "../db";
import { ITEM_STATUSES } from "../domainRules";
import { adminProcedure, router } from "../_core/trpc";

export const adminRouter = router({
  overview: adminProcedure.query(() => db.getAdminOverview()),

  claims: adminProcedure.query(() => db.listAdminClaims()),

  updateItemStatus: adminProcedure
    .input(z.object({ itemId: z.number().int().positive(), status: z.enum(ITEM_STATUSES) }))
    .mutation(async ({ input }) => {
      const updated = await db.updateItemStatus(input.itemId, input.status);
      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "The item could not be found." });
      }
      return updated;
    }),

  reviewClaim: adminProcedure
    .input(
      z.object({
        claimId: z.number().int().positive(),
        decision: z.enum(["approved", "rejected"]),
        adminNote: z.string().trim().max(800).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await db.reviewClaim({
          claimId: input.claimId,
          reviewedBy: ctx.user.id,
          decision: input.decision,
          adminNote: input.adminNote,
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "The claim could not be reviewed.",
        });
      }
    }),
});
