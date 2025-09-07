import config from "../../config.toml";

/*
 * This endpoints returns an auto-repo (a feeder repo with just this feeder listed). Intended for easy share and inclusion to clients.
 */
export async function r_feeder_get(req: any)
{
	const { domain, port, root_domain } = config.host;
	const res = (root_domain != "" ? root_domain : `${domain}:${port}`);
	return new Response(res, { status: 200, headers: { "Content-Type": "text/plain" } });
}
