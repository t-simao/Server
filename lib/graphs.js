"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.undirected = undirected;
exports.build_array = build_array;
exports.mg_new = mg_new;
exports.mg_from_edges = mg_from_edges;
exports.lg_new = lg_new;
exports.lg_from_edges = lg_from_edges;
exports.lg_transpose = lg_transpose;
exports.lg_bfs_visit_order = lg_bfs_visit_order;
exports.lg_dfs_visit_order = lg_dfs_visit_order;
exports.mg_dfs_visit_order = mg_dfs_visit_order;
exports.lg_bfs_visit_order_distance = lg_bfs_visit_order_distance;
exports.lg_dfs_finish_order_Rev = lg_dfs_finish_order_Rev;
exports.mg_has_cycle = mg_has_cycle;
exports.lg_is_stratified = lg_is_stratified;
exports.lg_is_strongly_connected = lg_is_strongly_connected;
exports.lg_restrict = lg_restrict;
const list_1 = require("../lib/list");
const queue_array_1 = require("../lib/queue_array");
// Helper functions
/**
 * Add all reverse edges to an edge list, and remove all self loops.
 * @param el an edge list
 * @returns el with all reverse edges present, and all self loops removed
 */
function undirected(el) {
    if ((0, list_1.is_null)(el)) {
        return el;
    }
    else if ((0, list_1.head)((0, list_1.head)(el)) === (0, list_1.tail)((0, list_1.head)(el))) {
        return undirected((0, list_1.tail)(el));
    }
    else {
        const source = (0, list_1.head)((0, list_1.head)(el));
        const target = (0, list_1.tail)((0, list_1.head)(el));
        return (0, list_1.pair)((0, list_1.pair)(target, source), undirected((0, list_1.filter)(edge => (0, list_1.head)(edge) !== target
            || (0, list_1.tail)(edge) !== source, (0, list_1.tail)(el))));
    }
}
// Build an array based on a function computing the item at each index
function build_array(size, content) {
    const result = Array(size);
    for (var i = 0; i < size; i = i + 1) {
        result[i] = content(i);
    }
    return result;
}
/**
 * Create a new matrix graph with no edges
 * @param size the number of nodes
 * @returns the new matrix graph, where each inner array entry is false.
 */
function mg_new(size) {
    return { size,
        adj: build_array(size, _ => build_array(size, _ => false)) };
}
/**
 * Create a new matrix graph with a given set of edges
 * @param size the number of nodes
 * @param edges an edge list
 * @precondition all node ids in the edge list are < size.
 * @returns the new matrix graph, with the given edges.
 */
function mg_from_edges(size, edges) {
    const result = mg_new(size);
    (0, list_1.for_each)(p => result.adj[(0, list_1.head)(p)][(0, list_1.tail)(p)] = true, edges);
    return result;
}
/**
 * Create a new ListGraph with no edges
 * @param size the number of nodes in the list graph
 * @returns a new list graph with size edges.
 */
function lg_new(size) {
    return { size, adj: build_array(size, _ => null) };
}
/**
 * Create a new ListGraph with a given set of edges
 * @param size the number of nodes in the list graph
 * @param edges an edge list
 * @precondition all node ids in the edge list are < size.
 * @returns the new ListGraph, with the given edges.
 */
function lg_from_edges(size, edges) {
    const result = lg_new(size);
    (0, list_1.for_each)(p => result.adj[(0, list_1.head)(p)] = (0, list_1.pair)((0, list_1.tail)(p), result.adj[(0, list_1.head)(p)]), edges);
    return result;
}
/**
 * Transpose a list graph
 * @param adj input list graph
 * @returns the transpose of adj
 */
function lg_transpose({ size, adj }) {
    const result = lg_new(size);
    for (var i = 0; i < size; i = i + 1) {
        (0, list_1.for_each)(p => result.adj[p] = (0, list_1.pair)(i, result.adj[p]), adj[i]);
    }
    return result;
}
// Graph algorithms
/**
 * Node colours for traversal algorithms
 * @constant white an unvisited node
 * @constant grey a visited but not finished node
 * @constant black a finished node
 */
const white = 1;
const grey = 2;
const black = 3;
/**
 * Get the visit order of a breadth-first traversal of a ListGraph.
 * @param adj the list graph
 * @param initial the id of the starting node. Default 0.
 * @returns A queue with the visited nodes in visiting order.
 */
function lg_bfs_visit_order({ adj, size }, initial = 0) {
    const result = (0, queue_array_1.empty)(); // nodes in the order they are being visited
    const pending = (0, queue_array_1.empty)(); // grey nodes to be processed
    const colour = build_array(size, _ => white);
    // visit a white node
    function bfs_visit(current) {
        colour[current] = grey;
        (0, queue_array_1.enqueue)(current, result);
        (0, queue_array_1.enqueue)(current, pending);
    }
    // paint initial node grey (all others are initialized to white)
    bfs_visit(initial);
    while (!(0, queue_array_1.is_empty)(pending)) {
        // dequeue the head node of the grey queue
        const current = (0, queue_array_1.head)(pending);
        (0, queue_array_1.dequeue)(pending);
        // Paint all white nodes adjacent to current node grey and enqueue them.
        const adjacent_white_nodes = (0, list_1.filter)(node => colour[node] === white, adj[current]);
        (0, list_1.for_each)(bfs_visit, adjacent_white_nodes);
        // paint current node black; the node is now done.
        colour[current] = black;
    }
    return result;
}
/**
 * Get the visit order of a depth-first traversal of a ListGraph.
 * @param adj the list graph
 * @param restart_order the order of nodes to restart the traversal in.
 *      Default: in numeric order 0, 1, 2, ...
 * @returns A queue with the visited nodes in visiting order.
 */
function lg_dfs_visit_order({ adj, size }, restart_order = null) {
    const result = (0, queue_array_1.empty)();
    const colour = build_array(size, _ => white);
    if (restart_order === null) {
        // if no order is given, initialize with all nodes enumerated
        restart_order = (0, list_1.enum_list)(0, size - 1);
    }
    else { }
    // Visit a node.  Each node is processed at most once.
    function dfs_visit(current) {
        if (colour[current] === white) {
            colour[current] = grey;
            (0, queue_array_1.enqueue)(current, result);
            (0, list_1.for_each)(dfs_visit, adj[current]);
            colour[current] = black;
        }
        else { }
    }
    (0, list_1.for_each)(dfs_visit, restart_order);
    return result;
}
/**
 * Get the visit order of a depth-first traversal of a MatrixGraph.
 * @param adj the graph
 * @param restart_order the order of nodes to restart the traversal in.
 *      Default: in numeric order 0, 1, 2, ...
 * @returns A queue with the visited nodes in visiting order.
 */
function mg_dfs_visit_order({ adj, size }, restart_order = null) {
    const result = (0, queue_array_1.empty)();
    const colour = build_array(size, _ => white);
    if (restart_order === null) {
        restart_order = (0, list_1.enum_list)(0, size - 1);
    }
    else { }
    // visit a node. Each node is processed at most once.
    function dfs_visit(current) {
        if (colour[current] === white) {
            colour[current] = grey;
            (0, queue_array_1.enqueue)(current, result);
            for (var sink = 0; sink < size; sink = sink + 1) {
                if (adj[current][sink]) {
                    dfs_visit(sink);
                }
                else { }
            }
            colour[current] = black;
        }
        else { }
    }
    (0, list_1.for_each)(dfs_visit, restart_order);
    return result;
}
function lg_bfs_visit_order_distance({ adj, size }, initial = 0) {
    const result = (0, queue_array_1.empty)(); // nodes in the order they are being visited
    const pending = (0, queue_array_1.empty)(); // grey nodes to be processed
    const colour = build_array(size, _ => white);
    let dist = build_array(size, _ => 0);
    // visit a white node
    function bfs_visit(distance, current) {
        dist[current] = distance;
        colour[current] = grey;
        (0, queue_array_1.enqueue)((0, list_1.pair)(current, distance), result);
        (0, queue_array_1.enqueue)(current, pending);
    }
    // paint initial node grey (all others are initialized to white)
    bfs_visit((dist[initial]), initial);
    while (!(0, queue_array_1.is_empty)(pending)) {
        // dequeue the head node of the grey queue
        const current = (0, queue_array_1.head)(pending);
        (0, queue_array_1.dequeue)(pending);
        // Paint all white nodes adjacent to current node grey and enqueue them.
        let adjacent_white_nodes = (0, list_1.filter)(node => colour[node] === white, adj[current]);
        while (adjacent_white_nodes !== null) {
            bfs_visit((dist[current] + 1), (0, list_1.head)(adjacent_white_nodes));
            adjacent_white_nodes = (0, list_1.tail)(adjacent_white_nodes);
        }
        //for_each(bfs_visit, adjacent_white_nodes);
        // paint current node black; the node is now done.
        colour[current] = black;
    }
    return result;
}
function lg_dfs_finish_order_Rev({ adj, size }, restart_order = null) {
    let result = (0, list_1.list)();
    const colour = build_array(size, _ => white);
    if (restart_order === null) {
        // if no order is given, initialize with all nodes enumerated
        restart_order = (0, list_1.enum_list)(0, size - 1);
    }
    else { }
    // Visit a node.  Each node is processed at most once.
    function dfs_visit(current) {
        if (colour[current] === white) {
            colour[current] = grey;
            //enqueue(current, result);
            (0, list_1.for_each)(dfs_visit, adj[current]);
            colour[current] = black;
            result = (0, list_1.append)((0, list_1.list)(current), result);
        }
        else { }
    }
    (0, list_1.for_each)(dfs_visit, restart_order);
    return result;
}
function mg_has_cycle({ adj, size }, restart_order = null) {
    let result = false;
    const colour = build_array(size, _ => white);
    if (restart_order === null) {
        restart_order = (0, list_1.enum_list)(0, size - 1);
    }
    else { }
    // visit a node. Each node is processed at most once.
    function dfs_visit(current) {
        if (colour[current] === grey) {
            result = true;
        }
        else if (colour[current] === white) {
            colour[current] = grey;
            for (var sink = 0; sink < size; sink = sink + 1) {
                if (adj[current][sink]) {
                    dfs_visit(sink);
                }
                else { }
            }
            colour[current] = black;
        }
        else { }
    }
    (0, list_1.for_each)(dfs_visit, restart_order);
    return result;
}
function lg_is_stratified({ adj, size }, initial_node = 0) {
    const distances = build_array(size, _ => -1); // nodes in the order they are being visited
    let result = true;
    const pending = (0, queue_array_1.empty)(); // grey nodes to be processed
    const colour = build_array(size, _ => white);
    // visit a white node
    function bfs_visit(current, dist) {
        if (colour[current] === white) {
            colour[current] = grey;
            distances[current] = dist;
            (0, queue_array_1.enqueue)(current, pending);
        }
        else if (distances[current] < dist - 1) {
            result = false;
        }
    }
    // paint initial node grey (all others are initialized to white)
    bfs_visit(initial_node, 0);
    while (!(0, queue_array_1.is_empty)(pending)) {
        // dequeue the head node of the grey queue
        const current = (0, queue_array_1.head)(pending);
        (0, queue_array_1.dequeue)(pending);
        // Paint all white nodes adjacent to current node grey and enqueue them.
        let lst = adj[current];
        while (!(0, list_1.is_null)(lst)) {
            bfs_visit((0, list_1.head)(lst), distances[current] + 1);
            lst = (0, list_1.tail)(lst);
        }
        //for_each(bfs_visit, adjacent_white_nodes);
        // paint current node black; the node is now done.
        colour[current] = black;
    }
    return result;
}
function bfs_count(lg, initial = 0) {
    const nodes = lg_bfs_visit_order(lg, initial);
    let counter = 0;
    while (!(0, queue_array_1.is_empty)(nodes)) {
        counter = counter + 1;
        (0, queue_array_1.dequeue)(nodes);
    }
    return counter;
}
function lg_is_strongly_connected(lg, initial = 0) {
    const t_lg = lg_transpose(lg);
    return (bfs_count(lg, initial) === lg.size) && (bfs_count(t_lg, initial) === lg.size);
}
function lg_restrict({ adj, size }, nodes) {
    let result = { size: size, adj: [] };
    for (let i = 0; i < size; i = i + 1) {
        if ((0, list_1.is_member)(i, nodes)) {
            result.adj[i] = (0, list_1.filter)(x => (0, list_1.is_member)(x, nodes), adj[i]);
        }
        else {
            result.adj[i] = (0, list_1.list)();
        }
    }
    return result;
}
/** export function SSC_split(lg: ListGraph): List<ListGraph> {

    let scc = lg_kosaraju(lg);
    let res = null;

    while(!is_null(scc)) {

        const temp = lg_restrict(lg, head(scc));
        res = pair(temp, res);
        scc = tail(scc);
    }

    return res;

} */ 
