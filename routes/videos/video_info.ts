import { db } from "../../database/db.ts";
import { sql } from "drizzle-orm";
import * as schema from "../../database/schema.ts";
import { name_check } from "../../commons/commons.ts";

export async function r_video_info_get(req: any){
	
	// URL params
	const { channel: username, video: video_id } = req.params;

	// Basic check
	if (username == null || video_id == null || name_check(username) == true)
		return new Response("Bad Request", { status: 400 })

	// Fetch video information
	const [ video ] = await db.select({
		id: schema.videos.id,
		name: schema.videos.name,
		title: schema.videos.title,
		description: schema.videos.description,
		upload_date: schema.videos.upload_date,
		prev: schema.videos.prev,
		next: schema.videos.next,
		language: schema.videos.language
	}).from(schema.videos).where(sql`${schema.videos.id} = ${video_id} and ${schema.videos.visible} = true and ${schema.videos.channel} 
		= (select ${schema.channels.id} from ${schema.channels} where ${schema.channels.username} = ${username} and ${schema.channels.visible} = true)`);

	// Check if video was not found
	if (video == null)
		return new Response("Not Found", { status: 404 });

	// Return video content if it exists
	return Response.json(video, { status: 200 });
}

