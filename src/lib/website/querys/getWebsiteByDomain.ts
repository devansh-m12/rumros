import { db } from '@/lib/db';
import { websites } from '@/lib/db/migrations/schema';
import { eq } from 'drizzle-orm';

export async function getWebsiteByDomain(domain: string) {
    const [website] = await db
        .select()
        .from(websites)
        .where(eq(websites.domain, domain))
        .limit(1);

    return website;
} 