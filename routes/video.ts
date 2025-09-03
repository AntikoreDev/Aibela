import config from "../config.toml";
import path from "path";
import { db } from "../database/db.ts";
import * as schema from "../database/schema.ts";
import { check_auth_token } from "../commons/commons.ts";
import { sql } from "drizzle-orm";
import { randomBytes } from "crypto";

export async function r_video_get(req: any){
	const username = req.params.channel;
	const video_id = req.params.video;

	// Check if username and video id are provided
	if (username == null || video_id == null)
		return new Response("Bad Request", { status: 400 });

	// Visibility check
	const [ result ] = await db.select({ video_id: schema.videos.id })
		.from(schema.channels)
		.innerJoin(schema.videos, sql`${schema.videos.channel} = ${schema.channels.id}`)
		.where(sql`${schema.channels.visible} = true and ${schema.videos.visible} = true and ${schema.videos.id} = ${video_id}`);

	// Check if video was found
	if (result == null)
		return new Response("Not Found", { status: 404 });


	const relative_path = path.join(config.filesystem.server_root, `/channels/${username}/videos/${video_id}.mp4`);
	const video = Bun.file(relative_path);
	const video_exists = await video.exists();
	if (!video_exists)
		return new Response("Not Found", { status: 404 });

	return new Response(video, { status: 200 });
}

// Update video
export async function r_video_put(req: any){
	const form_data = await req.formData();

	// Url params
	const { channel:username, video:video_id  } = req.params;

	// FormData params 
	const access_token = form_data.get("access_token");
	const title = form_data.get("title");
	const description = form_data.get("description");
	const video = form_data.get("video");
	const thumbnail = form_data.get("thumbnail");
	const prev = form_data.get("prev");
	const next = form_data.get("next");
	let visible = form_data.get("visible");
	visible = (visible == "false") ? false : true;

	// Null checks
	if (access_token == null)
		return new Response("Unauthorized", { status: 401 });
	if (username == null || video_id == null)
		return new Response("Bad Request", { status: 400 });

	// Auth Check
	const is_allowed = check_auth_token(username, access_token) || check_auth_token("admin", access_token);
	if (!is_allowed)
		return new Response("Forbidden", { status: 403 });

	if (title != null)
		await db.update(schema.videos).set({ title:title }).where(sql`${schema.videos.id} = ${video_id}`);

	if (description != null)
		await db.update(schema.videos).set({ description:description }).where(sql`${schema.videos.id} = ${video_id}`);

	if (prev != null)
		await db.update(schema.videos).set({ prev:prev }).where(sql`${schema.videos.id} = ${video_id}`);

	if (next != null)
		await db.update(schema.videos).set({ next:next }).where(sql`${schema.videos.id} = ${video_id}`);

	if (visible != null)
	{
		const access_key = (visible == false) ? Buffer.from(randomBytes(64)).toString("base64") : null;
		await db.update(schema.videos).set({ visible:visible, access_key:access_key }).where(sql`${schema.videos.id} = ${video_id}`);
	}

	const video_path = path.join(config.filesystem.server_root, `/channels/${username}/videos/${video_id}.mp4`);
	const video_file = Bun.file(video_path);
	if (await video_file.exists() == false)
			return new Response("Not Found", { status: 404 });

	if (video != null)
		video_file.write(video);

	if (thumbnail != null)
	{
		const thumbnail_path = path.join(config.filesystem.server_root, `/channels/${username}/thumbnails/${video_id}.png`);
		Bun.file(thumbnail_path).write(thumbnail);
	}
		
	return new Response("OK", { status: 200 });
}
