import * as dotenv from 'dotenv';
dotenv.config()

import { make_map, Map } from './lib/building';
import { findMap, createMap, UpdateMap, Building, getAll } from './functions';
import express, {Express, Request, Response } from 'express';
import cors from "cors";



const PORT = process.env.SR_PORT || 9000

// initiates the express framewok 
const app: Express = express()
// translate json data into readable Javascript object
app.use(express.json())
// Allows request from all sites 
app.use(cors());

// Route to get all the buildings
app.get("/maps/get/all", async (req, res)=> {
    const maps = await getAll()

    if (!maps) return res.status(404).json({error: "NOOOO!"});

    res.json(maps);
})

// Rounde to get a specific building by id
app.get("/maps/get/:id", async (
    req: Request<{id: string}, Building>, 
    res: Response<Building | {error: string}>
) => {

    if (typeof req.params.id !== "string") {
        return res.status(400).json({ error: "Wrong format information" });
    }

    const map = await findMap(req.params.id)

    if (!map) return res.status(404).json({error: "NOOOO!"});

    res.json(map);
})

// Route to create a building by id
app.post("/maps/create/:id", async (
    req: Request<{id: string}, Building, {map: Map}>, 
    res: Response<Building | {error: string}>
) => {
    const the_map = req.body.map

    if (typeof req.params.id !== "string") {
        return res.status(400).json({ error: "Wrong format information" });
    }

    const map = await createMap(req.params.id, the_map);

    if (!map) return res.status(404).json({error: "FAIL!"});

    res.json(map);
})

// Route to update a building by id in the params and data given via body
app.post("/maps/update/:id", async (
    req: Request<{id: string}, Building, {map: Map}>, 
    res: Response< Building | { error: string } >
) => {
    const id = req.params.id
    const new_map = req.body.map
    
    if (typeof id !== "string") {
        return res.status(400).json({ error: "Wrong format information" });
    }

    const map = await UpdateMap(id, new_map);

    if (!map) return res.status(404).json({error: "FAIL!"});

    res.json(map);
})


export default app;