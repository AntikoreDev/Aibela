import { db } from "../../database/db.ts";
import { sql, desc } from "drizzle-orm";
import * as schema from "../../database/schema.ts";
import { check_auth_token, name_check } from "../../commons/commons.ts";
import { randomBytes } from "node:crypto";
import path from "node:path";
import config from "../../config.toml";

export async function r_videos_post(req: any) {
	const form_data: any = await req.formData();
	
	// Url params
	const channel_name = req.params.channel;
	// FormData params
	const access_token = form_data.get("access_token");
	const title = form_data.get("title");
	const description = form_data.get("description");
	const video = form_data.get("video")
	const thumbnail = form_data.get("thumbnail");
	const prev = form_data.get("prev");
	const next = form_data.get("next");
	const visible = form_data.get("visible") ?? true;
	
	// Check auth token
	if (access_token == null)
		return new Response("Unauthorized", { status: 401 });

	// Check params
	if (channel_name == null || title == null || video == null || name_check(channel_name) == true)
		return new Response("Bad Request", { status: 400 });

	// Auth Check
	const is_allowed = check_auth_token(channel_name, access_token) || check_auth_token("admin", access_token);
	if (!is_allowed)
		return new Response("Forbidden", { status: 403 });

	// Get channel id
	const [ channel ] = await db.select({ id: schema.channels.id })
		.from(schema.channels).where(sql`${schema.channels.username} = ${channel_name}`);

	// Check if channel exists
	if (channel?.id == null)
		return new Response("Not found", { status: 404 });
	
	// Set video name(url) and access key if needed
	const name = Buffer.from(randomBytes(16)).toString("base64url");
	const access_key = (visible == false) ? Buffer.from(randomBytes(64)).toString("base64") : null;

	// New db entry
	await db.insert(schema.videos).values([
		{
			name: name,
			title: title,
			description: description,
			prev: prev,
			next: next,
			visible: visible,
			access_key: access_key,
			channel: channel.id,
		}
	]);	

	// Get new video id
	const [ new_video ] = await db.select({ id: schema.videos.id })
		.from(schema.videos).orderBy(desc(schema.videos.id)).limit(1);
	const id = new_video?.id;

	// Create file for the uplodaded video
	const video_path = path.join(config.filesystem.server_root, `/channels/${channel_name}/videos/${id}.mp4`);
	await Bun.write(video_path, video);

	// Create file for the uploaded thumbnial (if there was one)
	if (thumbnail != null){
		const thumbnail_path = path.join(config.filesystem.server_root, `/channels/${channel_name}/thumbnails/${id}.png`);
		await Bun.write(thumbnail_path, thumbnail);
	}
	
	// Return the id and access key for the new video created
	return Response.json({
		id: id,
		access_key: access_key
	}, { status: 201 });
}

/**
 * This endpoint searchs for all videos within a channel.
 */
export async function r_videos_get(req: any)
{
	// Get channel name provided
	const channel_name = req.params.channel;

	// Check if channel name wasn't provided
	if (channel_name == null)
		return new Response("Bad Request", { status: 400 });

	// Search for videos for the specified channel
	const result = await db.select({
		id: schema.videos.id,
		name: schema.videos.name,
		title: schema.videos.title,
		description: schema.videos.description,
		upload_date: schema.videos.upload_date,
		prev: schema.videos.prev,
		next: schema.videos.next,
	}).from(schema.videos).where(sql`${schema.videos.visible} = true and ${schema.videos.channel} = (select ${schema.channels.id} from ${schema.channels} where ${schema.channels.username} = ${channel_name} and ${schema.channels.visible} = true)`);
	
	// If channel wasn't found
	if (result == null)
		return new Response("Not Found", { status: 404 });

	// Return video catalogue
	return Response.json(result);
}

/*
 *This endpoints searchs and sends the list of all videos in the current feeder
 */
export async function r_allvideos_get(req: any) {

	// Search all videos from all channels
	const result = await db.select({
		id: schema.videos.id,
		name: schema.videos.name,
		title: schema.videos.title,
		description: schema.videos.description,
		upload_date: schema.videos.upload_date,
		prev: schema.videos.prev,
		next: schema.videos.next,
		channel: schema.channels.username
	}).from(schema.videos).fullJoin(schema.channels, sql`${schema.videos.channel} = ${schema.channels.id}`).where(sql`${schema.channels.visible} = true and ${schema.videos.visible} = true`);

	// Return video list
	return Response.json(result, { status: 200 });
}
