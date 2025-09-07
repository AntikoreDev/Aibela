import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const channels = sqliteTable("channels", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement:true }).unique(),
	username: text().notNull().unique(),
	nickname: text().notNull(),
	description: text(),
	visible: integer({ mode: "boolean" }).default(true),
	language: text(),
	api_key: text(),
});

export const videos = sqliteTable("videos", {
	id: integer({ mode: "number" }).primaryKey({ autoIncrement:true }).unique(),
	name: text().notNull(),
	title: text().notNull(),
	description: text(),
	upload_date: text().default(sql`(CURRENT_TIMESTAMP)`),
	language: text(),
	prev: integer({ mode: "number" }),
	next: integer({ mode: "number" }),
	visible: integer({ mode: "boolean" }).default(true),
	access_key: text(),
	channel: integer({ mode: "number" }).references(() => channels.id).notNull(),
});
