import { Hono } from "hono";
import {
	getCloudflareDomainId,
	updateCloudflareDomainWithIp,
} from "./cloudflare/domain";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", (c) => {
	return c.text("Hello World!");
});

app.get("/update-domain", async (c) => {
	try {
		const { domain, ip } = c.req.query();

		if (!domain || !ip) {
			throw new Error("Missing domain or ip");
		}

		const domainId = await getCloudflareDomainId({ domain, context: c });

		await updateCloudflareDomainWithIp({ ip, recordId: domainId, context: c });

		return c.text("Updated");
	} catch (error: unknown) {
		return c.json({ error: "Error updating domain" }, { status: 500 });
	}
});

export default app;
