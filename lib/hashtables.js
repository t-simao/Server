"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash_id = void 0;
exports.ph_empty = ph_empty;
exports.ph_lookup = ph_lookup;
exports.ph_insert = ph_insert;
exports.ph_delete = ph_delete;
exports.ph_keys = ph_keys;
var list_1 = require("./list");
/**
 * A universal identity function.
 * - For numbers: returns the number as is.
 * - For strings: returns the sum of character codes.
 * @param key the key
 * @returns a numeric representation of the key
 */
var hash_id = function (key) {
    if (typeof key === 'number') {
        return key;
    }
    var sum = 0;
    for (var i = 0; i < key.length; i++) {
        sum += key.charCodeAt(i);
    }
    return sum;
};
exports.hash_id = hash_id;
/**
 * Scan an association list for the given key.
 * @template K the type of keys
 * @template V the type of values
 * @param xs the list to scan
 * @param key the key to scan for
 * @returns the associated value, or undefined if it does not exist.
 */
function scan(xs, key) {
    return (0, list_1.is_null)(xs)
        ? undefined
        : key === (0, list_1.head)((0, list_1.head)(xs))
            ? (0, list_1.tail)((0, list_1.head)(xs))
            : scan((0, list_1.tail)(xs), key);
}
// Compute a remainder that has the same sign as the modulus.
function mod(nmb, modulus) {
    return (nmb % modulus + modulus) % modulus;
}
/**
 * Create an empty probing hash table
 * @template K the type of keys
 * @template V the type of values
 * @param size the maximum number of elements to accomodate
 * @param hash_function the hash function
 * @precondition the key type K contains neither null nor undefined
 * @returns an empty hash table
 */
function ph_empty(size, hash_function) {
    return {
        keys: new Array(size),
        values: new Array(size),
        hash: hash_function,
        entries: 0
    };
}
// helper function implementing probing from a given probe index
function probe(keys, key, hash, skip_null) {
    for (var i = 0; i < keys.length; i = i + 1) {
        var idx = (hash + i) % keys.length;
        if (keys[idx] === key)
            return idx;
        if (keys[idx] === undefined)
            return idx;
        if (!skip_null && keys[idx] === null)
            return idx;
    }
    return undefined;
}
/**
 * Search a hash table for the given key.
 * @template K the type of keys
 * @template V the type of values
 * @param ht the hash table to scan
 * @param key the key to scan for
 * @returns the associated value, or undefined if it does not exist.
 */
function ph_lookup(ht, key) {
    var start_idx = ht.hash(key);
    var idx = probe(ht.keys, key, start_idx, true /* skip null*/);
    return idx === undefined ? undefined : ht.values[idx];
}
function bigger_table(ht) {
    var old_k = ht.keys;
    var old_v = ht.values;
    var ns = ht.keys.length * 2;
    ht.keys = new Array(ns);
    ht.values = new Array(ns);
    ht.entries = 0;
    for (var i = 0; i < old_k.length; i++) {
        var key = old_k[i];
        if (key !== undefined && key !== null) {
            ph_insert(ht, key, old_v[i]);
        }
    }
}
/**
 * Insert a key-value pair into a probing hash table.
 * Overwrites the existing value associated with the key, if any.
 * @template K the type of keys
 * @template V the type of values
 * @param ht the hash table
 * @param key the key to insert at
 * @param value the value to insert
 * @returns true iff the insertion succeeded (the hash table was not full)
 */
function ph_insert(ht, key, value) {
    if (ht.entries >= ht.keys.length * 0.75) {
        bigger_table(ht);
    }
    ;
    var start_idx = ht.hash(key);
    var idx = probe(ht.keys, key, start_idx, false /* don't skip null*/);
    if (idx === undefined) {
        bigger_table(ht);
        var n_si = ht.hash(key);
        idx = probe(ht.keys, key, n_si, false /* don't skip null*/);
    }
    if (idx === undefined)
        return false;
    if (ht.keys[idx] === null) { // Probing stopped at a null slot
        // Probe again from null slot to ensure key is not in ht
        var key_idx = probe(ht.keys, key, idx, true /* skip null */);
        if (key_idx !== undefined) {
            idx = key_idx;
        }
    }
    if (ht.keys[idx] !== key) {
        // Inserting a new entry but entries equal capacity
        if (ht.entries === ht.keys.length) {
            return false;
        }
        else {
            ht.entries += 1;
        }
    }
    ht.keys[idx] = key;
    ht.values[idx] = value;
    return true;
}
/**
 * Delete a key-value pair from a probing hash table.
 * @template K the type of keys
 * @template V the type of values
 * @param ht the hash table
 * @param key the key to delete
 * @returns the value of the key, if the key existed, undefined otherwise
 */
function ph_delete(ht, key) {
    var start_idx = ht.hash(key);
    var idx = probe(ht.keys, key, start_idx, true /* skip null */);
    if (idx === undefined || ht.keys[idx] === undefined) {
        return undefined; // No such key
    }
    else {
        ht.entries -= 1;
        var value = ht.values[idx];
        ht.keys[idx] = null;
        ht.values[idx] = undefined;
        return value;
    }
}
/**
 * Filters out nulls and undefined values from a list, and from its element type
 * @template T the element type of the resulting list
 * @param xs a list with nulls and undefined values
 * @returns the input list without nulls and undefined values
 */
function filterNulls(xs) {
    if ((0, list_1.is_null)(xs)) {
        return null;
    }
    else {
        var x = (0, list_1.head)(xs);
        if (x === undefined || x === null) {
            return filterNulls((0, list_1.tail)(xs));
        }
        else {
            return (0, list_1.pair)(x, filterNulls((0, list_1.tail)(xs)));
        }
    }
}
/**
 * Extract all the keys of a probing hash table
 * @template K
 * @template V
 * @param {ProbingHashtable<K,V>} tab
 * @returns all the keys of the table
 */
function ph_keys(tab) {
    return filterNulls((0, list_1.build_list)(function (i) { return tab.keys[i]; }, tab.keys.length));
}
