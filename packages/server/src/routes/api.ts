import { Hono } from 'hono';
import Token from './getToken';
import Tts from './tts';

const app = new Hono();
//routes
app.route('/', Tts);
app.route('/', Token);

export default app;
