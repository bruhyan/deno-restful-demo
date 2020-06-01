// should be in ignore file

import { MongoClient } from "https://deno.land/x/mongo@v0.7.0/mod.ts";

const client = new MongoClient();
client.connectWithUri("");

const db = client.database('notes');

export default db;