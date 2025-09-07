import type { BunRequest } from "bun"
import { db } from "../../database/db.ts"
import * as schema from "../../database/schema.ts"
import { sql } from "drizzle-orm"
import { mkdir } from "node:fs/promises"
import { name_check } from "../../commons/commons.ts"
import { check_auth_token } from "../../commons/commons.ts"
import config from "../../config.toml";
import { randomBytes } from "node:crypto"

export async function r_channels_get()
{
	const result = await db.select({
		username: schema.channels.username,
		nickname: schema.channels.nickname,
		language: schema.channels.language,
		description: schema.channels.description,
	}).from(schema.channels).where(sql`${schema.channels.visible} = true`);
	
	return Response.json(result, { status: 200 });
}

export async function r_channels_post(req: BunRequest) {
	const post: any = await req.json();

	// POST params
	const { access_token, username, description } = post;
	const nickname = post.nickname ?? username;
	const visible = post.visible ?? true;
	const language = post.language ?? config.defaults.default_language ?? "";

	// Check if access token is provided
	if (access_token == null)
		return new Response("Unauthorized", { status: 401 });

	// Basic check
	if (username == null || name_check(username) == true)
		return new Response("Bad Request", { status: 400 });

	// Check access token
	if (check_auth_token("admin", access_token) == false)
		return new Response("Forbidden", { status: 403 });

	// Create api key for this channel
	const api_key = await Buffer.from(randomBytes(32)).toString("base64")

	// Create new channel in database
	try
	{
		// Insert the channel to the database
		await db.insert(schema.channels).values([
		{
			username: username,
			nickname: nickname,
			description: description,
			language: language,
			visible: visible,
			api_key: api_key
		}]);

		// Create channel directories
		await mkdir(`./server_data/channels/${username}`);
		await mkdir(`./server_data/channels/${username}/thumbnails`);
		await mkdir(`./server_data/channels/${username}/videos`);
	} catch (error) {
		return new Response("Bad Request", { status: 400 });
	}

	// Return created channel data
	return Response.json({ username: username, nickname: nickname, language: language, description: description, visible: visible, api_key: api_key });
}
