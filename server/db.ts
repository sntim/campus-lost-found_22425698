import { and, desc, eq, gte, like, lte, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { claims, items, notifications, type InsertUser, users } from "../drizzle/schema";
import {
  canRevealContact,
  isClaimableFoundItem,
  type ClaimStatus,
  type ItemStatus,
  type ReportType,
} from "./domainRules";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

function databaseUnavailable(): never {
  throw new Error("The database is temporarily unavailable. Please try again shortly.");
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "student");
  updateSet.role = values.role;

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export type ItemFilters = {
  query?: string;
  category?: string;
  status?: ItemStatus;
  fromDate?: string;
  toDate?: string;
  page: number;
  pageSize: number;
};

export async function listItems(filters: ItemFilters) {
  const db = await getDb();
  if (!db) databaseUnavailable();

  const conditions = [];
  if (filters.query) {
    const term = `%${filters.query}%`;
    conditions.push(or(like(items.title, term), like(items.description, term), like(items.location, term)));
  }
  if (filters.category) conditions.push(eq(items.category, filters.category));
  if (filters.status) conditions.push(eq(items.status, filters.status));
  if (filters.fromDate) conditions.push(gte(items.eventDate, filters.fromDate));
  if (filters.toDate) conditions.push(lte(items.eventDate, filters.toDate));
  const whereClause = conditions.length ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(items)
    .where(whereClause);
  const records = await db
    .select({
      id: items.id,
      reportType: items.reportType,
      status: items.status,
      title: items.title,
      description: items.description,
      category: items.category,
      eventDate: items.eventDate,
      location: items.location,
      imageUrl: items.imageUrl,
      createdAt: items.createdAt,
      reporterName: users.name,
    })
    .from(items)
    .leftJoin(users, eq(items.reporterId, users.id))
    .where(whereClause)
    .orderBy(desc(items.createdAt))
    .limit(filters.pageSize)
    .offset((filters.page - 1) * filters.pageSize);

  return {
    records,
    total: Number(total),
    page: filters.page,
    pageSize: filters.pageSize,
    totalPages: Math.max(1, Math.ceil(Number(total) / filters.pageSize)),
  };
}

export async function createItem(input: {
  reporterId: number;
  reportType: ReportType;
  status: ItemStatus;
  title: string;
  description: string;
  category: string;
  eventDate: string;
  location: string;
  imageKey?: string;
  imageUrl?: string;
}) {
  const db = await getDb();
  if (!db) databaseUnavailable();
  const result = await db.insert(items).values(input);
  const itemId = Number(result[0].insertId);
  const created = await db.select().from(items).where(eq(items.id, itemId)).limit(1);
  return created[0];
}

export async function getItemDetail(itemId: number, viewerId?: number, viewerRole?: string) {
  const db = await getDb();
  if (!db) databaseUnavailable();

  const record = await db
    .select({
      id: items.id,
      reporterId: items.reporterId,
      reportType: items.reportType,
      status: items.status,
      title: items.title,
      description: items.description,
      category: items.category,
      eventDate: items.eventDate,
      location: items.location,
      imageUrl: items.imageUrl,
      createdAt: items.createdAt,
      updatedAt: items.updatedAt,
      reporterName: users.name,
      reporterEmail: users.email,
    })
    .from(items)
    .leftJoin(users, eq(items.reporterId, users.id))
    .where(eq(items.id, itemId))
    .limit(1);
  const item = record[0];
  if (!item) return undefined;

  let viewerClaimStatus: ClaimStatus | undefined;
  if (viewerId) {
    const viewerClaim = await db
      .select({ claimStatus: claims.claimStatus })
      .from(claims)
      .where(and(eq(claims.itemId, itemId), eq(claims.claimantId, viewerId)))
      .limit(1);
    viewerClaimStatus = viewerClaim[0]?.claimStatus;
  }
  const contactVisible = canRevealContact({ viewerRole, viewerClaimStatus });

  return {
    ...item,
    reporterEmail: contactVisible ? item.reporterEmail : null,
    contactVisible,
    viewerClaimStatus: viewerClaimStatus ?? null,
  };
}

export async function listItemsByReporter(reporterId: number) {
  const db = await getDb();
  if (!db) databaseUnavailable();
  return db.select().from(items).where(eq(items.reporterId, reporterId)).orderBy(desc(items.createdAt));
}

export async function createClaim(input: {
  itemId: number;
  claimantId: number;
  ownershipProof: string;
}) {
  const db = await getDb();
  if (!db) databaseUnavailable();
  const target = await db.select().from(items).where(eq(items.id, input.itemId)).limit(1);
  const item = target[0];
  if (!item) throw new Error("This item is no longer available.");
  if (item.reporterId === input.claimantId) throw new Error("You cannot claim an item you reported.");
  if (!isClaimableFoundItem({ reportType: item.reportType, status: item.status })) {
    throw new Error("Only active found items can receive ownership claims.");
  }
  const duplicate = await db
    .select({ id: claims.id })
    .from(claims)
    .where(and(eq(claims.itemId, input.itemId), eq(claims.claimantId, input.claimantId)))
    .limit(1);
  if (duplicate[0]) throw new Error("You have already submitted a claim for this item.");

  const result = await db.insert(claims).values({ ...input, claimStatus: "pending" });
  const claimId = Number(result[0].insertId);
  const created = await db.select().from(claims).where(eq(claims.id, claimId)).limit(1);
  return created[0];
}

export async function listClaimsByClaimant(claimantId: number) {
  const db = await getDb();
  if (!db) databaseUnavailable();
  return db
    .select({
      id: claims.id,
      claimStatus: claims.claimStatus,
      ownershipProof: claims.ownershipProof,
      adminNote: claims.adminNote,
      createdAt: claims.createdAt,
      reviewedAt: claims.reviewedAt,
      itemId: items.id,
      itemTitle: items.title,
      itemStatus: items.status,
      itemImageUrl: items.imageUrl,
    })
    .from(claims)
    .innerJoin(items, eq(claims.itemId, items.id))
    .where(eq(claims.claimantId, claimantId))
    .orderBy(desc(claims.createdAt));
}

export async function listAdminClaims() {
  const db = await getDb();
  if (!db) databaseUnavailable();
  return db
    .select({
      id: claims.id,
      claimStatus: claims.claimStatus,
      ownershipProof: claims.ownershipProof,
      adminNote: claims.adminNote,
      createdAt: claims.createdAt,
      reviewedAt: claims.reviewedAt,
      itemId: items.id,
      itemTitle: items.title,
      itemStatus: items.status,
      claimantName: users.name,
      claimantEmail: users.email,
    })
    .from(claims)
    .innerJoin(items, eq(claims.itemId, items.id))
    .innerJoin(users, eq(claims.claimantId, users.id))
    .orderBy(desc(claims.createdAt));
}

export async function reviewClaim(input: {
  claimId: number;
  reviewedBy: number;
  decision: "approved" | "rejected";
  adminNote?: string;
}) {
  const db = await getDb();
  if (!db) databaseUnavailable();
  const existing = await db.select().from(claims).where(eq(claims.id, input.claimId)).limit(1);
  const claim = existing[0];
  if (!claim) throw new Error("The claim could not be found.");
  if (claim.claimStatus !== "pending") throw new Error("Only pending claims can be reviewed.");

  await db.transaction(async tx => {
    await tx
      .update(claims)
      .set({
        claimStatus: input.decision,
        reviewedBy: input.reviewedBy,
        reviewedAt: new Date(),
        adminNote: input.adminNote || null,
      })
      .where(eq(claims.id, input.claimId));
    await tx.insert(notifications).values({
      userId: claim.claimantId,
      type: input.decision === "approved" ? "claim_approved" : "claim_rejected",
      title: input.decision === "approved" ? "Claim approved" : "Claim rejected",
      body:
        input.decision === "approved"
          ? "Your ownership claim was approved. The reporter’s contact details are now available on the item page."
          : "Your ownership claim was not approved. You can review the administrator note in your profile.",
      itemId: claim.itemId,
      claimId: claim.id,
    });
  });

  return { success: true } as const;
}

export async function updateItemStatus(itemId: number, status: ItemStatus) {
  const db = await getDb();
  if (!db) databaseUnavailable();
  const result = await db.update(items).set({ status }).where(eq(items.id, itemId));
  return Number(result[0].affectedRows) > 0;
}

export async function listNotifications(userId: number) {
  const db = await getDb();
  if (!db) databaseUnavailable();
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationRead(notificationId: number, userId: number) {
  const db = await getDb();
  if (!db) databaseUnavailable();
  const result = await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
  return Number(result[0].affectedRows) > 0;
}

export async function getAdminOverview() {
  const db = await getDb();
  if (!db) databaseUnavailable();
  const [itemCount] = await db.select({ count: sql<number>`count(*)` }).from(items);
  const [claimCount] = await db.select({ count: sql<number>`count(*)` }).from(claims);
  const [pendingCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(claims)
    .where(eq(claims.claimStatus, "pending"));
  const recentItems = await listItems({ page: 1, pageSize: 5 });
  return {
    itemCount: Number(itemCount.count),
    claimCount: Number(claimCount.count),
    pendingClaimCount: Number(pendingCount.count),
    recentItems: recentItems.records,
  };
}
