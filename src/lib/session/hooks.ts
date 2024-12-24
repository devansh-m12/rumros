import { getSession } from './querys/getSession';
import { NextResponse } from 'next/server';
import { NextRequestTrack } from '@/lib/detect/type';
import { log } from 'console';

export const useSession = async (
    req: NextRequestTrack, 
    res: NextResponse, 
    next: () => void,
    parsedBody: any
) => {
    try {
      const session = await getSession(req, parsedBody);
      if (!session) {
        log('useSession: Session not found');
        return NextResponse.json({
            success: false,
            error: 'Session not found.'
        }, { status: 400 });
      }
  
      (req as any).session = session;
      next();
    } catch (e: any) {
      if (e.message.startsWith('Website not found')) {
        return NextResponse.json({
            success: false,
            error: 'Website not found.'
        }, { status: 404 });
      }
      return NextResponse.json({
        success: false,
        error: 'Bad request.'
    }, { status: 400 });
    }
} 