import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "../db";
import { ITEM_STATUSES, REPORT_TYPES } from "../domainRules";
import { storagePut } from "../storage";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date.");
const imageDataSchema = z.string().max(5_700_000, "The image is too large.").optional();

function parseImageDataUrl(imageDataUrl: string) {
  const match = imageDataUrl.match(
    /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/,
  );
  if (!match) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Only PNG, JPEG, or WebP image uploads are allowed.",
    });
  }

  const [, mimeType, encoded] = match;
  const bytes = Buffer.from(encoded, "base64");
  if (bytes.length === 0 || bytes.length > 4 * 1024 * 1024) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The image must be no larger than 4 MB.",
    });
  }

  const extension = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
  return { bytes, extension, mimeType };
}

export const itemsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          query: z.string().trim().max(80).optional(),
          category: z.string().trim().max(60).optional(),
          status: z.enum(ITEM_STATUSES).optional(),
          fromDate: dateSchema.optional(),
          toDate: dateSchema.optional(),
          page: z.number().int().min(1).default(1),
          pageSize: z.number().int().min(1).max(24).default(8),
        })
        .default({ page: 1, pageSize: 8 }),
    )
    .query(({ input }) => db.listItems(input)),

  detail: publicProcedure
    .input(z.object({ itemId: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      const item = await db.getItemDetail(input.itemId, ctx.user?.id, ctx.user?.role);
      if (!item) {
        throw new TRPCError({ code: "NOT_FOUND", message: "The requested item was not found." });
      }
      return item;
    }),

  create: protectedProcedure
    .input(
      z.object({
        reportType: z.enum(REPORT_TYPES),
        title: z.string().trim().min(3).max(140),
        description: z.string().trim().min(10).max(3000),
        category: z.string().trim().min(2).max(60),
        eventDate: dateSchema,
        location: z.string().trim().min(2).max(200),
        imageDataUrl: imageDataSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      let imageKey: string | undefined;
      let imageUrl: string | undefined;

      if (input.imageDataUrl) {
        const image = parseImageDataUrl(input.imageDataUrl);
        const stored = await storagePut(
          `item-images/${ctx.user.id}/${Date.now()}.${image.extension}`,
          image.bytes,
          image.mimeType,
        );
        imageKey = stored.key;
        imageUrl = stored.url;
      }

      const status = input.reportType;
      const item = await db.createItem({
        reporterId: ctx.user.id,
        reportType: input.reportType,
        status,
        title: input.title,
        description: input.description,
        category: input.category,
        eventDate: input.eventDate,
        location: input.location,
        imageKey,
        imageUrl,
      });

      return item;
    }),

  mine: protectedProcedure.query(({ ctx }) => db.listItemsByReporter(ctx.user.id)),
});
