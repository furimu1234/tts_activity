import { Hono } from 'hono';
import { logger } from 'hono/logger';
import Dictionaries from './dictionary';
import Token from './getToken';
import Tts from './tts';


const app = new Hono();
app.use('*', logger());
//routes
app.route('/', Tts);
app.route('/', Token);
app.route('/', Dictionaries);


export default app;
