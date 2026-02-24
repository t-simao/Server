import * as dotenv from 'dotenv';
dotenv.config()

import { Map } from './lib/building';
import { connectDB } from './db/db'
import { WithId } from "mongodb";

/**
 * A building
 * @param _id the building name
 * @param map the map of the building
 */
export type Building = {
    _id: string
    map: Map
}

/**
 * Creates a map in the database
 * @param id the map id 
 * @param map the map, will be empty when created
 * @returns the newly created map or undefined
 */
export async function createMap(id: string, map: Map): Promise<{ _id: string; map: Map } | undefined> {
    const db = await connectDB();
    const maps = db.collection<Building>("maps")

    await maps.insertOne({
        _id: id,
        map: map
    })

    const get_map = await maps.findOne({_id: id,})

    if (!get_map) return;
    
    return {_id: get_map._id, map: get_map.map}
}

/**
 * Finds a map in the database
 * @param id map id/name
 * @returns returns the map or undefined
 */
export async function findMap(id: string): Promise<{ _id: string; map: Map } | undefined> {
    const db = await connectDB();
    const maps = db.collection<Building>("maps")

    const res = await maps.findOne({_id: id,})

    if (!res || res.map === undefined) return;
    
    return {_id: res._id, map: res.map}
}

/**
 * Updates a specifik map
 * @param id map id
 * @param map map with the updates
 * @returns the updated map or undefined
 */
export async function UpdateMap(id: string, map: Map): Promise<{ _id: string; map: Map } | undefined> {
    const db = await connectDB();
    const maps = db.collection<Building>("maps")

    await maps.updateOne({_id: id},{$set: { map: map }})

    const res = await maps.findOne({_id: id,})

    if (!res || res.map === undefined) return;
    
    return {_id: res._id, map: res.map}
}

/**
 * Fetches all the maps from the database
 * @returns all the maps from the database
 */
export async function getAll(): Promise<WithId<Building>[]> {
    const db = await connectDB();
    const maps = db.collection<Building>("maps")

    const res = await maps.find().toArray();

    return res
}