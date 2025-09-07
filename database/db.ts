// Create directory structure (if it doesn't exist) //
import { mkdir } from "node:fs/promises"
if (await Bun.file("./server_data/channels/admin").exists() == false)
{
	console.log("Creating directory structure...")
	await mkdir("./server_data/channels/admin", { recursive: true });
}

// Database initialization
const file_exists = await Bun.file("./server_data/sqlite.db").exists();

// Create sqlite.db file duh!
import { Database } from 'bun:sqlite'
const sqlite = new Database("./server_data/sqlite.db");

// Setup drizzle (ORM) and export db for later use.
import { drizzle } from 'drizzle-orm/bun-sqlite'
export const db = drizzle(sqlite);

// If sqlite.db wasn't found, migrate and seed new database.
import { migrate } from "drizzle-orm/bun-sqlite/migrator"
import * as schema from "./schema"
if (file_exists == false)
{
	console.log("No database found, creating...");

	migrate(db, {migrationsFolder: "./drizzle"});
	await db.insert(schema.channels).values([
		{
			username: "admin",
			nickname: "admin",
			language: "",
			description: "Default super secret admin account :3",
			visible: false,
			api_key: await Bun.password.hash("admin")
		}
	]);
}

/*
	Use the following command only if changes were made to the database tables
	bunx drizzle-kit generate --dialect sqlite --schema ./database/schema.ts
*/
