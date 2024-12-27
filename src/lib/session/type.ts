export interface WebsiteEvent {
    eventType: number;
    createdAt: Date;
    visitId: string;
  }
  
export interface SessionResult {
    id: string;
    websiteId: string;
    hostname: string | null;
    browser: string | null;
    os: string | null;
    device: string | null;
    screen: string | null;
    language: string | null;
    country: string | null;
    subdivision1: string | null;
    subdivision2: string | null;
    city: string | null;
    createdAt: Date;
}
  