import type { BunRequest } from "bun";
import { db } from "../../database/db.ts"
import * as schema from "../../database/schema.ts"
import { sql } from "drizzle-orm"
import { randomBytes } from "node:crypto"
import { name_check } from "../../commons/commons.ts";

export const access_tokens = new Map();

/**
 * This endpoint authorizes an user and gives it an access token. Requires the username and their api key
 */
export async function r_auth_post(req: BunRequest)
{
	// POST params
	const post: any = await req.json();
	const { channel, api_key } = post;

	// Basic checks
	if (channel == null || api_key == null || name_check(channel) == true)
		return new Response("Bad Request", { status: 400 });

	// Get user hashed api key from db
	const [result] = await db.select().from(schema.channels).where(sql`${schema.channels.username} = ${channel}`);
	const api_key_hash = result?.api_key;
	if (api_key_hash == null)
		return new Response("Internal Server Error", { status: 500 });

	// Check if password is correct
	if (await Bun.password.verify(api_key, api_key_hash) == false)
		return new Response("Unauthorized", { status: 401 });

	// Generate new access token
	const new_access_token = {
		channel: channel,
		access_token: Buffer.from(randomBytes(32)).toString("base64"),
		expiration_date: Date.now() + (1000 * 60 * 60)
	};

	// Set the new access token and return it.
	access_tokens.set(new_access_token.channel, new_access_token);
	return Response.json(new_access_token);
}
