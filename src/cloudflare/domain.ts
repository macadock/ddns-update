import type { Context } from "hono";
import { getCloudflareConfig } from "./getCloudflareConfig";

const CLOUDFLARE_API_URL = "https://api.cloudflare.com/client/v4";

export const getCloudflareDomainId = async ({
	domain,
	context,
}: {
	domain: string;
	context: Context<{ Bindings: CloudflareBindings }>;
}) => {
	const { cloudflareApiToken, cloudflareZoneId } = getCloudflareConfig(context);

	const response = await fetch(
		`${CLOUDFLARE_API_URL}/zones/${cloudflareZoneId}/dns_records`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${cloudflareApiToken}`,
				"Content-Type": "application/json",
			},
		},
	);

	if (!response.ok) {
		throw new Error("Failed to get Cloudflare domain ID");
	}
	const data = await response.json<{
		result: Array<{ id: string; name: string }>;
	}>();

	const recordId = data.result.find((record) => record.name === domain)?.id;

	if (!recordId) {
		throw new Error("No Cloudflare domain matching");
	}

	return recordId;
};

export const updateCloudflareDomainWithIp = async ({
	ip,
	recordId,
	context,
}: {
	ip: string;
	recordId: string;
	context: Context<{ Bindings: CloudflareBindings }>;
}) => {
	const { cloudflareApiToken, cloudflareZoneId } = getCloudflareConfig(context);
	const response = await fetch(
		`${CLOUDFLARE_API_URL}/zones/${cloudflareZoneId}/dns_records/${recordId}`,
		{
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${cloudflareApiToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: ip,
			}),
		},
	);

	if (!response.ok) {
		throw new Error("Failed to update Cloudflare domain");
	}

	const data = await response.json();
};
