import { type Pair, type List, head, tail, build_list, pair, is_null } from './list';


/**
 * An auxiliary hash function for use in hash tables
 * It should have good dispersion, but does not need to be difficult to invert or predict.
 * @template K the type of keys
 * @param key the key
 * @returns the hash of the key.
 */
export type HashFunction<K> = (key: K) => number;

/**
 * A universal identity function.
 * - For numbers: returns the number as is.
 * - For strings: returns the sum of character codes.
 * @param key the key
 * @returns a numeric representation of the key
 */
export const hash_id: HashFunction<number | string> = key => {
    if (typeof key === 'number') {
        return key;
    }

    let sum = 0;
    for (let i = 0; i < key.length; i++) {
        sum += key.charCodeAt(i);
    }
    return sum;
};

/**
 * Scan an association list for the given key.
 * @template K the type of keys
 * @template V the type of values
 * @param xs the list to scan
 * @param key the key to scan for
 * @returns the associated value, or undefined if it does not exist.
 */
function scan<K, V>(xs: List<Pair<K, V>>, key: K): V | undefined {
    return  is_null(xs)
            ? undefined
            : key === head(head(xs))
            ? tail(head(xs))
            : scan(tail(xs), key);
}

// Compute a remainder that has the same sign as the modulus.
function mod(nmb:number, modulus:number): number {
    return (nmb % modulus + modulus) % modulus;
}

/**
 * A hash table that resolves collisions by probing
 * @template K the type of keys
 * @template V the type of values
 * @param keys the key array. null means that a key has been deleted.
 * @param values the data associated with each key
 * @param hash the hash function
 * @param entries the number of elements currently in the table
 * @invariant the key type K contains neither null nor undefined
 * @invariant If keys[i] is neither null nor undefined,
 *     then data[i] contains a value of type V.
 * @invariant entries is equal to the number of elements in keys
 *     that are neither null nor undefined.
 */
export type ProbingHashtable<K, V> = {
    keys: Array<K | null | undefined>,
    values: Array<V | undefined>,
    readonly hash: HashFunction<K>,
    entries: number // number of elements
};

/**
 * Create an empty probing hash table
 * @template K the type of keys
 * @template V the type of values
 * @param size the maximum number of elements to accomodate
 * @param hash_function the hash function
 * @precondition the key type K contains neither null nor undefined
 * @returns an empty hash table
 */
export function ph_empty<K, V>(size: number, hash_function: HashFunction<K>): ProbingHashtable<K,V> {
    return {
        keys: new Array(size),
        values: new Array(size),
        hash: hash_function,
        entries: 0
    };
}

// helper function implementing probing from a given probe index
function probe<K>(keys: Array<K | undefined | null>,
    key: K, hash: number, skip_null: boolean): number | undefined {
    for (let i = 0; i < keys.length; i = i + 1) {
        const idx = (hash + i) % keys.length;
        if (keys[idx] === key) return idx;
        if (keys[idx] === undefined) return idx;
        if (!skip_null && keys[idx] === null) return idx;
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
export function ph_lookup<K, V>(ht: ProbingHashtable<K,V>, key: K): V | undefined {
    const start_idx = ht.hash(key);
    const idx = probe(ht.keys, key, start_idx, true /* skip null*/);

    return idx === undefined ? undefined : ht.values[idx]!;
}

function bigger_table<K, V>(ht: ProbingHashtable<K, V>): void {
    const old_k = ht.keys
    const old_v = ht.values

    const ns = ht.keys.length * 2
    ht.keys = new Array(ns)
    ht.values = new Array(ns)
    ht.entries = 0;
    for(let i = 0; i < old_k.length; i++) {
        const key = old_k[i]
        if (key !== undefined && key !== null) {
            ph_insert(ht, key, old_v[i])
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
export function ph_insert<K, V>(ht: ProbingHashtable<K,V>, key: K, value: V): boolean {

    if (ht.entries >= ht.keys.length * 0.75) {bigger_table(ht)};

    const start_idx = ht.hash(key);
    let idx = probe(ht.keys, key, start_idx, false /* don't skip null*/);

    if (idx === undefined) {
        bigger_table(ht);

        const n_si = ht.hash(key);
        idx = probe(ht.keys, key, n_si, false /* don't skip null*/);
    } 

    if (idx === undefined) return false;

    if (ht.keys[idx] === null) { // Probing stopped at a null slot
    // Probe again from null slot to ensure key is not in ht
        const key_idx = probe(ht.keys, key, idx, true /* skip null */);
        if (key_idx !== undefined) {
            idx = key_idx;
        }
    }

    if (ht.keys[idx] !== key) {
    // Inserting a new entry but entries equal capacity
        if (ht.entries === ht.keys.length) {
            return false;
        } else {
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
export function ph_delete<K, V>(ht: ProbingHashtable<K,V>, key: K): V | undefined {
    const start_idx = ht.hash(key);
    const idx = probe(ht.keys, key, start_idx, true /* skip null */);

    if (idx === undefined || ht.keys[idx] === undefined) {
        return undefined; // No such key
    } else {
        ht.entries -= 1;
        const value = ht.values[idx];
        ht.keys[idx] = null;
        ht.values[idx] = undefined;
        return value!;
    }
}

/**
 * Filters out nulls and undefined values from a list, and from its element type
 * @template T the element type of the resulting list
 * @param xs a list with nulls and undefined values
 * @returns the input list without nulls and undefined values
 */
function filterNulls<T>(xs:List<T | undefined | null>): List<T> {
    if (is_null(xs)) {
        return null;
    } else {
        const x = head(xs);
        if (x === undefined || x === null) {
            return filterNulls(tail(xs));
        } else {
            return pair(x, filterNulls(tail(xs)));
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
export function ph_keys<K, V>(tab: ProbingHashtable<K,V>): List<K> {
    return filterNulls(build_list(i => tab.keys[i], tab.keys.length));
}