import type { Context } from 'hono';
import type { BlankInput } from 'hono/types';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { Env } from '../env';

export const customLogger = (message: string, ...rest: string[]) => {
	console.error(message, ...rest);
};

export function makeError(
	c: Context<
		{
			Bindings: Env;
		},
		string,
		BlankInput
	>,
	message: string,
	code: ContentfulStatusCode,
) {
	return c.json({ message: message }, code);
}
