import path from "path";
import config from "../config.toml";
import { name_check } from "../commons/commons";
import { db } from "../database/db";
import * as schema from "../database/schema.ts";
import { sql } from "drizzle-orm";

/**
 * This endpoint returns the icon of a channel
 */
export async function r_channel_icon_get(req: any) {
	// Url params
	const username = req.params.channel;

	// Basic check
	if (username == null || name_check(username) == true)
		return new Response("Bad Request", {status: 400 });

	// Visibility check
	const [result] = await db.select().from(schema.channels).where(sql`${schema.channels.username} = ${username} and ${schema.channels.visible} = true`);
	if (result == null)
		return new Response("Not Found", { status: 404 });

	// Channel icon search
	const relative_path = path.join(config.filesystem.server_root, `/channels/${username}/icon.png`);
	const file = Bun.file(relative_path);

	const icon_exists = await file.exists();
	if (!icon_exists){
		return new Response("No Content", { status: 204 });
	}

	// Return the icon
	return new Response(file, { status: 200 });
}

export async function r_channel_icon_put(req: any) {
	return new Response("Not implemented", { status: 501 });
}
