import { DATA_TYPE } from "@/lib/constants";
import { db } from "@/lib/db";
import { flattenJSON, getStringValue } from "@/lib/utils/data";
import { eq } from "drizzle-orm";
import { sessionData } from "@/lib/db/migrations/schema";

export async function saveSessionData(data: {
    websiteId: string;
    sessionId: string;
    sessionData: any;
  }) {
    const { websiteId, sessionId, sessionData: inputSessionData } = data;
  
    const jsonKeys = flattenJSON(inputSessionData);
  
    const flattenedData = jsonKeys.map((a:any) => ({
      websiteId,
      sessionId,
      dataKey: a.key,
      stringValue: getStringValue(a.value, a.dataType),
      numberValue: a.dataType === DATA_TYPE.number ? a.value : null,
      dateValue: a.dataType === DATA_TYPE.date ? new Date(a.value) : null,
      dataType: a.dataType,
    }));
    
    const existing = await db
      .select({
        id: sessionData.id,
        sessionId: sessionData.sessionId,
        dataKey: sessionData.dataKey,
      })
      .from(sessionData)
      .where(eq(sessionData.sessionId, sessionId));
  
    for (const data of flattenedData) {
      const { sessionId, dataKey, ...props } = data;
      const record = existing.find(e => e.sessionId === sessionId && e.dataKey === dataKey);
  
      if (record) {
        await db
          .update(sessionData)
          .set(props)
          .where(eq(sessionData.id, record.id));
      } else {
        await db.insert(sessionData).values(data);
      }
    }
  
    return flattenedData;
  }