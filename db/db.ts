import * as dotenv from 'dotenv';
dotenv.config({ path:'../.env', override: true});

import { MongoClient, Db } from 'mongodb'


const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD


const uri = `mongodb+srv://${username}:${password}@cluster0.mhxdv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

let db: Db;

/**
 * Connects user to the PKD-proj dtabase
 * @returns connection to Db, if there is no connection
 */
export async function connectDB(): Promise<Db> {
  if (!db) {
    await client.connect()
    const ping = await client.db("PKD-proj").command({ ping: 1})
    // console.log(ping);
    db = client.db("PKD-proj");
  }

  return db;
}

// connectDB()
