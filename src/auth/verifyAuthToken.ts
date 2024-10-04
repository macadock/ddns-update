import type { Context } from "hono";

export const verifyAuthToken = ({
	token,
	context,
}: { token: string; context: Context<{ Bindings: CloudflareBindings }> }) => {
	const { USERNAME, PASSWORD } = context.env;

	const serverToken = createBasicAuthToken(USERNAME, PASSWORD);

	return {
		ok: token === serverToken,
	};
};

const createBasicAuthToken = (username: string, password: string): string => {
	const token = `${username}:${password}`;
	const base64Token = btoa(decodeURIComponent(encodeURIComponent(token)));
	return `Basic ${base64Token}`;
};
