
import { name_check } from "../../commons/commons.ts"
import { check_auth_token } from "../../commons/commons.ts"
import * as schema from "../../database/schema.ts";
import { db } from "../../database/db.ts";
import { sql } from "drizzle-orm";
import { randomBytes } from "node:crypto";

export async function r_regen_put(req: any) {
	const put: any = await req.json();

	const { access_token } = put;
	const { channel: channel } = req.params;

	if (access_token == null)
		return new Response("Unauthorized", { status: 401 });

	if (channel == null || name_check(channel))
		return new Response("Bad Request", { status: 400 });

	// Check access token
	if (!check_auth_token("admin", access_token))
		return new Response("Forbidden", { status: 403 });

	// Create api key for this channel
	const api_key = await Buffer.from(randomBytes(32)).toString("base64");

	// Create new channel in database
	try
	{
		await db.update(schema.channels).set({ api_key: api_key }).where(sql`${schema.channels.username} = ${channel}`);
	} catch (error) {
		return new Response("Bad Request", { status: 400 });
	}

	// Return created channel data
	return Response.json({ channel: channel, api_key: api_key });
}
