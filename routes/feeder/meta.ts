import config from "../../config.toml";

/**
 * This endpoint returns general information about a feeder
 */
export async function r_meta_get(req: any) {

	// Get metadata
	const metadata = {
		name: config.meta.name,
		description: config.meta.description,
		owner: config.meta.owner,
	};

	// Return metadata
	return Response.json(metadata, { status: 200 });
}
