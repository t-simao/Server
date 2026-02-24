"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pathway_cost = exports.Pathway_type_arr = void 0;
exports.get_node_ht = get_node_ht;
exports.get_node_arr = get_node_arr;
exports.get_id = get_id;
exports.get_name = get_name;
exports.get_name_by_id = get_name_by_id;
exports.make_map = make_map;
exports.add_place = add_place;
exports.add_path = add_path;
exports.rev_path = rev_path;
var list_1 = require("./list");
var hashtables_1 = require("./hashtables");
exports.Pathway_type_arr = ["hallway_S", "hallway_L", "elevator", "ramp", "stairs", "hallway_C"];
exports.Pathway_cost = {
    hallway_S: 5,
    ramp: 8,
    hallway_C: 10,
    hallway_L: 10,
    elevator: 12,
    stairs: 20
};
// Helper functions
function make_node(name, floor, idx) {
    return {
        id: idx,
        name: name,
        floor: floor
    };
}
function make_edge(to, type) {
    var Weight = exports.Pathway_cost[type];
    return {
        to: to.id,
        type: type,
        weight: Weight
    };
}
function helper_add_path(map, idx, path) {
    map.adj[idx] = (0, list_1.pair)(path, map.adj[idx]);
}
function get_dst(map, edge) {
    var dst = map.nodes[edge.to];
    return dst.name;
}
function get_node_ht(map, place) {
    return (0, hashtables_1.ph_lookup)(map.places, place);
    ;
}
function get_node_arr(map, idx) {
    return map.nodes[idx];
}
function get_id(node) {
    return node.id;
    ;
}
function get_name(node) {
    return node.name;
}
function get_name_by_id(map, id) {
    var arr = map.nodes;
    var curr_node = arr[id];
    return curr_node.name;
}
function helper_rev_path(map, idx, dst) {
    var allpaths_fromsrc = map.adj[idx];
    var temp = null;
    while (allpaths_fromsrc !== null) {
        if ((0, list_1.head)(allpaths_fromsrc).to !== dst) {
            temp = (0, list_1.pair)((0, list_1.head)(allpaths_fromsrc), temp);
        }
        allpaths_fromsrc = (0, list_1.tail)(allpaths_fromsrc);
    }
    map.adj[idx] = temp;
}
function path_exist(map, from, to) {
    var src_idx = get_id(from);
    var allpaths_fromsrc = map.adj[src_idx];
    while (allpaths_fromsrc !== null) {
        if ((0, list_1.head)(allpaths_fromsrc).to === to.id) {
            return true;
        }
        allpaths_fromsrc = (0, list_1.tail)(allpaths_fromsrc);
    }
    return false;
}
// Main functions
/**
 * Maken an empty graph which satisfies the Map type
 * @returns a graph which satisfies the Map type
 */
function make_map() {
    return {
        places: (0, hashtables_1.ph_empty)(15, hashtables_1.hash_id),
        nodes: [],
        adj: [],
        size: 0
    };
}
function add_place(map, name, floor) {
    if (get_node_ht(map, name) !== undefined) {
        console.log("A place called ".concat(name, " already exists!!"));
        return -1;
    }
    else if (name === "") {
        console.log("Enter A valid name for the place!!");
        return -1;
    }
    else {
        var idx = map.size;
        var key = name;
        var node = make_node(name, floor, idx);
        (0, hashtables_1.ph_insert)(map.places, key, node);
        map.adj.push((0, list_1.list)());
        map.nodes[idx] = node;
        map.size = map.size + 1;
        console.log(name);
        console.log("".concat(name, " was added to floor number ").concat(floor));
        return 0;
    }
}
function add_path(map, from, type, to) {
    var src = get_node_ht(map, from);
    var dst = get_node_ht(map, to);
    if (src === undefined) {
        console.log("A place called ".concat(from, " does not exist, Please add it first!!"));
        return -1;
    }
    else if (dst === undefined) {
        console.log("A place called ".concat(to, " does not exist, Please add it first!!"));
        return -1;
    }
    else if (path_exist(map, src, dst)) {
        console.log("Path already exists!!");
        return -1;
    }
    else {
        var srcIdx = get_id(src);
        var dstIdx = get_id(dst);
        var pathfromsrc = make_edge(dst, type);
        var pathfromdst = make_edge(src, type);
        helper_add_path(map, srcIdx, pathfromsrc);
        helper_add_path(map, dstIdx, pathfromdst);
        console.log("A path from ".concat(from, " to ").concat(to, " has been added!!"));
        console.log("A path from ".concat(to, " to ").concat(from, " has also been added!!"));
        return 0;
    }
}
function rev_path(map, from, to) {
    var src = get_node_ht(map, from);
    var dst = get_node_ht(map, to);
    if (src === undefined) {
        console.log("".concat(from, " does not exist!!"));
        return -1;
    }
    else if (dst === undefined) {
        console.log("".concat(to, " does not exist!!"));
        return -1;
    }
    else if (!path_exist(map, src, dst)) {
        console.log("Path doesn't exist!!");
        return -1;
    }
    else {
        var srcIdx = get_id(src);
        var dstIdx = get_id(dst);
        helper_rev_path(map, srcIdx, dstIdx);
        helper_rev_path(map, dstIdx, srcIdx);
        console.log("A path from ".concat(from, " to ").concat(to, " has been removed!!"));
        console.log("A path from ".concat(to, " to ").concat(from, " has also been removed!!"));
        return 0;
    }
}
