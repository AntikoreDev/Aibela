rm -rf ./server_data
bunx drizzle-kit generate --dialect sqlite --schema ./database/schema.ts
bun install
