import { check_auth_token, name_check } from "../../commons/commons.ts";
import { db } from "../../database/db.ts"
import * as schema from "../../database/schema.ts"
import { sql } from "drizzle-orm"

export async function r_channel_get(req: any)
{
	const channel = req.params.channel;
	if (channel == null || name_check(channel) == true)
		return new Response("Bad Request", {status: 400});

	const [result] = await db.select({
		username: schema.channels.username,
		nickname: schema.channels.nickname,
		description: schema.channels.description,
		language: schema.channels.language
	}).from(schema.channels).where(sql`${schema.channels.username} = ${channel} and ${schema.channels.visible} = true`);
	
	if (result == null) 
		return new Response("Not Found", { status: 404 });
	
	return Response.json(result);
}

export async function r_channel_put(req: any)
{
	const post = await req.json();

	// Params //
	const { channel:username } = req.params; // Url
	const { access_token, nickname, description, visible, language } = post; // Post
	
	if (username == null)
		return new Response("Bad Request", { status: 400 });

	// Null check
	if (access_token == null)
		return new Response("Unauthorized", { status: 401 });

	// Auth check
	const is_allowed = check_auth_token(username, access_token) || check_auth_token("admin", access_token);
	if (!is_allowed)
		return new Response("Forbidden", { status: 403 });

	// Update values given
	if (nickname != null)
		await db.update(schema.channels).set({ nickname:nickname }).where(sql`${schema.channels.username} = ${username}`);

	if (description != null)
		await db.update(schema.channels).set({ description: description }).where(sql`${schema.channels.username} = ${username}`);

	if (visible != null)
		await db.update(schema.channels).set({ visible:visible }).where(sql`${schema.channels.username} = ${username}`);

	if (language != null)
		await db.update(schema.channels).set({ language:language }).where(sql`${schema.channels.username} = ${username}`);

	return new Response("OK", { status: 200 });
}

export async function r_channel_delete(req: any){
	return new Response("Not implemented", { status: 501 });
}