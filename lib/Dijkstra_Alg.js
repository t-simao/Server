"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_path = get_path;
var prio_queue_1 = require("./prio_queue");
var graphs_1 = require("./graphs");
var list_1 = require("./list");
var building_1 = require("./building");
function dijkstra(map, srcIdx, dstIdx, to_avoid) {
    var pending = (0, prio_queue_1.empty)();
    var distance = (0, graphs_1.build_array)(map.size, function (_) { return Infinity; });
    var parents = (0, graphs_1.build_array)(map.size, function (_) { return -1; });
    var pathTypes = (0, graphs_1.build_array)(map.size, function (_) { return ""; });
    var result = {
        parents: parents,
        pathTypes: pathTypes
    };
    distance[srcIdx] = 0;
    parents[srcIdx] = null;
    pathTypes[srcIdx] = "";
    (0, prio_queue_1.enqueue)(0, srcIdx, pending);
    while (!(0, prio_queue_1.is_empty)(pending)) {
        var current = (0, prio_queue_1.head)(pending); //Idx of the top node
        (0, prio_queue_1.dequeue)(pending);
        if (current === dstIdx) {
            break;
        }
        var adjList = map.adj[current];
        while (adjList !== null) {
            var path = (0, list_1.head)(adjList);
            var cost = path.weight;
            if (path.type === to_avoid) {
                cost = Infinity;
            }
            ;
            var pathDst = path.to; //Idx of the node the path leads to
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
function get_path(map, from, to, to_avoid) {
    if (to_avoid === void 0) { to_avoid = ""; }
    var src = (0, building_1.get_node_ht)(map, from); //Lookup by string (name)
    var dst = (0, building_1.get_node_ht)(map, to); //Lookup by string (name)
    if (src === undefined) {
        console.log("".concat(from, " does not exist, add the place first!!"));
        return -1;
    }
    else if (dst === undefined) {
        console.log("".concat(to, " does not exist, add the place first!!"));
        return -1;
    }
    else if (from === to) {
        console.log("".concat(to, " You are at your destination!!"));
        return -1;
    }
    else {
        var srcIdx = (0, building_1.get_id)(src);
        var dstIdx = (0, building_1.get_id)(dst);
        var pathInfo = dijkstra(map, srcIdx, dstIdx, to_avoid);
        var parents = pathInfo.parents;
        var pathTypes = pathInfo.pathTypes;
        //console.log(parents);
        //console.log(pathTypes);
        if (parents[dstIdx] === -1) {
            console.log("Path does not exist!!");
            return;
        }
        else {
            var currPlc = (0, building_1.get_name_by_id)(map, dstIdx);
            var currType = pathTypes[dstIdx];
            var pathNodes = [currPlc];
            var pathEdges = [currType];
            var parentId = parents[dstIdx];
            while (parentId !== null && parentId !== -1) {
                currPlc = (0, building_1.get_name_by_id)(map, parentId);
                currType = pathTypes[parentId];
                pathNodes.push(currPlc);
                pathEdges.push(currType);
                parentId = parents[parentId];
            }
            var steps = pathEdges.length - 1;
            //console.log(pathNodes)
            //console.log(pathEdges)
            /** for(let i = steps; i >= 0; i = i - 1) { console.log(`${pathNodes[i]} `); } */
            for (var i = steps; i > 0; i = i - 1) {
                if (i !== 1) {
                    console.log("".concat(steps - (i - 1), ") ").concat(pathEdges[i - 1], ": ").concat(pathNodes[i], " -> ").concat(pathNodes[i - 1]));
                }
                else {
                    console.log("".concat(steps - (i - 1), ") ").concat(pathEdges[i - 1], ": ").concat(pathNodes[i], " -> ").concat(pathNodes[i - 1], " (ARRIVED :)"));
                }
            }
        }
    }
}
