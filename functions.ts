import * as dotenv from 'dotenv';
dotenv.config()

import { Map } from './lib/building';
import { connectDB } from './db/db'
import { WithId } from "mongodb";


export type Building = {
    _id: string
    map: Map
}


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



export async function findMap(id: string): Promise<{ _id: string; map: Map } | undefined> {
    const db = await connectDB();
    const maps = db.collection<Building>("maps")

    const res = await maps.findOne({_id: id,})

    if (!res || res.map === undefined) return;
    
    return {_id: res._id, map: res.map}
}

export async function UpdateMap(id: string, map: Map): Promise<{ _id: string; map: Map } | undefined> {
    const db = await connectDB();
    const maps = db.collection<Building>("maps")

    await maps.updateOne({_id: id},{$set: { map: map }})

    const res = await maps.findOne({_id: id,})

    if (!res || res.map === undefined) return;
    
    return {_id: res._id, map: res.map}
}

export async function getAll(): Promise<WithId<Building>[]> {
    const db = await connectDB();
    const maps = db.collection<Building>("maps")

    const res = await maps.find().toArray();

    return res
}