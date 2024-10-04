import { Hono } from "hono";
import { verifyAuthToken } from "./auth/verifyAuthToken";
import {
	getCloudflareDomainId,
	updateCloudflareDomainWithIp,
} from "./cloudflare/domain";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/update-domain", async (c) => {
	try {
		const token = c.req.header("Authorization");

		if (!token) {
			return c.json({ error: "Missing token" }, { status: 401 });
		}

		const { ok } = verifyAuthToken({ context: c, token });

		if (!ok) {
			return c.json({ error: "Invalid API key" }, { status: 401 });
		}

		const { domain, ip } = c.req.query();

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
