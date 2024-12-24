import { EVENT_NAME_LENGTH, EVENT_TYPE, PAGE_TITLE_LENGTH , URL_LENGTH } from "@/lib/constants";
import { db } from "@/lib/db";
import { saveEventData } from "./saveEventData";
import { websiteEvents } from "@/lib/db/migrations/schema";

export async function saveEvent(data: {
    websiteId: string;
    sessionId: string;
    visitId: string;
    urlPath: string;
    urlQuery?: string;
    referrerPath?: string;
    referrerQuery?: string;
    referrerDomain?: string;
    pageTitle?: string;
    eventName?: string;
    eventData?: any;
    tag?: string;
  }) {
    const {
      websiteId,
      sessionId,
      visitId,
      urlPath,
      urlQuery,
      referrerPath,
      referrerQuery,
      referrerDomain,
      eventName,
      eventData,
      pageTitle,
      tag,
    } = data;
  
    const websiteEvent = await db.insert(websiteEvents).values({
        websiteId,
        sessionId,
        visitId,
        urlPath: urlPath?.substring(0, URL_LENGTH),
        urlQuery: urlQuery?.substring(0, URL_LENGTH),
        referrerPath: referrerPath?.substring(0, URL_LENGTH),
        referrerQuery: referrerQuery?.substring(0, URL_LENGTH),
        referrerDomain: referrerDomain?.substring(0, URL_LENGTH),
        pageTitle: pageTitle?.substring(0, PAGE_TITLE_LENGTH),
        eventType: eventName ? EVENT_TYPE.customEvent : EVENT_TYPE.pageView,
        eventName: eventName ? eventName?.substring(0, EVENT_NAME_LENGTH) : null,
        tag,
      }).returning();
  
    if (eventData) {
      await saveEventData({
        websiteId,
        eventId: websiteEvent[0].id,
        eventData,
      });
    }
  
    return websiteEvent[0];
  }