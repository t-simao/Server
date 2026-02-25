"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_path = get_path;
const prio_queue_1 = require("./prio_queue");
const graphs_1 = require("./graphs");
const list_1 = require("./list");
const building_1 = require("./building");
function dijkstra(map, srcIdx, dstIdx, to_avoid) {
    const pending = (0, prio_queue_1.empty)();
    const distance = (0, graphs_1.build_array)(map.size, _ => Infinity);
    const parents = (0, graphs_1.build_array)(map.size, _ => -1);
    const pathTypes = (0, graphs_1.build_array)(map.size, _ => "");
    const result = {
        parents: parents,
        pathTypes: pathTypes
    };
    distance[srcIdx] = 0;
    parents[srcIdx] = null;
    pathTypes[srcIdx] = "";
    (0, prio_queue_1.enqueue)(0, srcIdx, pending);
    while (!(0, prio_queue_1.is_empty)(pending)) {
        const current = (0, prio_queue_1.head)(pending); //Idx of the top node
        (0, prio_queue_1.dequeue)(pending);
        if (current === dstIdx) {
            break;
        }
        let adjList = map.adj[current];
        while (adjList !== null) {
            const path = (0, list_1.head)(adjList);
            let cost = path.weight;
            if (path.type === to_avoid) {
                cost = Infinity;
            }
            ;
            const pathDst = path.to; //Idx of the node the path leads to
            if (distance[pathDst] > distance[current] + cost) {
                distance[pathDst] = distance[current] + cost;
                parents[pathDst] = current;
                pathTypes[pathDst] = path.type;
                (0, prio_queue_1.enqueue)(distance[pathDst], pathDst, pending);
            }
            adjList = (0, list_1.tail)(adjList);
        }
    }
    //console.log(parent_type);
    //console.log("___________________-")
    return result;
}
/** MIGHT BE USEFULL: function make_path(map: Map, id: number, path_arr: Array<string>, prt_arr: Array<number | null>): number | null {

    let currPlc = get_name_by_id(map, id);
    path_arr.push(currPlc);

    return prt_arr[id];

}*/
function get_path(map, from, to, to_avoid = "") {
    const src = (0, building_1.get_node_ht)(map, from); //Lookup by string (name)
    const dst = (0, building_1.get_node_ht)(map, to); //Lookup by string (name)
    if (src === undefined) {
        console.log(`${from} does not exist, add the place first!!`);
        return -1;
    }
    else if (dst === undefined) {
        console.log(`${to} does not exist, add the place first!!`);
        return -1;
    }
    else if (from === to) {
        console.log(`${to} You are at your destination!!`);
        return -1;
    }
    else {
        const srcIdx = (0, building_1.get_id)(src);
        const dstIdx = (0, building_1.get_id)(dst);
        const pathInfo = dijkstra(map, srcIdx, dstIdx, to_avoid);
        const parents = pathInfo.parents;
        const pathTypes = pathInfo.pathTypes;
        //console.log(parents);
        //console.log(pathTypes);
        if (parents[dstIdx] === -1) {
            console.log("Path does not exist!!");
            return;
        }
        else {
            let currPlc = (0, building_1.get_name_by_id)(map, dstIdx);
            let currType = pathTypes[dstIdx];
            let pathNodes = [currPlc];
            let pathEdges = [currType];
            let parentId = parents[dstIdx];
            while (parentId !== null && parentId !== -1) {
                currPlc = (0, building_1.get_name_by_id)(map, parentId);
                currType = pathTypes[parentId];
                pathNodes.push(currPlc);
                pathEdges.push(currType);
                parentId = parents[parentId];
            }
            const steps = pathEdges.length - 1;
            //console.log(pathNodes)
            //console.log(pathEdges)
            /** for(let i = steps; i >= 0; i = i - 1) { console.log(`${pathNodes[i]} `); } */
            for (let i = steps; i > 0; i = i - 1) {
                if (i !== 1) {
                    console.log(`${steps - (i - 1)}) ${pathEdges[i - 1]}: ${pathNodes[i]} -> ${pathNodes[i - 1]}`);
                }
                else {
                    console.log(`${steps - (i - 1)}) ${pathEdges[i - 1]}: ${pathNodes[i]} -> ${pathNodes[i - 1]} (ARRIVED :)`);
                }
            }
        }
    }
}
