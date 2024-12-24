import { db } from '@/lib/db';
import { websites } from '@/lib/db/migrations/schema';

export async function createWebsite(data: {
    name: string;
    domain?: string;
    userId?: string;
    teamId?: string;
    createdBy?: string;
}) {
    const {
        name,
        domain,
        userId,
        teamId,
        createdBy,
    } = data;

    const [website] = await db.insert(websites).values({
        name,
        domain: domain || null,
        userId: userId || null,
        teamId: teamId || null,
        createdBy: createdBy || null,
    }).returning();

    return website;
} 