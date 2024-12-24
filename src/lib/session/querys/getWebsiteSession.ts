import { db } from '@/lib/db';
import { sessions, websiteEvents } from '@/lib/db/migrations/schema';
import { eq, sql, and } from 'drizzle-orm';
import { getTimestampDiffSQL } from '@/lib/db/utils';
import { SessionResult, WebsiteEvent } from '@/lib/session/type';

export async function getWebsiteSession(websiteId: string, sessionId: string): Promise<SessionResult | null> {
  const result = await db
    .select({
      id: sessions.id,
      websiteId: sessions.websiteId,
      hostname: sessions.hostname,
      browser: sessions.browser,
      os: sessions.os,
      device: sessions.device,
      screen: sessions.screen,
      language: sessions.language,
      country: sessions.country,
      subdivision1: sessions.subdivision1,
      subdivision2: sessions.subdivision2,
      city: sessions.city,
      createdAt: sessions.createdAt,
      websiteEvents: websiteEvents
    })
    .from(sessions)
    .leftJoin(websiteEvents, eq(sessions.id, websiteEvents.sessionId))
    .where(and(
      eq(sessions.websiteId, websiteId),
      eq(sessions.id, sessionId)
    ))
    .execute();

  if (!result || result.length === 0) return null;

  const session = result[0];
  if (!session.createdAt) return null;

  const events = result.map(r => ({
    eventType: r.websiteEvents?.eventType || 0,
    createdAt: r.websiteEvents?.createdAt || session.createdAt!,
    visitId: r.websiteEvents?.visitId || ''
  })).filter(e => e.eventType !== 0);

  const lastAt = events.length > 0 
    ? Math.max(...events.map((e: WebsiteEvent) => e.createdAt.getTime()))
    : session.createdAt.getTime();

  const totaltime = events.reduce((acc: number, curr: WebsiteEvent) => {
    const createdAtStr = curr.createdAt.toISOString();
    return acc + Number(getTimestampDiffSQL(createdAtStr, createdAtStr));
  }, 0);

  return {
    id: session.id,
    websiteId: session.websiteId,
    hostname: session.hostname,
    browser: session.browser,
    os: session.os,
    device: session.device,
    screen: session.screen,
    language: session.language,
    country: session.country,
    subdivision1: session.subdivision1,
    subdivision2: session.subdivision2,
    city: session.city,
    createdAt: session.createdAt,
    websiteEvents: events,
    firstAt: session.createdAt,
    lastAt: new Date(lastAt),
    visits: new Set(events.map((e: WebsiteEvent) => e.visitId)).size,
    views: events.filter((e: WebsiteEvent) => e.eventType === 1).length,
    events: events.filter((e: WebsiteEvent) => e.eventType === 2).length,
    totaltime,
  };
}