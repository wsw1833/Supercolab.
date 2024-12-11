import { MongoClient } from "mongodb";

const uri = process.env.NEXT_PUBLIC_MONGO_URI;

let cachedClient = null;

export async function connectDB() {
    if (cachedClient) {
        return cachedClient.db("test");
    }

    const client = new MongoClient(uri);

    await client.connect();

    cachedClient = client;

    return client.db("test");
}