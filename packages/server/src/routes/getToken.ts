import { Hono } from 'hono';

const app = new Hono();

app.post('/token', async (c) => {
	// リクエストボディの取得
	const body = await c.req.json();

	// URLSearchParamsを使ってトークンリクエストのボディを構築
	const tokenBody = new URLSearchParams({
		client_id: process.env.VITE_CLIENT_ID!,
		client_secret: process.env.CLIENT_SECRET!,
		grant_type: 'authorization_code',
		code: body.code,
	});

	// Discord APIにPOSTリクエストを送る
	const response = await fetch(
		`${process.env.VITE_DISCORD_API_BASE}/oauth2/token`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: tokenBody,
		},
	);

	// レスポンスをJSONとして取得
	const data = await response.json();
	if (response.status !== 200) {
		console.error(data);

		return c.json(data, 500); // エラーレスポンスを返す
	}

	const { access_token } = data;

	// アクセストークンをJSONで返す
	return c.json(
		{ access_token },
		{ headers: { 'Access-Control-Allow-Origin': '*' } },
	);
});
export default app;
