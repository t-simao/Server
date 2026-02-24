"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.map = void 0;
exports.get_node_ht = get_node_ht;
exports.get_node_arr = get_node_arr;
exports.get_id = get_id;
exports.get_name = get_name;
exports.get_name_by_id = get_name_by_id;
exports.make_map = make_map;
exports.add_place = add_place;
exports.add_edge = add_edge;
exports.rev_edge = rev_edge;
var list_1 = require("./list");
var hashtables_1 = require("./hashtables");
var Pathway_const = {
    Hallway_S: 5,
    Ramp: 8,
    Hallway_L: 10,
    Elevator: 12,
    Stairs: 20 //TESTING SOMETHING!!!!!!!!!!!!!!!!!!!!!!!!!!!NEEDS TO CHANGE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
    var Weight = Pathway_const[type];
    return {
        to: to.id,
        type: type,
        weight: Weight
    };
}
function add_path(map, idx, path) {
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
function rev_path(map, idx, dst) {
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
        console.log("".concat(name, " already exist, no need to add!!"));
        return;
    }
    var idx = map.size;
    var key = name;
    var node = make_node(name, floor, idx);
    (0, hashtables_1.ph_insert)(map.places, key, node);
    map.adj.push((0, list_1.list)());
    map.nodes[idx] = node;
    map.size = map.size + 1;
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
function add_edge(map, from, type, to) {
    var src = get_node_ht(map, from);
    var dst = get_node_ht(map, to);
    if (src === undefined) {
        console.log("".concat(from, " does not exist!!"));
    }
    else if (dst === undefined) {
        console.log("".concat(to, " does not exist!!"));
    }
    else if (path_exist(map, src, dst)) {
        console.log("Path already exists!!");
    }
    else {
        var srcIdx = get_id(src);
        var dstIdx = get_id(dst);
        var pathfromsrc = make_edge(dst, type);
        var pathfromdst = make_edge(src, type);
        add_path(map, srcIdx, pathfromsrc);
        add_path(map, dstIdx, pathfromdst);
    }
}
function rev_edge(map, from, to) {
    var src = get_node_ht(map, from);
    var dst = get_node_ht(map, to);
    if (src === undefined) {
        console.log("".concat(from, " does not exist!!"));
    }
    else if (dst === undefined) {
        console.log("".concat(to, " does not exist!!"));
    }
    else if (!path_exist(map, src, dst)) {
        console.log("Path doesn't exist!!");
    }
    else {
        var srcIdx = get_id(src);
        var dstIdx = get_id(dst);
        rev_path(map, srcIdx, dstIdx);
        rev_path(map, dstIdx, srcIdx);
    }
}
/** console.log(map.nodes[0]);
let r = map.adj[0];

console.log("__________________PATHS FROM ENTRANCE_____________________________________")
while(r !== null) {
    console.log(head(r));
    r = tail(r)
    console.log("_______________________________________________________")
}

console.log("__________________ALL NODES_____________________________________")

for(let i = 0; i < map.nodes.length; i = i + 1) {
    console.log("__________________________THEIR NAME FROM ARRAY____________________________")
    console.log(get_name(map.nodes[i]));

    console.log("_________________________THE FULL NODE INFO_____________________________")
    console.log(map.nodes[i]);

} */
exports.map = make_map();
// ---------- FLOOR 1 ----------
add_place(exports.map, "Entrance", 1); //0
add_place(exports.map, "Reception", 1); //1
add_place(exports.map, "Library", 1); //2
add_place(exports.map, "Café", 1); //3
add_place(exports.map, "HallA", 1); //4
add_place(exports.map, "Stairs1", 1); //5
add_place(exports.map, "Elevator1", 1); //6
// ---------- FLOOR 2 ----------
add_place(exports.map, "HallB", 2); //7
add_place(exports.map, "ComputerLab", 2); //8
add_place(exports.map, "StudyRoom", 2); //9
add_place(exports.map, "Lounge", 2); //10
add_place(exports.map, "Stairs2", 2); //11
add_place(exports.map, "Elevator2", 2); //12
// ---------- FLOOR 3 ----------
add_place(exports.map, "HallC", 3); //13
add_place(exports.map, "OfficeA", 3); //14
add_place(exports.map, "OfficeB", 3); //15
add_place(exports.map, "ConferenceRoom", 3); //16
add_place(exports.map, "Stairs3", 3); //17
add_place(exports.map, "Elevator3", 3); //18
add_edge(exports.map, "Entrance", "Hallway_S", "Reception");
add_edge(exports.map, "Reception", "Hallway_L", "HallA");
add_edge(exports.map, "HallA", "Hallway_S", "Library");
add_edge(exports.map, "HallA", "Hallway_L", "Café");
add_edge(exports.map, "HallA", "Hallway_L", "Stairs1");
add_edge(exports.map, "HallA", "Hallway_S", "Elevator1");
add_edge(exports.map, "HallB", "Hallway_L", "ComputerLab");
add_edge(exports.map, "HallB", "Hallway_S", "StudyRoom");
add_edge(exports.map, "HallB", "Hallway_L", "Lounge");
add_edge(exports.map, "HallC", "Hallway_S", "OfficeA");
add_edge(exports.map, "HallC", "Hallway_L", "OfficeB");
add_edge(exports.map, "HallC", "Hallway_L", "ConferenceRoom");
add_edge(exports.map, "HallC", "Hallway_L", "Elevator3");
add_edge(exports.map, "Stairs1", "Stairs", "Stairs2");
add_edge(exports.map, "Stairs2", "Stairs", "Stairs3");
add_edge(exports.map, "Elevator1", "Elevator", "Elevator2");
add_edge(exports.map, "Elevator2", "Elevator", "Elevator3");
add_edge(exports.map, "Stairs2", "Hallway_L", "HallB");
add_edge(exports.map, "Elevator2", "Hallway_L", "HallB");
add_edge(exports.map, "Stairs3", "Hallway_S", "HallC");
