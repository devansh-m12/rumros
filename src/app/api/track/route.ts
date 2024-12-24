import { saveSessionData } from '@/lib/session/querys/saveSession';
import { COLLECTION_TYPE } from '@/lib/constants';
import { NextRequestTrack } from '@/lib/detect/type';
import { useSession } from '@/lib/session/hooks';
import { NextRequest, NextResponse } from 'next/server';
import { saveEvent } from '@/lib/events/querys';
import { createWebsite, getWebsiteByDomain } from '@/lib/website/querys';
import cryptoRandomString from 'crypto-random-string';
import { SignJWT } from 'jose';
import { TextEncoder } from 'util';

// Helper functions
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

const secret = () => {
    return process.env.JWT_SECRET || 'secret';
};

const createToken = async (session: any, secretKey: string) => {
    const payload = {
        id: session.id,
        websiteId: session.websiteId,
        iat: session.iat
    };
    
    const encoder = new TextEncoder();
    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('365d')
        .sign(encoder.encode(secretKey));

    return jwt;
};

export async function POST(req: NextRequestTrack) {
    try {
        const body = await req.json();
        const { type, payload } = body;
        const { url, referrer, name: eventName, data, title, tag } = payload;
        const pageTitle = decodeURI(title);

        // Get or create website
        let website = await getWebsiteByDomain(payload.hostname);
        if (!website) {
            website = await createWebsite({
                name: payload.hostname,
                domain: payload.hostname,
            });
            if (!website) {
                return NextResponse.json(
                    { message: 'Failed to create website' },
                    { status: 500 }
                );
            }
        }

        // Update the payload with the website ID
        body.payload.website = website.id;

        // Create or get session
        await useSession(req, NextResponse.next(), () => {}, body);
        const session = req?.session;
       
        // if session not found, return bad request
        if(!session) {
            return NextResponse.json(
                { message: 'Session not found' },
                { status: 400 }
            );
        }

        const curriat = Math.floor(new Date().getTime() / 1000);

        // expire session after 30 minutes
        const expire = curriat + 30 * 60;

        // if session expired, return bad request
        if( session?.iat && session?.iat < curriat) {
            session.visitId = generateUUID([session.id, visitSalt()]);
        }
        session.iat = curriat;

        if(type === COLLECTION_TYPE.event) {
            // eslint-disable-next-line prefer-const
            let [urlPath, urlQuery] = decodeURI(url)?.split('?') || [];
            let [referrerPath, referrerQuery] = decodeURI(referrer)?.split('?') || [];
            let referrerDomain = '';

            if (!urlPath) {
                urlPath = '/';
            }

            if (/^[\w-]+:\/\/\w+/.test(referrerPath)) {
                const refUrl = new URL(referrer);
                referrerPath = refUrl.pathname;
                referrerQuery = refUrl.search.substring(1);
                referrerDomain = refUrl.hostname.replace(/www\./, '');
            }

            if (process.env.REMOVE_TRAILING_SLASH) {
                urlPath = urlPath.replace(/(.+)\/$/, '$1');
            }

           try {
            await saveEvent({
                ...session,
                sessionId: session.id as string,
                websiteId: session.websiteId as string,
                visitId: session.visitId as string,
                urlPath,
                urlQuery,
                referrerPath,
                referrerQuery,
                referrerDomain,
                pageTitle,
                eventName,
                eventData: data,
                tag,
            });
           } catch (error) {
            console.error('Tracking error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to save event' },
                { status: 500 }
            );
           }
            
        } else if (type === COLLECTION_TYPE.identify) {
            if (!data) {
              return NextResponse.json(
                { success: false, error: 'Data required.' },
                { status: 400 }
            );
            }
      
            await saveSessionData({
              websiteId: session.websiteId,
              sessionId: session.id,
              sessionData: data,
            });
          }

          const token = createToken(session, secret());

          return NextResponse.json({ success: true, token, session });

    } catch (error) {
        console.error('Tracking error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process tracking request' },
            { status: 500 }
        );
    }
}