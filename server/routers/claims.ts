import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "../db";
import { protectedProcedure, router } from "../_core/trpc";

export const claimsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        itemId: z.number().int().positive(),
        ownershipProof: z.string().trim().min(20).max(1500),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        return await db.createClaim({
          itemId: input.itemId,
          claimantId: ctx.user.id,
          ownershipProof: input.ownershipProof,
        });
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "The claim could not be submitted.",
        });
      }
    }),

  mine: protectedProcedure.query(({ ctx }) => db.listClaimsByClaimant(ctx.user.id)),
});
