import { sql } from "drizzle-orm";
import { db } from "../database/db.ts";
import * as schema from "../database/schema.ts";
import { access_tokens } from "../routes/feeder/auth.ts";

export const name_check = (str: string): boolean => /[^a-zA-Z0-9_]/gm.test(str);

export function check_auth_token(channel_name: string, access_token: string): boolean {
	const token = access_tokens.get(channel_name);
	if (token == null)
		return false;
	
	return token.access_token == access_token && token.expiration_date > Date.now();
}

export function get_channel_language(channel_name: string): string {
	if (channel_name == null) return "";
	
	db.select({ language: schema.channels.language })
		.from(schema.channels)
		.where(sql`${schema.channels.username} = ${channel_name}`);

	return "";
}