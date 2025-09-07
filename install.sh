rm -rf ./server_data
rm -rf ./drizzle
bunx drizzle-kit generate --dialect sqlite --schema ./database/schema.ts
bun install
