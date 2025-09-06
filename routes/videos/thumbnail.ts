import { name_check } from "../../commons/commons.ts";
import config from "../../config.toml";
import path from "path";
import { db } from "../../database/db.ts";
import * as schema from "../../database/schema.ts";
import { sql } from "drizzle-orm";

export async function r_video_thumb_get(req: any){
	// Url params
	const { channel:username, video:video_id } = req.params;

	// Basic check
	if (username == null || video_id == null || name_check(username) == true)
		return new Response("Bad Request", { status: 400 });

	// Visibility check
	const [ result ] = await db.select({ video_id: schema.videos.id })
		.from(schema.videos)
		.fullJoin(schema.channels, sql`${schema.videos.channel} = ${schema.channels.id}`)
		.where(sql`${schema.channels.visible} = true and ${schema.videos.visible} = true`);

	// CHeck if video was not found
	if (result == null)
		return new Response("Not Found", { status: 404 });

	// Check for thubmnail existence
	const relative_path = path.join(config.filesystem.server_root, `/channels/${username}/thumbnails/${video_id}.png`);
	const file = Bun.file(relative_path);
	const thumbnail_exists = await file.exists();
	if (!thumbnail_exists)
		return new Response("No Content", { status: 204 });

	// Return the thumbnail file if it exists
	return new Response(file, { status: 200 });
}
