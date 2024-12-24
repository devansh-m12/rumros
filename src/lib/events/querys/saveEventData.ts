import { DATA_TYPE } from "@/lib/constants";
import { db } from "@/lib/db";
import { flattenJSON, getStringValue } from "@/lib/utils/data";
import { uuid } from "drizzle-orm/pg-core";
import { eventData } from "@/lib/db/migrations/schema";

export async function saveEventData(data: {
    websiteId: string;
    eventId: string;
    eventData: any;
  }): Promise<any> {
    const { websiteId, eventId, eventData } = data;
  
    const jsonKeys = flattenJSON(eventData);
  
    // id, websiteEventId, eventStringValue
    const flattenedData = jsonKeys.map((a:any) => ({
      id: uuid(),
      websiteEventId: eventId,
      websiteId,
      dataKey: a.key,
      stringValue: getStringValue(a.value, a.dataType),
      numberValue: a.dataType === DATA_TYPE.number ? a.value : null,
      dateValue: a.dataType === DATA_TYPE.date ? new Date(a.value) : null,
      dataType: a.dataType,
    }));
  
    return db.insert(eventData).values(flattenedData);
  }