import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const channels = sqliteTable("channels", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement:true }).unique(),
	username: text().notNull().unique(),
	nickname: text().notNull(),
	description: text(),
	visible: integer({ mode: "boolean" }).default(true),
	language: text().default(''),
	api_key: text(),
});

export const videos = sqliteTable("videos", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement:true }).unique(), // Internal identifier
	name: text().notNull(), // Unique identifier to ease access
	title: text().notNull(), // Video title
	description: text(), // Video description
	upload_date: text().default(sql`(CURRENT_TIMESTAMP)`), // Upload date. Can be changed but in general it shouldn't
	language: text().default(''), // Video language. Defaults to no language.
	prev: integer({ mode: "number" }), // Previous video ID in case this is on a series
	next: integer({ mode: "number" }), // Next video ID in case this is on a series.
	visible: integer({ mode: "boolean" }).default(true), // If the video is visible as is.
	access_key: text(), // Access key, used to access the video in case it is not visible
	channel: integer({ mode: "number" }).references(() => channels.id).notNull(), // The channel considered the video owner
});
