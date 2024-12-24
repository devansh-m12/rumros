// import { getWebsite } from "@/lib/website/querys";
import { getWebsiteSession } from "@/lib/session/querys";
import { getClientInfo } from "@/lib/detect/utils";
import { createSession } from "@/lib/session/querys";
import { NextRequestTrack } from "@/lib/detect/type";
import cryptoRandomString from 'crypto-random-string';

const generateUUID = (parts: string[]): string => {
    const combinedString = parts.join('-');
    const hash = cryptoRandomString({ length: 32, type: 'hex' });
    return [
        hash.slice(0, 8),
        hash.slice(8, 12),
        hash.slice(12, 16),
        hash.slice(16, 20),
        hash.slice(20, 32)
    ].join('-');
};

const visitSalt = () => {
    return cryptoRandomString({ length: 8, type: 'hex' });
};

export const getSession = async (req: NextRequestTrack, parsedBody: any) => {
    try {
        const { payload } = parsedBody;
        const { website: websiteId, hostname, screen, language } = payload;

        const modifiedReq = {
            headers: req.headers,
            body: {
                payload: {
                    screen: screen || '',
                }
            }
        };
        const { userAgent, browser, os, ip, country, subdivision1, subdivision2, city, device } = await getClientInfo(modifiedReq);

        const sessionId = generateUUID([websiteId, hostname || '', ip || '', userAgent || '']);
        const visitId = generateUUID([sessionId, visitSalt()]);

        let session = await getWebsiteSession(websiteId, sessionId);
        if (!session) {
            try {
                session = await createSession({
                    id: sessionId,
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
            } catch (error) {
                console.error('Session creation error:', error);
                return null;
            }
        }

        if (!session) {
            return null;
        }

        return {
            ...session,
            visitId
        };
    } catch (error) {
        console.error('Get session error:', error);
        throw error;
    }
}