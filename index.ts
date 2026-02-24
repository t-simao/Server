import * as dotenv from 'dotenv';
dotenv.config()

import { make_map, Map } from './lib/building';
import { findMap, createMap, UpdateMap, Building, getAll } from './functions';
import express, {Express, Request, Response } from 'express';
import cors from "cors";



const PORT = process.env.SR_PORT || 9000

const app: Express = express()
app.use(express.json())
app.use(cors());

app.get("/maps/get/all", async (req, res)=> {
    const maps = await getAll()

    if (!maps) return res.status(404).json({error: "NOOOO!"});

    res.json(maps);
})

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

app.post("/maps/create/:id", async (
    req: Request<{id: string}, Building>, 
    res: Response<Building | {error: string}>
) => {

    if (typeof req.params.id !== "string") {
        return res.status(400).json({ error: "Wrong format information" });
    }

    const map = await createMap(req.params.id, make_map());

    if (!map) return res.status(404).json({error: "FAIL!"});

    res.json(map);
})

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


app.listen(PORT, () => {
    console.log(`${PORT}`)
})