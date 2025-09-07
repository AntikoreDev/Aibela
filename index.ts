/*
import { watch } from 'fs'
const watcher = watch(import.meta.dir, (event, filename) => {
	console.log(`Detected ${event} in ${filename}`);
});

process.on("SIGINT", () => {
	console.log("Closing watcher...");
	watcher.close();
})
*/

// Import the API routes
import { routes } from "./routes/routes.ts";
import config from "./config.toml";

const DOMAIN = config.host.domain || "localhost";
const PORT = config.host.port || 3621;

Bun.serve({
	port: PORT,
	routes: routes,
	fetch(req){
		return new Response("Method Not Allowed", { status: 405, headers: { 'Access-Control-Allow-Origin': '*' } });
	}
});

console.log(`Server started on ${DOMAIN}:${PORT}`);
