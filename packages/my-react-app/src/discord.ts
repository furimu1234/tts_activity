import { DiscordSDK } from '@discord/embedded-app-sdk';

export const discordSdk = new DiscordSDK(import.meta.env.VITE_CLIENT_ID);

export async function setup() {
	// Wait for READY payload from the discord client
	await discordSdk.ready();

	// Pop open the OAuth permission modal and request for access to scopes listed in scope array below
	const { code } = await discordSdk.commands.authorize({
		client_id: import.meta.env.VITE_CLIENT_ID,
		response_type: 'code',
		state: '',
		prompt: 'none',
		scope: ['identify', 'guilds'],
	});

	// Retrieve an access_token from your application's server
	const response = await fetch('/.proxy/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			code,
		}),
	});
	const responseJson = await response.json();
	const { access_token } = responseJson;

	// Authenticate with Discord client (using the access_token)
	const auth = await discordSdk.commands.authenticate({
		access_token,
	});

	return { auth };
}
