import { Hono } from "hono";
import {
	getCloudflareDomainId,
	updateCloudflareDomainWithIp,
} from "./cloudflare/domain";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/update-domain", async (c) => {
	try {
		const { API_KEY } = c.env;

		const { domain, ip, key } = c.req.query();

		if (key !== API_KEY) {
			return c.json({ error: "Invalid API key" }, { status: 401 });
		}

		if (!domain || !ip) {
			return c.json({ error: "Missing domain or ip" }, { status: 400 });
		}

		const domainId = await getCloudflareDomainId({ domain, context: c });

		await updateCloudflareDomainWithIp({ ip, recordId: domainId, context: c });

		return c.text("Updated");
	} catch (error: unknown) {
		return c.json({ error: "Error updating domain" }, { status: 500 });
	}
});

export default app;
