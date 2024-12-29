import { db } from '@/lib/db';
import { sessions } from '@/lib/db/migrations/schema';
import { SessionResult } from '../type';

export async function createSession(data: {
    id: string;
    websiteId: string;
    hostname?: string | null;
    browser?: string | null;
    os?: string | null;
    device?: string | null;
    screen?: string | null;
    language?: string | null;
    country?: string | null;
    subdivision1?: string | null;
    subdivision2?: string | null;
    city?: string | null;
}): Promise<SessionResult> {
    const {
        id,
        websiteId,
        hostname,
        browser,
        os,
        device,
        screen,
        language,
        country,
        subdivision1,
        subdivision2,
        city,
    } = data;

    const createdAt = new Date();

    await db.insert(sessions).values({
        id,
        websiteId,
        hostname: hostname || null,
        browser: browser || null,
        os: os || null,
        device: device || null,
        screen: screen || null,
        language: language || null,
        country: country || null,
        subdivision1: subdivision1 || null,
        subdivision2: subdivision2 || null,
        city: city || null,
    });

    return {
        id,
        websiteId,
        hostname: hostname || null,
        browser: browser || null,
        os: os || null,
        device: device || null,
        screen: screen || null,
        language: language || null,
        country: country || null,
        subdivision1: subdivision1 || null,
        subdivision2: subdivision2 || null,
        city: city || null,
        createdAt,
    };
}