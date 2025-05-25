export async function registerMembers(
	channelId: string,
): Promise<string | undefined> {
	const response = await fetch(
		`http://localhost:9000/register_members?channelId=${channelId}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);

	if (response.status === 200) return undefined;

	return (await response.json()).message;
}
