import { type List, pair, list, tail, head } from './list';
import { hash_id, ph_empty, ph_insert, ph_lookup, ProbingHashtable } from './hashtables'

// Data type definitions
export type Pathway_type = "hallway_S" | "hallway_L" | "elevator" | "ramp" | "stairs" | "hallway_C";
export const Pathway_type_arr: Array<string> = [ "hallway_S", "hallway_L", "elevator", "ramp", "stairs", "hallway_C"];

export const Pathway_cost: Record<Pathway_type, number> = {
    hallway_S: 5,
    ramp: 8,
    hallway_C: 10,
    hallway_L: 10,
    elevator: 12,
    stairs: 20 
}

type Node = {
    id: number;
    name: string
    floor: number;
};

/**
 * An edge in a weighted graph
 * @invariant The head of the pair is a non-negative weight from one to node to another
 * @invariant The tail of the edge is the destinated node
 */
export type Edge = {
    to: number, 
    type: Pathway_type, 
    weight: number 
};

/**
 * A graph in edge lists representation is
 *     an array of lists of target node ids.
 * @param adj the array of
 * @param size the number of nodes
 * @invariant The length of the outer array is size.
 * @invariant Every target node id is a non-negative number less than size.
 * @invariant None of the target node ids appears twice in the same list.
 */
export type Map = {
    places: ProbingHashtable<string, Node>,
    nodes: Array<Node>
    adj: Array<List<Edge>>, // Lists may not be sorted
    size: number
};

// Helper functions

function make_node(name: string, floor: number, idx: number): Node {
    return {
        id: idx,
        name: name,
        floor: floor
    };
}

function make_edge(to: Node, type: Pathway_type) {
    const Weight = Pathway_cost[type]

    return {
        to: to.id,
        type: type,
        weight: Weight
    }
}

function helper_add_path(map: Map, idx: number, path: Edge): void {

    map.adj[idx] = pair(path, map.adj[idx]);
}

function get_dst(map: Map, edge: Edge): string {

    const dst = map.nodes[edge.to]
    return dst.name;
}

export function get_node_ht(map: Map, place: string): Node | undefined {

    return ph_lookup(map.places, place);;
}

export function get_node_arr(map: Map, idx: number): Node {

    return map.nodes[idx];
}

export function get_id(node: Node): number {

    return node.id;;
}

export function get_name(node: Node): string {

    return node.name;
}
export function get_name_by_id(map: Map, id: number): string {

    const arr = map.nodes;
    const curr_node = arr[id];

    return curr_node.name;
}

function helper_rev_path(map: Map, idx: number, dst: number): void {

    let allpaths_fromsrc = map.adj[idx];

    let temp: List<Edge> = null;

    while(allpaths_fromsrc !== null) {

        if(head(allpaths_fromsrc).to !== dst) {

            temp = pair(head(allpaths_fromsrc), temp);
        }

        allpaths_fromsrc = tail(allpaths_fromsrc);
    }

    map.adj[idx] = temp;
}

function path_exist(map: Map, from: Node, to: Node): boolean {

    const src_idx = get_id(from);
    let allpaths_fromsrc = map.adj[src_idx];

    while(allpaths_fromsrc !== null) {

        if(head(allpaths_fromsrc).to === to.id) {

            return true;
        }

        allpaths_fromsrc = tail(allpaths_fromsrc);
    }

    return false;
}
// Main functions

/**
 * Maken an empty graph which satisfies the Map type
 * @returns a graph which satisfies the Map type
 */
export function make_map(): Map{
    return {
        places: ph_empty<string, Node>(15, hash_id),
        nodes: [],
        adj: [],
        size: 0
    };
}

export function add_place(map: Map, name: string, floor: number): number {

    if(get_node_ht(map, name) !== undefined) {

        console.log(`A place called ${name} already exists!!`)
        return -1;

    } else if(name === "") { 

        console.log(`Enter A valid name for the place!!`)
        return -1;

    } else {
        const idx = map.size;
        const key = name;
        const node = make_node(name, floor, idx);
        
        ph_insert(map.places, key, node);

        map.adj.push(list());
        map.nodes[idx] = node;
        map.size = map.size + 1;

        console.log(name);
        console.log(`${name} was added to floor number ${floor}`)
        
        return 0;
    }
    
}

export function add_path(map: Map, from: string, type: Pathway_type, to: string): number {

    const src = get_node_ht(map, from);
    const dst = get_node_ht(map, to);

    if(src === undefined) {

        console.log(`A place called ${from} does not exist, Please add it first!!`);
        return -1;


    } else if(dst === undefined) {

        console.log(`A place called ${to} does not exist, Please add it first!!`);
        return -1;

    } else if(path_exist(map, src, dst)) {

        console.log("Path already exists!!");
        return -1;

    } else {

        const srcIdx = get_id(src);
        const dstIdx = get_id(dst);

        const pathfromsrc = make_edge(dst, type);
        const pathfromdst = make_edge(src, type);

        helper_add_path(map, srcIdx, pathfromsrc);
        helper_add_path(map, dstIdx, pathfromdst);

        console.log(`A path from ${from} to ${to} has been added!!`)
        console.log(`A path from ${to} to ${from} has also been added!!`)
        return 0;
    }
    
}

export function rev_path(map: Map, from: string, to: string): number {

    const src = get_node_ht(map, from);
    const dst = get_node_ht(map, to);

    if(src === undefined) {

        console.log(`${from} does not exist!!`);
        return -1;

    } else if(dst === undefined) {

        console.log(`${to} does not exist!!`);
        return -1;


    } else if(!path_exist(map, src, dst)) {

        console.log("Path doesn't exist!!");
        return -1;


    } else {

        const srcIdx = get_id(src);
        const dstIdx = get_id(dst);

        helper_rev_path(map, srcIdx, dstIdx);
        helper_rev_path(map, dstIdx, srcIdx);

        console.log(`A path from ${from} to ${to} has been removed!!`)
        console.log(`A path from ${to} to ${from} has also been removed!!`)
        return 0;
    }
    
}