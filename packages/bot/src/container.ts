import 'reflect-metadata';

import { MakeDataStore, schema } from '@tts/db';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { container, inject, injectable } from 'tsyringe';

// サービスを定義する
@injectable()
export class Datastore {
	getDataStore() {
		const pool = new Pool({
			connectionString: process.env.POST_URL,
		});

		const client = drizzle<typeof schema>(pool, {
			schema: schema,
		});

		const dataStore = MakeDataStore(client);
		return dataStore;
	}
}

// コントローラを定義する
@injectable()
export class DataStoreController {
	constructor(@inject(Datastore) private dataStore: Datastore) {}

	getDataStore() {
		const store = this.dataStore.getDataStore();
		return store;
	}
}

export const dataStoreContainer = container.resolve(DataStoreController);
