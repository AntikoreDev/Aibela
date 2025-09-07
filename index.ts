// Import the API routes
import { routes } from "./routes/routes.ts";
import config from "./config.toml";

const DOMAIN = config.host.domain || "localhost";
const PORT = config.host.port || 3621;

Bun.serve({
	port: PORT,
	routes: routes,

	// Added to calm down the wrath of the IDE
	websocket: {
		open(ws) {
			console.log('Connected');
		},
		close(ws){
			console.log('Disconnected');
		},
		message(ws, message){
			console.log('Message');
		}
	},
	fetch(req){
		return new Response("Method Not Allowed", { status: 405, headers: { 'Access-Control-Allow-Origin': '*' } });
	}
});

console.log(`Server started on ${DOMAIN}:${PORT}`);
