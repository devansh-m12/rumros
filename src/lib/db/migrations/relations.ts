import { relations } from "drizzle-orm";
import { 
  users,
  sessions,
  websites,
  websiteEvents,
  teams,
  teamUsers,
  reports,
  eventData,
  sessionData
} from "./schema";

export const userRelations = relations(users, ({ many }) => ({
  websitesOwned: many(websites, { relationName: "user" }),
  websitesCreated: many(websites, { relationName: "createUser" }),
  teamUsers: many(teamUsers),
  reports: many(reports),
}));

export const websiteRelations = relations(websites, ({ one, many }) => ({
  user: one(users, {
    fields: [websites.userId],
    references: [users.id],
    relationName: "user",
  }),
  createUser: one(users, {
    fields: [websites.createdBy],
    references: [users.id],
    relationName: "createUser",
  }),
  team: one(teams, {
    fields: [websites.teamId],
    references: [teams.id],
  }),
  sessions: many(sessions),
  events: many(websiteEvents),
  eventData: many(eventData),
  reports: many(reports),
}));

export const sessionRelations = relations(sessions, ({ one, many }) => ({
  website: one(websites, {
    fields: [sessions.websiteId],
    references: [websites.id],
  }),
  websiteEvents: many(websiteEvents),
  sessionData: many(sessionData),
}));

export const websiteEventRelations = relations(websiteEvents, ({ one, many }) => ({
  website: one(websites, {
    fields: [websiteEvents.websiteId],
    references: [websites.id],
  }),
  session: one(sessions, {
    fields: [websiteEvents.sessionId],
    references: [sessions.id],
  }),
  eventData: many(eventData),
}));

export const teamRelations = relations(teams, ({ many }) => ({
  websites: many(websites),
  teamUsers: many(teamUsers),
}));

export const teamUserRelations = relations(teamUsers, ({ one }) => ({
  team: one(teams, {
    fields: [teamUsers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamUsers.userId],
    references: [users.id],
  }),
}));

export const reportRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
  website: one(websites, {
    fields: [reports.websiteId],
    references: [websites.id],
  }),
}));

export const eventDataRelations = relations(eventData, ({ one }) => ({
  website: one(websites, {
    fields: [eventData.websiteId],
    references: [websites.id],
  }),
  websiteEvent: one(websiteEvents, {
    fields: [eventData.websiteEventId],
    references: [websiteEvents.id],
  }),
}));

export const sessionDataRelations = relations(sessionData, ({ one }) => ({
  website: one(websites, {
    fields: [sessionData.websiteId],
    references: [websites.id],
  }),
  session: one(sessions, {
    fields: [sessionData.sessionId],
    references: [sessions.id],
  }),
}));
