import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import zod from "zod";
import {
	getCloudflareDomainId,
	updateCloudflareDomainWithIp,
} from "./cloudflare/domain";

const app = new Hono<{ Bindings: CloudflareBindings }>();

const domainRegex = /\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;

const updateDomainSchema = zod.object({
	domain: zod.string().regex(domainRegex, "Invalid domain"),
	ip: zod.string().ip(),
});
app.use(
	basicAuth({
		verifyUser: (username, password, c) => {
			const { USERNAME, PASSWORD } = c.env;
			return username === USERNAME && password === PASSWORD;
		},
	}),
);

app.get(
	"/update-domain",
	zValidator("query", updateDomainSchema),
	async (context) => {
		try {
			const { domain, ip } = context.req.valid("query");

			const domainId = await getCloudflareDomainId({ domain, context });

			await updateCloudflareDomainWithIp({
				recordId: domainId,
				ip,
				context,
			});

			return context.text("ok");
		} catch (error: unknown) {
			return context.json({ error: "Error updating domain" }, { status: 500 });
		}
	},
);

export default app;
