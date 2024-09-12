import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

class RedisClient {
	constructor() {
		this.client = null;
		this.expirationTime = 20; // seconds
	}

	async connect() {
		if (!this.client) {
			this.client = createClient({
				url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
			});
			await this.client.connect();
		}
	}

	async set(key, value) {
		await this.client.set(key, JSON.stringify(value));
	}

	async get(key) {
		const res = await this.client.get(key);
		return JSON.parse(res);
	}

	async exists(key) {
		const res = await this.client.exists(key);
		return res;
	}

	async disconnect() {
		if (this.client) {
			await this.client.disconnect();
			this.client = null;
		}
	}
}

export default RedisClient;
