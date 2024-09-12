import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

// if required parameter are not present in the env file, the application
// will throw an error untill all the required parameters are added
const requiredParams = ["REDIS_HOST", "REDIS_PORT"];
requiredParams.map((param) => {
	if (process.env[param] === undefined) {
		throw new Error(
			`required redis parameter missing. app startup halted. add all the required env variables. ${requiredParams}`
		);
	}
});

class RedisClient {
	constructor() {
		this.client = null;
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
