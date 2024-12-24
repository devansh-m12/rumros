import { sql } from "drizzle-orm";
import { 
  bigint, 
  boolean, 
  decimal,
  char,
  varchar,
  timestamp, 
  uuid, 
  pgTable, 
  text,
  integer,
  unique,
  index
} from "drizzle-orm/pg-core";

export const teams = pgTable(
  'team',
  {
    id: uuid('team_id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 50 }).notNull(),
    accessCode: varchar('access_code', { length: 50 }).unique(),
    logoUrl: varchar('logo_url', { length: 2183 }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'date' }),
  },
  (table) => [
    index('team_access_code_idx').on(table.accessCode)
  ]
);

export const users = pgTable(
  'user',
  {
    id: uuid('user_id').primaryKey().defaultRandom(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 60 }).notNull(),
    role: varchar('role', { length: 50 }).notNull(),
    logoUrl: varchar('logo_url', { length: 2183 }),
    displayName: varchar('display_name', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'date' }),
  },
  (table) => [
    index('user_username_idx').on(table.username),
    index('user_email_idx').on(table.email),
    index('user_created_at_idx').on(table.createdAt)
  ]
);

export const websites = pgTable(
  'website',
  {
    id: uuid('website_id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    domain: varchar('domain', { length: 500 }),
    shareId: varchar('share_id', { length: 50 }).unique(),
    resetAt: timestamp('reset_at', { withTimezone: true, mode: 'date' }),
    userId: uuid('user_id').references(() => users.id),
    teamId: uuid('team_id').references(() => teams.id),
    createdBy: uuid('created_by').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'date' }),
  },
  (table) => [
    index('website_user_id_idx').on(table.userId),
    index('website_team_id_idx').on(table.teamId),
    index('website_created_at_idx').on(table.createdAt),
    index('website_share_id_idx').on(table.shareId),
    index('website_created_by_idx').on(table.createdBy),
  ]
);

export const sessions = pgTable(
  'session',
  {
    id: uuid('session_id').primaryKey().defaultRandom(),
    websiteId: uuid('website_id').notNull().references(() => websites.id),
    hostname: varchar('hostname', { length: 100 }),
    browser: varchar('browser', { length: 20 }),
    os: varchar('os', { length: 20 }),
    device: varchar('device', { length: 20 }),
    screen: varchar('screen', { length: 11 }),
    language: varchar('language', { length: 35 }),
    country: char('country', { length: 2 }),
    subdivision1: varchar('subdivision1', { length: 20 }),
    subdivision2: varchar('subdivision2', { length: 50 }),
    city: varchar('city', { length: 50 }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  },
  (table) => [
    index('session_created_at_idx').on(table.createdAt),
    index('session_website_id_idx').on(table.websiteId),
    index('session_website_created_idx').on(table.websiteId, table.createdAt),
  ]
);

export const websiteEvents = pgTable(
  'website_event',
  {
    id: uuid('event_id').primaryKey().defaultRandom(),
    websiteId: uuid('website_id').notNull().references(() => websites.id),
    sessionId: uuid('session_id').notNull().references(() => sessions.id),
    visitId: uuid('visit_id').notNull(),
    urlPath: varchar('url_path', { length: 500 }).notNull(),
    urlQuery: varchar('url_query', { length: 500 }),
    referrerPath: varchar('referrer_path', { length: 500 }),
    referrerQuery: varchar('referrer_query', { length: 500 }),
    referrerDomain: varchar('referrer_domain', { length: 500 }),
    pageTitle: varchar('page_title', { length: 500 }),
    eventType: integer('event_type').default(1),
    eventName: varchar('event_name', { length: 50 }),
    tag: varchar('tag', { length: 50 }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  },
  (table) => [
    index('website_event_created_at_idx').on(table.createdAt),
    index('website_event_session_id_idx').on(table.sessionId),
    index('website_event_website_id_idx').on(table.websiteId),
    index('website_event_visit_id_idx').on(table.visitId),
    index('website_event_website_created_idx').on(table.websiteId, table.createdAt),
    index('website_event_url_path_idx').on(table.websiteId, table.createdAt, table.urlPath),
    index('website_event_event_name_idx').on(table.websiteId, table.createdAt, table.eventName),
    index('website_event_tag_idx').on(table.websiteId, table.createdAt, table.tag)
  ]
);

export const teamUsers = pgTable(
  'team_user',
  {
    id: uuid('team_user_id').primaryKey().defaultRandom(),
    teamId: uuid('team_id').notNull().references(() => teams.id),
    userId: uuid('user_id').notNull().references(() => users.id),
    role: varchar('role', { length: 50 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  },
  (table) => [
    index('team_user_team_id_idx').on(table.teamId),
    index('team_user_user_id_idx').on(table.userId),
  ]
);

export const reports = pgTable(
  'report',
  {
    id: uuid('report_id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id),
    websiteId: uuid('website_id').notNull().references(() => websites.id),
    type: varchar('type', { length: 200 }).notNull(),
    name: varchar('name', { length: 200 }).notNull(),
    description: varchar('description', { length: 500 }).notNull(),
    parameters: varchar('parameters', { length: 6000 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  },
  (table) => [
    index('report_user_id_idx').on(table.userId),
    index('report_website_id_idx').on(table.websiteId),
    index('report_type_idx').on(table.type),
    index('report_name_idx').on(table.name),
  ]
);

export const eventData = pgTable(
  'event_data',
  {
    id: uuid('event_data_id').primaryKey().defaultRandom(),
    websiteId: uuid('website_id').notNull().references(() => websites.id),
    websiteEventId: uuid('website_event_id').notNull().references(() => websiteEvents.id),
    dataKey: varchar('data_key', { length: 500 }).notNull(),
    stringValue: varchar('string_value', { length: 500 }),
    numberValue: decimal('number_value', { precision: 19, scale: 4 }),
    dateValue: timestamp('date_value', { withTimezone: true, mode: 'date' }),
    dataType: integer('data_type').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  },
  (table) => [
    index('event_data_created_at_idx').on(table.createdAt),
    index('event_data_website_id_idx').on(table.websiteId),
    index('event_data_website_event_id_idx').on(table.websiteEventId),
  ]
);

export const sessionData = pgTable(
  'session_data',
  {
    id: uuid('session_data_id').primaryKey().defaultRandom(),
    websiteId: uuid('website_id').notNull().references(() => websites.id),
    sessionId: uuid('session_id').notNull().references(() => sessions.id),
    dataKey: varchar('data_key', { length: 500 }).notNull(),
    stringValue: varchar('string_value', { length: 500 }),
    numberValue: decimal('number_value', { precision: 19, scale: 4 }),
    dateValue: timestamp('date_value', { withTimezone: true, mode: 'date' }),
    dataType: integer('data_type').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  },
  (table) => [
    index('session_data_created_at_idx').on(table.createdAt),
    index('session_data_website_id_idx').on(table.websiteId),
    index('session_data_session_id_idx').on(table.sessionId),
  ]
);

