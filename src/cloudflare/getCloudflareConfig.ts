import type { Context } from "hono";

export const getCloudflareConfig = (
	c: Context<{ Bindings: CloudflareBindings }>,
) => {
	const cloudflareApiToken = c.env.CLOUDFLARE_API_TOKEN;
	const cloudflareZoneId = c.env.CLOUDFLARE_ZONE_ID;

	if (!cloudflareApiToken || !cloudflareZoneId) {
		throw new Error("Missing Cloudflare Credentials");
	}

	return { cloudflareApiToken, cloudflareZoneId };
};
